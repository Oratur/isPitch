from typing import Optional

from beanie import Document
from pydantic import BaseModel

from ....domain.models.analysis import AnalysisStatus


class Word(BaseModel):
    word: str
    start: float
    end: float


class Segment(BaseModel):
    id: int
    start: float
    text: str
    words: list[Word]


class Transcription(BaseModel):
    text: str
    segments: list[Segment]


class Silence(BaseModel):
    start: float
    end: float
    duration: float


class SilenceAnalysis(BaseModel):
    duration: float
    silences: list[Silence]
    pauses: int


class FillerWordPosition(BaseModel):
    start: int
    end: int
    word: str


class FillerWordsAnalysis(BaseModel):
    total: int
    distribution: dict[str, int]
    occurrences: list[FillerWordPosition]


class VocabularySuggestionDocument(BaseModel):
    word: str
    count: int
    alternatives: list[str]


class VocabularyAnalysisDocument(BaseModel):
    suggestions: list[VocabularySuggestionDocument]


class LexicalRichnessAnalysisDocument(BaseModel):
    type_token_ratio: float
    unique_words: int
    total_words: int


class TopicDocument(BaseModel):
    topic: str
    summary: str


class TopicAnalysisDocument(BaseModel):
    topics: list[TopicDocument]


class SpeechAnalysis(BaseModel):
    silence_analysis: SilenceAnalysis
    fillerwords_analysis: FillerWordsAnalysis
    vocabulary_analysis: Optional[VocabularyAnalysisDocument] = None
    lexical_richness_analysis: Optional[LexicalRichnessAnalysisDocument] = None
    topic_analysis: Optional[TopicAnalysisDocument] = None


class AudioAnalysis(BaseModel):
    speech_rate: float


class AnalysisDocument(Document):
    status: AnalysisStatus
    filename: str
    transcription: Optional[Transcription] = None
    speech_analysis: Optional[SpeechAnalysis] = None
    audio_analysis: Optional[AudioAnalysis] = None

    class Settings:
        name = 'analysis'
