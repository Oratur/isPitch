from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    UploadFile,
    status,
)

from ....application.dependencies.services import (
    get_analysis_orchestrator,
)
from ....application.dependencies.validations import (
    validate_audio_file,
)
from ....domain.ports.input import (
    AnalysisOrchestratorPort,
)
from ...mappers.analysis_schema_mapper import AnalysisSchemaMapper
from ..schemas.analysis import AnalysisSchema

router = APIRouter(prefix='/analysis', tags=['Analysis'])


@router.post(
    '/initiate',
    response_model=str,
    status_code=status.HTTP_201_CREATED,
    summary='Initiates a new audio analysis',
    description='Receives an audio file (.mp3 or .wav), '
    + 'starts the analysis process and returns an unique ID',
)
async def initiate(
    background_tasks: BackgroundTasks,
    file: Annotated[UploadFile, Depends(validate_audio_file)] = File(...),
    analysis_orchestrator: AnalysisOrchestratorPort = Depends(
        get_analysis_orchestrator
    ),
):
    analysis_id = await analysis_orchestrator.initiate(file, background_tasks)
    return analysis_id


@router.get(
    '/{analysis_id}',
    response_model=AnalysisSchema,
    summary='Get analysis status and result',
    description='Retrieves the status and result of an audio '
    + 'analysis by its ID.',
)
async def get_by_id(
    analysis_id: str,
    analysis_orchestrator: AnalysisOrchestratorPort = Depends(
        get_analysis_orchestrator
    ),
):
    """
    Retrieves the status and results of a specific audio analysis.

    - **analysis_id**: The ID of the analysis returned by the POST endpoint.
    """
    analysis = await analysis_orchestrator.get_by_id(analysis_id)
    return AnalysisSchemaMapper.from_model(analysis)
