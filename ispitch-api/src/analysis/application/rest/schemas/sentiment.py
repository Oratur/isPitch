from typing import List

from .....core.schemas.camel_case_model import CamelCaseModel


class SentimentSegmentSchema(CamelCaseModel):
    start_time: float
    end_time: float
    sentiment: str
    score: float


class SentimentAnalysisSchema(CamelCaseModel):
    timeline: List[SentimentSegmentSchema]
