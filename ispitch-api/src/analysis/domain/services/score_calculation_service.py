from ..models.analysis import Analysis
from ..ports.input import ScoreCalculationPort


class ScoreCalculationService(ScoreCalculationPort):
    # Score base
    BASE_SCORE = 100
    MIN_SCORE = 0
    MAX_SCORE = 100

    # --- Penalidades para Fala ---
    FILLER_WORD_PENALTY = 3
    LONG_PAUSE_PENALTY = 5

    # --- Thresholds para Speech Rate (PPM) ---
    MIN_IDEAL_RATE = 100
    MAX_IDEAL_RATE = 160
    IDEAL_CENTER_RATE = 150
    RATE_PENALTY_FACTOR = 0.5

    # --- Bônus para Riqueza Lexical ---
    LEXICAL_RICHNESS_THRESHOLD = 50.0
    LEXICAL_BONUS = 5

    # --- Thresholds e Pesos para Prosódia ---

    # Pitch (Hz) - Variação ideal
    MIN_IDEAL_PITCH_STDEV = 15.0  # Semitones
    MAX_IDEAL_PITCH_STDEV = 40.0  # Semitones
    PITCH_MONOTONE_PENALTY = 10  # Penalidade por fala monótona
    PITCH_EXCESSIVE_PENALTY = 5  # Penalidade por variação excessiva

    # Intensity (dB) - Variação ideal
    MIN_IDEAL_INTENSITY_STDEV = 3.0
    MAX_IDEAL_INTENSITY_STDEV = 10.0
    INTENSITY_MONOTONE_PENALTY = 8
    INTENSITY_EXCESSIVE_PENALTY = 4

    # Vocal Quality
    MAX_IDEAL_JITTER = 1.0  # % - Jitter aceitável
    MAX_IDEAL_SHIMMER = 3.0  # % - Shimmer aceitável
    MIN_IDEAL_HNR = 15.0  # dB - HNR mínimo desejável
    VOCAL_QUALITY_PENALTY_FACTOR = 3.0

    PROSODY_BONUS = 10

    def execute(self, analysis: Analysis) -> int:
        if not analysis.speech_analysis or not analysis.audio_analysis:
            return 0

        score = float(self.BASE_SCORE)

        score -= self._calculate_filler_penalty(analysis)
        score -= self._calculate_pause_penalty(analysis)
        score -= self._calculate_speech_rate_penalty(analysis)

        score += self._calculate_lexical_bonus(analysis)

        if analysis.audio_analysis.prosody_analysis:
            prosody_score = self._calculate_prosody_score(analysis)
            score += prosody_score

        final_score = round(score)
        return max(self.MIN_SCORE, min(self.MAX_SCORE, final_score))

    def _calculate_filler_penalty(self, analysis: Analysis) -> float:
        total_fillers = analysis.speech_analysis.fillerwords_analysis.total
        return total_fillers * self.FILLER_WORD_PENALTY

    def _calculate_pause_penalty(self, analysis: Analysis) -> float:
        total_pauses = analysis.speech_analysis.silence_analysis.pauses
        return total_pauses * self.LONG_PAUSE_PENALTY

    def _calculate_speech_rate_penalty(self, analysis: Analysis) -> float:
        speech_rate = analysis.audio_analysis.speech_rate

        if self.MIN_IDEAL_RATE <= speech_rate <= self.MAX_IDEAL_RATE:
            return 0.0

        distance = abs(self.IDEAL_CENTER_RATE - speech_rate)
        return distance * self.RATE_PENALTY_FACTOR

    def _calculate_lexical_bonus(self, analysis: Analysis) -> float:
        lexical = analysis.speech_analysis.lexical_richness_analysis

        if (
            lexical
            and lexical.type_token_ratio > self.LEXICAL_RICHNESS_THRESHOLD
        ):
            return self.LEXICAL_BONUS

        return 0.0

    def _calculate_prosody_score(self, analysis: Analysis) -> float:
        prosody = analysis.audio_analysis.prosody_analysis
        prosody_adjustments = 0.0
        good_aspects = 0
        total_aspects = 0

        if prosody.pitch_analysis:
            pitch_adjustment, pitch_is_good = self._evaluate_pitch(
                prosody.pitch_analysis
            )
            prosody_adjustments += pitch_adjustment
            if pitch_is_good:
                good_aspects += 1
            total_aspects += 1

        if prosody.intensity_analysis:
            intensity_adjustment, intensity_is_good = self._evaluate_intensity(
                prosody.intensity_analysis
            )
            prosody_adjustments += intensity_adjustment
            if intensity_is_good:
                good_aspects += 1
            total_aspects += 1

        if prosody.vocal_quality:
            vocal_adjustment, vocal_is_good = self._evaluate_vocal_quality(
                prosody.vocal_quality
            )
            prosody_adjustments += vocal_adjustment
            if vocal_is_good:
                good_aspects += 1
            total_aspects += 1

        if total_aspects > 0 and good_aspects >= (total_aspects / 2):
            prosody_adjustments += self.PROSODY_BONUS

        return prosody_adjustments

    def _evaluate_pitch(self, pitch_analysis) -> tuple[float, bool]:
        stdev_semitones = pitch_analysis.stdev_pitch_semitones

        if stdev_semitones < self.MIN_IDEAL_PITCH_STDEV:
            return -self.PITCH_MONOTONE_PENALTY, False

        if stdev_semitones > self.MAX_IDEAL_PITCH_STDEV:
            penalty = min(
                self.PITCH_EXCESSIVE_PENALTY,
                (stdev_semitones - self.MAX_IDEAL_PITCH_STDEV) * 0.2,
            )
            return -penalty, False

        return 0.0, True

    def _evaluate_intensity(self, intensity_analysis) -> tuple[float, bool]:
        stdev = intensity_analysis.stdev_intensity

        if stdev < self.MIN_IDEAL_INTENSITY_STDEV:
            return -self.INTENSITY_MONOTONE_PENALTY, False

        if stdev > self.MAX_IDEAL_INTENSITY_STDEV:
            penalty = min(
                self.INTENSITY_EXCESSIVE_PENALTY,
                (stdev - self.MAX_IDEAL_INTENSITY_STDEV) * 0.3,
            )
            return -penalty, False

        return 0.0, True

    def _evaluate_vocal_quality(self, vocal_quality) -> tuple[float, bool]:
        penalty = 0.0
        issues = 0

        if vocal_quality.jitter > self.MAX_IDEAL_JITTER:
            excess = vocal_quality.jitter - self.MAX_IDEAL_JITTER
            penalty += excess * self.VOCAL_QUALITY_PENALTY_FACTOR
            issues += 1

        if vocal_quality.shimmer > self.MAX_IDEAL_SHIMMER:
            excess = vocal_quality.shimmer - self.MAX_IDEAL_SHIMMER
            penalty += excess * self.VOCAL_QUALITY_PENALTY_FACTOR
            issues += 1

        if vocal_quality.hnr < self.MIN_IDEAL_HNR:
            deficit = self.MIN_IDEAL_HNR - vocal_quality.hnr
            penalty += deficit * 0.5
            issues += 1

        is_good = issues == 0
        return -penalty, is_good
