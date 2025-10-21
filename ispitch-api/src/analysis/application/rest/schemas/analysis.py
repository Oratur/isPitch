from typing import Optional

from .....core.schemas.camel_case_model import CamelCaseModel
from ..schemas.fillerwords import FillerWordsAnalysisSchema
from ..schemas.lexical_richness import LexicalRichnessAnalysisSchema
from ..schemas.silence import SilenceAnalysisSchema
from ..schemas.vocabulary import VocabularyAnalysisSchema


class SpeechAnalysisSchema(CamelCaseModel):
    silence_analysis: Optional[SilenceAnalysisSchema] = None
    fillerwords_analysis: Optional[FillerWordsAnalysisSchema] = None
    vocabulary_analysis: Optional[VocabularyAnalysisSchema] = None
    lexical_richness_analysis: Optional[LexicalRichnessAnalysisSchema] = None


class AudioAnalysisSchema(CamelCaseModel):
    speech_rate: float


class AnalysisSchema(CamelCaseModel):
    id: str
    status: str
    filename: str
    transcription: Optional[str] = None
    speech_analysis: Optional[SpeechAnalysisSchema] = None
    audio_analysis: Optional[AudioAnalysisSchema] = None
