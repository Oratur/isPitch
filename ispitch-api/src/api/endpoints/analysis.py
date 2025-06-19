from fastapi import APIRouter, Depends, File, UploadFile, status

from src.api.schemas.analysis import AnalysisCreateResponse
from src.services.analysis_service import AnalysisService

router = APIRouter(prefix='/analysis', tags=['Analysis'])


@router.post(
    '/',
    response_model=AnalysisCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary='Create a new audio analysis',
    description='Receives an audio file (.mp3 or .wav), '
    + 'starts the analysis process and returns a unique ID.',
)
def create_audio_analysis(
    file: UploadFile = File(...),
    analysis_service: AnalysisService = Depends(AnalysisService),
):
    """
    Endpoint to create a new audio analysis.
    Delegates the logic to the AnalysisService and relies on global
    exception handlers to handle errors.
    """

    analysis_id = analysis_service.create_analysis(file)
    return AnalysisCreateResponse(id=analysis_id)
