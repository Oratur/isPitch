from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Query,
    UploadFile,
    status,
)

from .....auth.application.dependencies.security import authentication
from .....core.schemas import PaginationMetadata
from ....application.dependencies.services import (
    get_analysis_orchestrator,
    get_analysis_stats_service,
    get_sse_adapter,
)
from ....application.dependencies.validations import (
    validate_audio_file,
)
from ....domain.ports.input import (
    AnalysisOrchestratorPort,
    AnalysisStatsPort,
)
from ...adapters.sse_adapter import RedisSSEAdapter
from ...mappers.analysis_schema_mapper import AnalysisSchemaMapper
from ...mappers.analysis_stats_mapper import AnalysisStatsMapper
from ...mappers.recent_analysis_mapper import RecentAnalysisMapper
from ..schemas import (
    AnalysisSchema,
    AnalysisStatsSchema,
    AnalysisSummaryResponseSchema,
    RecentAnalysisSchema,
)

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
    response_model=AnalysisSummaryResponseSchema,
    summary='Get all user analyses',
    description='Retrieves all analyses created by the authenticated user',
)
async def get_user_analyses(
    orchestrator: AnalysisOrchestratorPort = Depends(get_analysis_orchestrator),
    user_id: str = Depends(authentication),
    page: int = Query(1, ge=1, description='Page number to retrieve'),
    page_size: int = Query(
        10,
        alias='pageSize',
        ge=1,
        le=50,
        description='Number of results per page',
    ),
):
    analyses, total = await orchestrator.get_by_user_id(user_id, page, page_size)

    items = [AnalysisSchemaMapper.to_summary(a) for a in analyses]
    metadata = PaginationMetadata(
        total=total,
        page=page,
        page_size=page_size,
        has_more=(page * page_size) < total,
    )
    return AnalysisSummaryResponseSchema(analyses=items, metadata=metadata)


@router_v2.get(
    '/stats',
    response_model=AnalysisStatsSchema,
    summary='Get user analysis statistics',
    description='Retrieves aggregated statistics for the authenticated user, '
    'including total analyses, filler words, duration, and chart data.',
)
async def get_analysis_stats(
    stats_service: AnalysisStatsPort = Depends(get_analysis_stats_service),
    user_id: str = Depends(authentication),
) -> AnalysisStatsSchema:
    stats = await stats_service.get_stats(user_id)
    return AnalysisStatsMapper.from_model(stats)


@router_v2.get(
    '/recent',
    response_model=RecentAnalysisSchema,
    summary='Get recent user analysis for dashboard',
    description='Retrieves the most recent analysis.',
)
async def get_recent_analysis(
    user_id: str = Depends(authentication),
    orchestrator: AnalysisOrchestratorPort = Depends(get_analysis_orchestrator),
):
    analysis = await orchestrator.find_recent_by_user_id(user_id)
    return RecentAnalysisMapper.from_model(analysis)
