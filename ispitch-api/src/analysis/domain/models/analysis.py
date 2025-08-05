from dataclasses import dataclass

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
    transcription: Transcription
    speech_analysis: SpeechAnalysis
    audio_analysis: AudioAnalysis
