from typing import List, Optional

from .....core.schemas.camel_case_model import CamelCaseModel


class PitchContourSchema(CamelCaseModel):
    time: Optional[float]
    pitch: Optional[float]


class PitchAnalysisSchema(CamelCaseModel):
    mean_pitch: float
    min_pitch: float
    max_pitch: float
    stdev_pitch: float
    stdev_pitch_semitones: float
    pitch_contour: Optional[List[PitchContourSchema]]


class IntensityContourSchema(CamelCaseModel):
    time: Optional[float]
    volume: Optional[float]


class IntensityAnalysisSchema(CamelCaseModel):
    mean_intensity: float
    min_intensity: float
    max_intensity: float
    stdev_intensity: float
    intensity_contour: Optional[List[IntensityContourSchema]]


class VocalQualitySchema(CamelCaseModel):
    jitter: float
    shimmer: float
    hnr: float


class ProsodyAnalysisSchema(CamelCaseModel):
    pitch_analysis: Optional[PitchAnalysisSchema]
    intensity_analysis: Optional[IntensityAnalysisSchema] = None
    vocal_quality: Optional[VocalQualitySchema] = None
