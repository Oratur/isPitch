from dataclasses import dataclass
from typing import List, Optional


@dataclass
class PitchContour:
    time: Optional[float]
    pitch: Optional[float]


@dataclass
class PitchAnalysis:
    mean_pitch: float
    min_pitch: float
    max_pitch: float
    stdev_pitch: float
    stdev_pitch_semitones: float
    pitch_contour: Optional[List[PitchContour]] = None


@dataclass
class IntensityContour:
    time: Optional[float]
    volume: Optional[float]


@dataclass
class IntensityAnalysis:
    mean_intensity: float
    min_intensity: float
    max_intensity: float
    stdev_intensity: float
    intensity_contour: Optional[List[IntensityContour]] = None


@dataclass
class VocalQualityAnalysis:
    jitter: float
    shimmer: float
    hnr: float


@dataclass
class ProsodyAnalysis:
    pitch_analysis: PitchAnalysis
    intensity_analysis: Optional[IntensityAnalysis] = None
    vocal_quality: Optional[VocalQualityAnalysis] = None
