from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    UploadFile,
    status,
)

from src.api.schemas.analysis import (
    AnalysisCreateResponse,
    AnalysisResultResponse,
)
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
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    analysis_service: AnalysisService = Depends(AnalysisService),
):
    analysis_id = analysis_service.start_analysis_process(
        file, background_tasks
    )
    return AnalysisCreateResponse(id=analysis_id)


@router.get(
    '/{analysis_id}',
    response_model=AnalysisResultResponse,
    summary='Get analysis status and result',
    description='Retrieves the status and result of an audio analysis by its ID.',
    tags=['Analysis'],
)
def get_analysis(
    analysis_id: str,
    analysis_service: AnalysisService = Depends(AnalysisService),
):
    """
    Retrieves the status and results of a specific audio analysis.

    - **analysis_id**: The ID of the analysis returned by the POST endpoint.
    """
    return analysis_service.get_analysis(analysis_id)
