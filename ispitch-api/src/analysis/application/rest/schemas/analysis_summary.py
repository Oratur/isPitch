from datetime import datetime
from typing import Optional

from .....core.schemas import CamelCaseModel, PaginationMetadata


class AnalysisSummarySchema(CamelCaseModel):
    id: str
    user_id: Optional[str] = None
    status: str
    filename: str
    duration: float
    score: Optional[int] = 0
    created_at: datetime


class AnalysisSummaryResponseSchema(CamelCaseModel):
    analyses: list[AnalysisSummarySchema]
    metadata: PaginationMetadata
