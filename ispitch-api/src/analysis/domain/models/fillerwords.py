from dataclasses import dataclass
from typing import List


@dataclass
class FillerWordPosition:
    start: int
    end: int
    word: str


@dataclass
class FillerWordsAnalysis:
    total: int
    distribution: dict[str, int]
    occurrences: List[FillerWordPosition]
