from typing import Optional

from pydantic import Field

from src.api.schemas.camel_case_model import CamelCaseModel


class Silence(CamelCaseModel):
    start: float
    end: float
    duration: float


class SilenceAnalysis(CamelCaseModel):
    total_duration: float
    silences: list[Silence]
    number_of_pauses: int


class FillerWordAnalysis(CamelCaseModel):
    total_filler_words: int
    filler_words_count: dict[str, int]


class AnalysisCreateResponse(CamelCaseModel):
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


class AnalysisResultData(CamelCaseModel):
    """
    Schema for the nested data within the analysis result.
    """

    transcription: Optional[str] = None
    file_name: Optional[str] = None
    silences: Optional[SilenceAnalysis] = None
    filler_words: Optional[FillerWordAnalysis] = None


class AnalysisResultResponse(CamelCaseModel):
    """
    Schema for the response when querying for an analysis result.
    """

    id: str
    status: str  # Ex: 'COMPLETED', 'PENDING', 'FAILED'
    data: Optional[AnalysisResultData] = None
