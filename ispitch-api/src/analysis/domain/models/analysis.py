from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional

from .fillerwords import FillerWordsAnalysis
from .lexical_richness import LexicalRichnessAnalysis
from .silence import SilenceAnalysis
from .topic import TopicAnalysis
from .transcription import Transcription
from .vocabulary import VocabularyAnalysis
from .prosody import ProsodyAnalysis


@dataclass
class SpeechAnalysis:
    silence_analysis: SilenceAnalysis
    fillerwords_analysis: FillerWordsAnalysis
    vocabulary_analysis: Optional[VocabularyAnalysis] = None
    lexical_richness_analysis: Optional[LexicalRichnessAnalysis] = None
    topic_analysis: Optional[TopicAnalysis] = None


@dataclass
class AudioAnalysis:
    duration: float
    speech_rate: float
    prosody_analysis: Optional[ProsodyAnalysis] = None


class AnalysisStatus(str, Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'

    TRANSCRIBING = 'transcribing'
    ANALYZING_SPEECH = 'analyzing_speech'
    ANALYZING_AUDIO = 'analyzing_audio'


@dataclass
class Analysis:
    id: str
    status: AnalysisStatus
    filename: str
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None
    transcription: Optional[Transcription] = None
    speech_analysis: Optional[SpeechAnalysis] = None
    audio_analysis: Optional[AudioAnalysis] = None
