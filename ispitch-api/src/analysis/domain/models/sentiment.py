from dataclasses import dataclass
from typing import List


@dataclass
class SentimentSegment:
    start_time: float
    end_time: float
    sentiment: str  # positivo, negativo, neutro
    score: float


@dataclass
class SentimentAnalysis:
    timeline: List[SentimentSegment]
