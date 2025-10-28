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
    get_sse_adapter,
)
from ....application.dependencies.validations import (
    validate_audio_file,
)
from ....domain.ports.input import (
    AnalysisOrchestratorPort,
)
from ...adapters.sse_adapter import RedisSSEAdapter
from ...mappers.analysis_schema_mapper import AnalysisSchemaMapper
from ..schemas.analysis import AnalysisSchema
from .....auth.application.dependencies.security import authentication

router_v1 = APIRouter(prefix='/v1/analysis', tags=['Analysis'])
router_v2 = APIRouter(prefix='/v2/analysis', tags=['Analysis'])


@router_v1.post(
    '/initiate',
    response_model=str,
    status_code=status.HTTP_201_CREATED,
    summary='Initiates a new audio analysis',
    description='Receives an audio file (.mp3 or .wav), '
    + 'starts the analysis process and returns an unique ID',
)
async def initiate_v1(
    background_tasks: BackgroundTasks,
    file: Annotated[UploadFile, Depends(validate_audio_file)] = File(...),
    analysis_orchestrator: AnalysisOrchestratorPort = Depends(
        get_analysis_orchestrator
    ),
):
    analysis_id = await analysis_orchestrator.initiate(file, background_tasks)
    return analysis_id


@router_v1.get(
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


@router_v2.post(
    '/initiate',
    response_model=str,
    status_code=status.HTTP_202_ACCEPTED,
    summary='Initiates a new audio analysis',
    description='Receives an audio file (.mp3 or .wav), '
    + 'starts the analysis process and returns an unique ID',
)
async def initiate(
    file: Annotated[UploadFile, Depends(validate_audio_file)] = File(...),
    orchestrator: AnalysisOrchestratorPort = Depends(get_analysis_orchestrator),
    user_id: str = Depends(authentication),
):
    analysis_id = await orchestrator.initiate_analysis(file, user_id)
    return analysis_id


@router_v2.get(
    '/{analysis_id}/stream',
    summary='Streams analysis status using SSE',
)
async def stream_status(
    analysis_id: str,
    sse_adapter: RedisSSEAdapter = Depends(get_sse_adapter),
    _: str = Depends(authentication),
):
    return sse_adapter.stream_events(analysis_id)

@router_v2.get(
    '/',
    response_model=list[AnalysisSchema],
    summary='Get all user analyses',
    description='Retrieves all analyses created by the authenticated user',
)
async def get_user_analyses(
    orchestrator: AnalysisOrchestratorPort = Depends(get_analysis_orchestrator),
    user_id: str = Depends(authentication),
):
    analyses = await orchestrator.get_by_user_id(user_id)
    return [AnalysisSchemaMapper.from_model(a) for a in analyses]
