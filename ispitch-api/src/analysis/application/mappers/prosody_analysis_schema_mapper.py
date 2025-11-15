from dataclasses import asdict

from ...domain.models.prosody import ProsodyAnalysis
from ..rest.schemas.prosody import (
    ProsodyAnalysisSchema,
    PitchAnalysisSchema,
    PitchContourSchema,
    IntensityAnalysisSchema,
    IntensityContourSchema,
    VocalQualitySchema,
)

class ProsodyAnalysisSchemaMapper:
    @staticmethod
    def from_model(prosody_analysis: ProsodyAnalysis) -> ProsodyAnalysisSchema:
        if not prosody_analysis:
            return None

        return ProsodyAnalysisSchema(
            pitch_analysis=ProsodyAnalysisSchemaMapper._map_pitch_analysis(
                prosody_analysis.pitch_analysis
            ) if prosody_analysis.pitch_analysis else None,
            intensity_analysis=ProsodyAnalysisSchemaMapper._map_intensity_analysis(
                prosody_analysis.intensity_analysis
            ) if prosody_analysis.intensity_analysis else None,
            vocal_quality=ProsodyAnalysisSchemaMapper._map_vocal_quality(
                prosody_analysis.vocal_quality
            ) if prosody_analysis.vocal_quality else None,
        )

    @staticmethod
    def _map_pitch_analysis(pitch_analysis) -> PitchAnalysisSchema:
        if not pitch_analysis:
            return None
        
        pitch_contour = None
        if pitch_analysis.pitch_contour:
            pitch_contour = [
                PitchContourSchema(
                    time=contour.time,
                    pitch=contour.pitch
                )
                for contour in pitch_analysis.pitch_contour
            ]

        return PitchAnalysisSchema(
            mean_pitch=pitch_analysis.mean_pitch,
            min_pitch=pitch_analysis.min_pitch,
            max_pitch=pitch_analysis.max_pitch,
            stdev_pitch=pitch_analysis.stdev_pitch,
            stdev_pitch_semitones=pitch_analysis.stdev_pitch_semitones,
            pitch_contour=pitch_contour,
        )

    @staticmethod
    def _map_intensity_analysis(intensity_analysis) -> IntensityAnalysisSchema:
        if not intensity_analysis:
            return None
        
        intensity_contour = None
        if intensity_analysis.intensity_contour:
            intensity_contour = [
                IntensityContourSchema(
                    time=contour.time,
                    volume=contour.volume
                )
                for contour in intensity_analysis.intensity_contour
            ]

        return IntensityAnalysisSchema(
            mean_intensity=intensity_analysis.mean_intensity,
            min_intensity=intensity_analysis.min_intensity,
            max_intensity=intensity_analysis.max_intensity,
            stdev_intensity=intensity_analysis.stdev_intensity,
            intensity_contour=intensity_contour,
        )

    @staticmethod
    def _map_vocal_quality(vocal_quality) -> VocalQualitySchema:
        if not vocal_quality:
            return None

        return VocalQualitySchema(
            jitter=vocal_quality.jitter,
            shimmer=vocal_quality.shimmer,
            hnr=vocal_quality.hnr,
        )