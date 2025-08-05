from typing import List

from .....core.schemas.camel_case_model import CamelCaseModel


class FillerWordPositionSchema(CamelCaseModel):
    start: int
    end: int
    word: str


class FillerWordsAnalysisSchema(CamelCaseModel):
    total: int
    distribution: dict[str, int]
    occurrences: List[FillerWordPositionSchema]
