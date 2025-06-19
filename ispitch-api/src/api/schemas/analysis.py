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
