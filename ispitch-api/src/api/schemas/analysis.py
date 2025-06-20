from typing import Optional

from pydantic import BaseModel, Field


class AnalysisCreateResponse(BaseModel):
    """
    Schema for the response sent after a successful audio upload.
    It contains the unique ID generated for this analysis.
    """

    id: str = Field(
        ...,
        description='The unique ID of the created analysis.',
        example='example-12345',
    )

    class Config:
        json_schema_extra = {'example': {'id': 'example-12345'}}


class AnalysisResultData(BaseModel):
    """
    Schema for the nested data within the analysis result.
    """

    transcription: Optional[str] = None
    fileName: Optional[str] = None


class AnalysisResultResponse(BaseModel):
    """
    Schema for the response when querying for an analysis result.
    """

    id: str
    status: str  # Ex: 'COMPLETED', 'PENDING', 'FAILED'
    data: Optional[AnalysisResultData] = None
