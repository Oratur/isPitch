from datetime import datetime

from .....core.schemas import CamelCaseModel


class RecentAnalysisSchema(CamelCaseModel):
    id: str
    filename: str
    created_at: datetime
    filler_words_count: int
    speech_rate: float
    pauses_count: int
    status: str
