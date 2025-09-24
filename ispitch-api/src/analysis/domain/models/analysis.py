from dataclasses import dataclass
from typing import Optional

from .fillerwords import FillerWordsAnalysis
from .silence import SilenceAnalysis
from .transcription import Transcription


@dataclass
class SpeechAnalysis:
    silence_analysis: SilenceAnalysis
    fillerwords_analysis: FillerWordsAnalysis


@dataclass
class AudioAnalysis:
    speech_rate: float


@dataclass
class Analysis:
    id: str
    status: str
    filename: str
    transcription: Optional[Transcription] = None
    speech_analysis: Optional[SpeechAnalysis] = None
    audio_analysis: Optional[AudioAnalysis] = None
