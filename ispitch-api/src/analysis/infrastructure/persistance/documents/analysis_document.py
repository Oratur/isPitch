from beanie import Document
from pydantic import BaseModel


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


class SpeechAnalysis(BaseModel):
    silence_analysis: SilenceAnalysis
    fillerwords_analysis: FillerWordsAnalysis


class AudioAnalysis(BaseModel):
    speech_rate: float


class AnalysisDocument(Document):
    status: str
    filename: str
    transcription: Transcription
    speech_analysis: SpeechAnalysis
    audio_analysis: AudioAnalysis
