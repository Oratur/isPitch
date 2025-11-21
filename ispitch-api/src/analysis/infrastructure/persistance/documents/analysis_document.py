from datetime import datetime, timezone
from typing import Optional

from beanie import Document, Update, before_event
from pydantic import BaseModel, Field
from pymongo import ASCENDING, IndexModel

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


class PitchContour(BaseModel):
    time: float
    pitch: float


class PitchAnalysis(BaseModel):
    mean_pitch: float
    min_pitch: float
    max_pitch: float
    stdev_pitch: float
    stdev_pitch_semitones: float
    pitch_contour: Optional[list[PitchContour]] = None


class IntensityContour(BaseModel):
    time: float
    volume: float


class IntensityAnalysis(BaseModel):
    mean_intensity: float
    min_intensity: float
    max_intensity: float
    stdev_intensity: float
    intensity_contour: Optional[list[IntensityContour]] = None


class VocalQualityAnalysis(BaseModel):
    jitter: float
    shimmer: float
    hnr: float


class ProsodyAnalysis(BaseModel):
    pitch_analysis: Optional[PitchAnalysis] = None
    intensity_analysis: Optional[IntensityAnalysis] = None
    vocal_quality: Optional[VocalQualityAnalysis] = None


class AudioAnalysis(BaseModel):
    duration: Optional[float] = Field(default=0.0)
    speech_rate: float
    prosody_analysis: Optional[ProsodyAnalysis] = None


class AnalysisDocument(Document):
    user_id: str = Field(default=None, index=True)
    status: AnalysisStatus
    filename: str
    score: Optional[int] = Field(default=None)
    transcription: Optional[Transcription] = None
    speech_analysis: Optional[SpeechAnalysis] = None
    audio_analysis: Optional[AudioAnalysis] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    @before_event(Update)
    async def update_timestamp(self):
        self.updated_at = datetime.now(timezone.utc)

    class Settings:
        name = 'analysis'
        indexes = [IndexModel([('user_id', ASCENDING)], name='user_id_index')]
