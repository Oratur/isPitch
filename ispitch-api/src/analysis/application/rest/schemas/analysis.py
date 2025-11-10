from datetime import datetime
from typing import Optional

from .....core.schemas import CamelCaseModel
from ..schemas.fillerwords import FillerWordsAnalysisSchema
from ..schemas.lexical_richness import LexicalRichnessAnalysisSchema
from ..schemas.silence import SilenceAnalysisSchema
from ..schemas.topic import TopicAnalysisSchema
from ..schemas.vocabulary import VocabularyAnalysisSchema


class SpeechAnalysisSchema(CamelCaseModel):
    silence_analysis: Optional[SilenceAnalysisSchema] = None
    fillerwords_analysis: Optional[FillerWordsAnalysisSchema] = None
    vocabulary_analysis: Optional[VocabularyAnalysisSchema] = None
    lexical_richness_analysis: Optional[LexicalRichnessAnalysisSchema] = None
    topic_analysis: Optional[TopicAnalysisSchema] = None


class AudioAnalysisSchema(CamelCaseModel):
    speech_rate: float


class AnalysisSchema(CamelCaseModel):
    id: str
    user_id: Optional[str] = None
    status: str
    filename: str
    created_at: datetime
    updated_at: datetime
    transcription: Optional[str] = None
    speech_analysis: Optional[SpeechAnalysisSchema] = None
    audio_analysis: Optional[AudioAnalysisSchema] = None
