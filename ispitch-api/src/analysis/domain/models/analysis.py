from dataclasses import dataclass
from enum import Enum
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


class AnalysisStatus(str, Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'

    TRANSCRIBING = 'transcribing'
    ANALYZING_SPEECH = 'analyzing_speech'
    ANALYZING_AUDIO = 'analyzing_audio'

    DONE = 'done'


@dataclass
class Analysis:
    id: str
    status: AnalysisStatus
    filename: str
    transcription: Optional[Transcription] = None
    speech_analysis: Optional[SpeechAnalysis] = None
    audio_analysis: Optional[AudioAnalysis] = None
