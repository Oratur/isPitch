from typing import List

from .....core.schemas.camel_case_model import CamelCaseModel


class SilenceSchema(CamelCaseModel):
    start: float
    end: float
    duration: float


class SilenceAnalysisSchema(CamelCaseModel):
    duration: float
    silences: List[SilenceSchema]
    pauses: int
