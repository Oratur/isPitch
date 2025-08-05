from dataclasses import dataclass
from typing import List


@dataclass
class Word:
    word: str
    start: float
    end: float


@dataclass
class Segment:
    id: int
    start: float
    text: str
    words: List[Word]


@dataclass
class Transcription:
    text: str
    segments: List[Segment]
