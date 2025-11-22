import math
import warnings
from typing import List, Optional

import librosa
import numpy as np
import parselmouth
from parselmouth.praat import call as praat_call

from ....domain.models.prosody import (
    IntensityAnalysis,
    IntensityContour,
    PitchAnalysis,
    PitchContour,
    VocalQualityAnalysis,
)
from ....domain.ports.output import AudioPort


class AudioAdapter(AudioPort):
    @classmethod
    def get_audio_duration(cls, audio_path: str) -> float:
        """
        Get the duration of an audio file in seconds.

        :param audio_path: Path to the audio file.
        :return: Duration of the audio file in seconds.
        """
        try:
            return librosa.get_duration(path=audio_path)
        except Exception as e:
            raise RuntimeError(f'Error getting audio duration: {e}')

    @classmethod
    def get_filtered_audio(cls, audio_path: str) -> parselmouth.Sound:
        LOWCUT = 80
        HIGHCUT = 8000
        SMOOTH = 300

        sound = parselmouth.Sound(audio_path)

        filtered_sound = praat_call(
            sound,
            'Filter (pass Hann band)',
            LOWCUT,
            HIGHCUT,
            SMOOTH,
        )

        return filtered_sound

    @classmethod
    def get_pitch(
        cls,
        sound: parselmouth.Sound,
        time_step: float,
        pitch_floor: float = 75,
        pitch_ceiling: float = 600,
    ) -> parselmouth.Pitch:
        return praat_call(
            sound, 'To Pitch', time_step, pitch_floor, pitch_ceiling
        )

    @classmethod
    def get_intensity(
        cls,
        sound: parselmouth.Sound,
        time_step: float,
        minimum_pitch: float = 75,
    ) -> parselmouth.Intensity:
        return praat_call(sound, 'To Intensity', minimum_pitch, time_step)

    @staticmethod
    def is_valid_value(value: float) -> bool:
        return not (math.isnan(value) or math.isinf(value))

    @staticmethod
    def _downsample_data(
        time_values: List[float],
        y_values: List[Optional[float]],
        target_points: int = 800,
    ) -> tuple[List[float], List[Optional[float]]]:
        total_points = len(time_values)

        if total_points <= target_points:
            return time_values, y_values

        indices = np.linspace(0, total_points, target_points + 1).astype(int)

        new_times = []
        new_values = []

        y_np = np.array(
            [v if v is not None else np.nan for v in y_values], dtype=float
        )

        t_np = np.array(time_values, dtype=float)

        for i in range(len(indices) - 1):
            start_idx = indices[i]
            end_idx = indices[i + 1]

            chunk_y = y_np[start_idx:end_idx]
            chunk_t = t_np[start_idx:end_idx]

            if len(chunk_y) == 0:
                continue

            avg_time = np.mean(chunk_t)
            new_times.append(round(avg_time, 2))

            with warnings.catch_warnings():
                warnings.simplefilter('ignore', category=RuntimeWarning)
                avg_val = np.nanmean(chunk_y)

            if np.isnan(avg_val):
                new_values.append(None)
            else:
                new_values.append(round(avg_val, 2))

        return new_times, new_values

    @classmethod
    def get_pitch_analysis(cls, audio_path: str) -> PitchAnalysis:
        try:
            sound = cls.get_filtered_audio(audio_path)
            pitch = cls.get_pitch(sound, 0.0)

            mean_pitch = praat_call(pitch, 'Get mean', 0, 0, 'Hertz')

            min_pitch = praat_call(
                pitch, 'Get minimum', 0, 0, 'Hertz', 'Parabolic'
            )

            max_pitch = praat_call(
                pitch, 'Get maximum', 0, 0, 'Hertz', 'Parabolic'
            )

            stdev_pitch = praat_call(
                pitch, 'Get standard deviation', 0, 0, 'Hertz'
            )

            mean_pitch = mean_pitch if cls.is_valid_value(mean_pitch) else 0.0
            min_pitch = min_pitch if cls.is_valid_value(min_pitch) else 0.0
            max_pitch = max_pitch if cls.is_valid_value(max_pitch) else 0.0
            stdev_pitch = stdev_pitch if cls.is_valid_value(stdev_pitch) else 0.0

            stdev_pitch_semitones = cls.get_pitch_stdev_semitones(
                pitch, reference_freq=mean_pitch
            )

            pitch_contour = cls.get_pitch_contour(audio_path)

            return PitchAnalysis(
                mean_pitch=mean_pitch,
                min_pitch=min_pitch,
                max_pitch=max_pitch,
                stdev_pitch=stdev_pitch,
                stdev_pitch_semitones=stdev_pitch_semitones,
                pitch_contour=pitch_contour,
            )

        except Exception as e:
            raise RuntimeError(f'Error analyzing pitch: {e}')

    @classmethod
    def get_pitch_stdev_semitones(
        cls, pitch: parselmouth.Pitch, reference_freq: float = None
    ) -> float:
        try:
            MIN_VOICED_VALUE_LENGTH = 2
            pitch_values = pitch.selected_array['frequency']

            voiced_f0_values = pitch_values[
                (pitch_values > 0) & (~np.isnan(pitch_values))
            ]

            if len(voiced_f0_values) < MIN_VOICED_VALUE_LENGTH:
                return 0.0

            if reference_freq is None:
                reference_freq = np.mean(voiced_f0_values)

            semitone_values = 12 * np.log2(voiced_f0_values / reference_freq)
            stdev_semitones = np.std(semitone_values)

            return (
                stdev_semitones if cls.is_valid_value(stdev_semitones) else 0.0
            )

        except Exception as e:
            raise RuntimeError(f'Error calculating pitch in semitones: {e}')

    @classmethod
    def get_pitch_contour(cls, audio_path: str) -> List[PitchContour]:
        try:
            sound = cls.get_filtered_audio(audio_path)

            pitch = cls.get_pitch(sound, 0.01)

            contour = []
            time_values = []
            pitch_values = []

            frames = praat_call(pitch, 'Get number of frames')
            for i in range(1, frames + 1):
                time = praat_call(pitch, 'Get time from frame number', i)

                f0_value = praat_call(
                    pitch, 'Get value at time', time, 'Hertz', 'Linear'
                )

                pitch_value = None

                if not (np.isnan(f0_value) or f0_value == 0):
                    pitch_value = round(f0_value, 2)

                time_values.append(time)
                pitch_values.append(pitch_value)

            downsampled_times, downsampled_pitches = cls._downsample_data(
                time_values, pitch_values, target_points=500
            )

            for time, pitch_val in zip(downsampled_times, downsampled_pitches):
                contour.append(PitchContour(time=time, pitch=pitch_val))

            return contour

        except Exception as e:
            raise RuntimeError(f'Error extracting pitch contour: {e}')

    @classmethod
    def get_intensity_analysis(cls, audio_path: str) -> IntensityAnalysis:
        try:
            sound = parselmouth.Sound(audio_path)

            intensity = sound.to_intensity(minimum_pitch=75.0)

            pitch = sound.to_pitch(pitch_floor=75.0, pitch_ceiling=600.0)

            voiced_intensity_values = []

            for t in intensity.xs():
                if pitch.get_value_at_time(t) > 0:
                    value = intensity.get_value(t)
                    if value != -np.inf:
                        voiced_intensity_values.append(value)

            if not voiced_intensity_values:
                return IntensityAnalysis(
                    mean_intensity=0.0,
                    min_intensity=0.0,
                    max_intensity=0.0,
                    stdev_intensity=0.0,
                    intensity_contour=[],
                )

            mean_intensity = np.mean(voiced_intensity_values)
            min_intensity = np.min(voiced_intensity_values)
            max_intensity = np.max(voiced_intensity_values)
            stdev_intensity = np.std(voiced_intensity_values)

            intensity_contour = cls.get_intensity_contour(audio_path)
            return IntensityAnalysis(
                mean_intensity=float(mean_intensity),
                min_intensity=float(min_intensity),
                max_intensity=float(max_intensity),
                stdev_intensity=float(stdev_intensity),
                intensity_contour=intensity_contour,
            )

        except Exception as e:
            raise RuntimeError(f'Error analyzing intensity: {e}')

    @classmethod
    def get_intensity_contour(cls, audio_path: str) -> List[IntensityContour]:
        try:
            sound = cls.get_filtered_audio(audio_path)

            intensity = cls.get_intensity(sound, 0.01)

            n_frames = praat_call(intensity, 'Get number of frames')

            contour = []
            time_values = []
            intensity_values = []

            for frame_number in range(1, n_frames + 1):
                time = praat_call(
                    intensity, 'Get time from frame number', frame_number
                )

                db_value = praat_call(
                    intensity, 'Get value in frame', frame_number
                )

                volume_value = None

                if not (np.isnan(db_value) or db_value == 0):
                    volume_value = round(db_value, 2)

                time_values.append(time)
                intensity_values.append(volume_value)

            downsampled_times, downsampled_volumes = cls._downsample_data(
                time_values, intensity_values, target_points=500
            )

            for time, volume in zip(downsampled_times, downsampled_volumes):
                contour.append(IntensityContour(time=time, volume=volume))
            return contour

        except Exception as e:
            raise RuntimeError(f'Error analyzing intensity contour: {e}')

    @classmethod
    def get_vocal_quality(cls, audio_path: str) -> VocalQualityAnalysis:
        try:
            sound = cls.get_filtered_audio(audio_path)
            praat_call(sound, 'Scale intensity', 70.0)

            pitch = cls.get_pitch(sound, 0.0)
            pulses = cls._get_pulses(sound, pitch)

            hnr = cls._calculate_hnr(sound, pitch)
            voiced_segments = cls._get_voiced_segments(pitch)

            jitter, shimmer = cls._calculate_jitter_shimmer_optimized(
                sound, pulses, voiced_segments
            )

            return VocalQualityAnalysis(
                jitter=jitter * 100 if cls.is_valid_value(jitter) else 0.0,
                shimmer=shimmer * 100 if cls.is_valid_value(shimmer) else 0.0,
                hnr=hnr if cls.is_valid_value(hnr) else 0.0,
            )
        except Exception as e:
            raise RuntimeError(f'Error analyzing vocal quality: {e}')

    @classmethod
    def _get_pulses(cls, sound: parselmouth.Sound, pitch: parselmouth.Pitch):
        """Get point process (pulses) from sound and pitch."""
        try:
            return praat_call(
                [sound, pitch], 'To PointProcess (peaks)', 'yes', 'no'
            )
        except Exception:
            return praat_call([sound, pitch], 'To PointProcess (cc)')

    @classmethod
    def _calculate_hnr(
        cls, sound: parselmouth.Sound, pitch: parselmouth.Pitch
    ) -> float:
        """Calculate harmonics-to-noise ratio."""
        MIN_HNR_VALUE = -10.0

        harmonicity = praat_call(
            sound, 'To Harmonicity (cc)', 0.01, 75, 0.1, 1.0
        )

        hnr_values = []
        num_frames = praat_call(pitch, 'Get number of frames')

        for i in range(1, num_frames + 1):
            time = praat_call(pitch, 'Get time from frame number', i)
            f0 = praat_call(pitch, 'Get value in frame', i, 'Hertz')

            if not (f0 > 0 and not np.isnan(f0)):
                continue

            hnr_val = praat_call(harmonicity, 'Get value at time', time, 'cubic')

            if not np.isnan(hnr_val) and hnr_val > MIN_HNR_VALUE:
                hnr_values.append(hnr_val)

        return np.mean(hnr_values) if hnr_values else 0.0

    # Manter a versão antiga para referência temporariamente
    @classmethod
    def _get_voiced_segments_old(cls, pitch: parselmouth.Pitch) -> List[tuple]:
        """Extract voiced segments from pitch."""
        MIN_VOICED_SEGMENT_DURATION = 0.4
        MAX_GAP = 0.1

        voiced_segments = []
        segment_start = None
        last_voiced_time = None
        num_frames = praat_call(pitch, 'Get number of frames')

        for i in range(1, num_frames + 1):
            time = praat_call(pitch, 'Get time from frame number', i)
            f0 = praat_call(pitch, 'Get value in frame', i, 'Hertz')

            is_voiced = f0 > 0 and not np.isnan(f0)

            if not is_voiced:
                continue

            if segment_start is None:
                segment_start = time
            elif last_voiced_time and (time - last_voiced_time) > MAX_GAP:
                duration = last_voiced_time - segment_start
                if duration >= MIN_VOICED_SEGMENT_DURATION:
                    voiced_segments.append((segment_start, last_voiced_time))
                segment_start = time

            last_voiced_time = time

        if segment_start and last_voiced_time:
            duration = last_voiced_time - segment_start
            if duration >= MIN_VOICED_SEGMENT_DURATION:
                voiced_segments.append((segment_start, last_voiced_time))

        return voiced_segments

    @classmethod
    def _get_voiced_segments(cls, pitch: parselmouth.Pitch) -> List[tuple]:
        """Extract voiced segments from pitch using vectorized operations."""
        MIN_VOICED_SEGMENT_DURATION = 0.4
        MAX_GAP = 0.1

        times, f0_values = cls._extract_pitch_frames(pitch)

        # Identificar frames com voz usando operações vetorizadas (NumPy)
        is_voiced = (f0_values > 0) & (~np.isnan(f0_values))

        if not np.any(is_voiced):
            return []

        # Encontrar transições voiced/unvoiced
        voiced_diff = np.diff(is_voiced.astype(int))
        starts = np.where(voiced_diff == 1)[0] + 1
        ends = np.where(voiced_diff == -1)[0] + 1

        # Ajustar se começar ou terminar voiced
        if is_voiced[0]:
            starts = np.concatenate([[0], starts])
        if is_voiced[-1]:
            ends = np.concatenate([ends, [len(is_voiced)]])

        voiced_segments = []

        for start_idx, end_idx in zip(starts, ends):
            segment_start = times[start_idx]
            segment_end = times[end_idx - 1]
            duration = segment_end - segment_start

            if duration >= MIN_VOICED_SEGMENT_DURATION:
                voiced_segments.append((segment_start, segment_end))

        # Mesclar segmentos próximos
        if len(voiced_segments) > 1:
            merged_segments = [voiced_segments[0]]

            for current_start, current_end in voiced_segments[1:]:
                prev_start, prev_end = merged_segments[-1]

                if current_start - prev_end <= MAX_GAP:
                    # Mesclar segmentos estendendo o fim do anterior
                    merged_segments[-1] = (prev_start, current_end)
                else:
                    merged_segments.append((current_start, current_end))

            # Filtrar segmentos mesclados por duração mínima novamente
            voiced_segments = [
                seg
                for seg in merged_segments
                if seg[1] - seg[0] >= MIN_VOICED_SEGMENT_DURATION
            ]

        return voiced_segments

    @classmethod
    def _extract_pitch_frames(cls, pitch: parselmouth.Pitch) -> tuple:
        """Extract time and f0 values from pitch object."""
        num_frames = praat_call(pitch, 'Get number of frames')

        times = []
        f0_values = []

        for i in range(1, num_frames + 1):
            time = praat_call(pitch, 'Get time from frame number', i)
            f0 = praat_call(pitch, 'Get value in frame', i, 'Hertz')
            times.append(time)
            f0_values.append(f0)

        return np.array(times), np.array(f0_values)

    @classmethod
    def _calculate_jitter_shimmer_optimized(
        cls, sound: parselmouth.Sound, pulses, voiced_segments: List[tuple]
    ) -> tuple[float, float]:
        """
        Calculate jitter and shimmer values with optimized performance.
        """
        MAX_JITTER = 0.05
        MAX_SHIMMER = 0.15
        MIN_VALID_PULSES = 10

        if not voiced_segments:
            return 0.0, 0.0

        # Otimização: Extrair todos os tempos de pulsos de uma vez só
        num_pulses = praat_call(pulses, 'Get number of points')

        if num_pulses < MIN_VALID_PULSES:
            return 0.0, 0.0

        pulse_times = np.array([
            praat_call(pulses, 'Get time from index', p)
            for p in range(1, num_pulses + 1)
        ])

        jitter_values = []
        shimmer_values = []
        durations = []

        for start, end in voiced_segments:
            duration = end - start

            # Contar pulsos no segmento usando operações vetorizadas
            segment_mask = (pulse_times >= start) & (pulse_times <= end)
            pulses_count = np.sum(segment_mask)

            if pulses_count < MIN_VALID_PULSES:
                continue

            try:
                # Calcular jitter e shimmer para o segmento inteiro
                jitter = praat_call(
                    pulses, 'Get jitter (rap)', start, end, 0.0001, 0.02, 1.3
                )

                shimmer = praat_call(
                    [sound, pulses],
                    'Get shimmer (apq3)',
                    start,
                    end,
                    0.0001,
                    0.02,
                    1.3,
                    1.6,
                )

                # Validar valores
                if (
                    not np.isnan(jitter)
                    and 0 < jitter < MAX_JITTER
                    and not np.isnan(shimmer)
                    and 0 < shimmer < MAX_SHIMMER
                ):
                    jitter_values.append(jitter)
                    shimmer_values.append(shimmer)
                    durations.append(duration)

            except Exception:
                continue

        if not durations:
            return 0.0, 0.0

        # Calcular média ponderada pela duração
        total_dur = sum(durations)

        if total_dur == 0:
            return 0.0, 0.0

        jitter = sum(j * d for j, d in zip(jitter_values, durations)) / total_dur

        shimmer = (
            sum(s * d for s, d in zip(shimmer_values, durations)) / total_dur
        )

        return jitter, shimmer

    # Manter a versão antiga para referência temporariamente
    @classmethod
    def _calculate_jitter_shimmer_old(
        cls, sound: parselmouth.Sound, pulses, voiced_segments: List[tuple]
    ) -> tuple[float, float]:
        """Calculate jitter and shimmer values."""
        MAX_JITTER = 0.05
        MAX_SHIMMER = 0.15
        min_valid_pulses = 10

        num_pulses = praat_call(pulses, 'Get number of points')
        jitter_values = []
        shimmer_values = []
        durations = []

        for start, end in voiced_segments:
            duration = end - start

            # Count pulses in segment
            pulses_count = 0
            for p in range(1, num_pulses + 1):
                pulse_time = praat_call(pulses, 'Get time from index', p)
                if start <= pulse_time <= end:
                    pulses_count += 1

            if pulses_count < min_valid_pulses:
                continue

            try:
                jitter = praat_call(
                    pulses, 'Get jitter (rap)', start, end, 0.0001, 0.02, 1.3
                )

                shimmer = praat_call(
                    [sound, pulses],
                    'Get shimmer (apq3)',
                    start,
                    end,
                    0.0001,
                    0.02,
                    1.3,
                    1.6,
                )

                if (
                    not np.isnan(jitter)
                    and 0 < jitter < MAX_JITTER
                    and not np.isnan(shimmer)
                    and 0 < shimmer < MAX_SHIMMER
                ):
                    jitter_values.append(jitter)
                    shimmer_values.append(shimmer)
                    durations.append(duration)

            except Exception:
                continue

        if not durations:
            return 0.0, 0.0

        total_dur = sum(durations)

        if total_dur == 0:
            return 0.0, 0.0

        sum_jitter = sum(j * d for j, d in zip(jitter_values, durations))
        jitter = sum_jitter / total_dur

        sum_shimmer = sum(s * d for s, d in zip(shimmer_values, durations))
        shimmer = sum_shimmer / total_dur

        return jitter, shimmer
