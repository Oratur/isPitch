import asyncio
import logging

from ....core.celery_config import celery_app
from ...infrastructure.context.resource_manager import ResourceManager
from ..factories.analysis_factory import AsyncAnalysisFactory

logger = logging.getLogger(__name__)


async def run_async_analysis(
    analysis_id: str, user_id: str, audio_path: str, filename: str
) -> None:
    async with ResourceManager.analysis_resources() as notification_port:
        workflow_service = AsyncAnalysisFactory.create_workflow_service(
            analysis_id=analysis_id,
            user_id=user_id,
            audio_path=audio_path,
            filename=filename,
            notification_port=notification_port,
        )
        await workflow_service.execute()


@celery_app.task(name='run_analysis')
def run_analysis(analysis_id: str, user_id: str, audio_path: str, filename: str):
    logger.info(f'[{analysis_id}] Starting async analysis task')
    asyncio.run(run_async_analysis(analysis_id, user_id, audio_path, filename))
    logger.info(f'[{analysis_id}] Async analysis task completed')
