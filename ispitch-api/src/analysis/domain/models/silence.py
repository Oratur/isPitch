from dataclasses import dataclass
from typing import List


@dataclass
class Silence:
    start: float
    end: float
    duration: float


@dataclass
class SilenceAnalysis:
    duration: float
    silences: List[Silence]
    pauses: int
