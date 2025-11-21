from datetime import datetime, timezone
import logging

from ...domain.models.analysis import Analysis, AnalysisStatus
from ...domain.models.events import SseEvent
from ...domain.ports.input import AsyncAnalysisOrchestratorPort
from ...domain.ports.output import (
    AnalysisRepositoryPort,
    NotificationPort,
    StoragePort,
)
from ..mappers.analysis_schema_mapper import AnalysisSchemaMapper

logger = logging.getLogger(__name__)


class AsyncAnalysisWorkflowService:
    def __init__(
        self,
        orchestrator: AsyncAnalysisOrchestratorPort,
        analysis_repository: AnalysisRepositoryPort,
        notification_port: NotificationPort,
        storage_port: StoragePort,
    ):
        self._orchestrator = orchestrator
        self._analysis_repository = analysis_repository
        self._notification_port = notification_port
        self._storage_port = storage_port

    async def execute(self) -> None:
        try:
            result = await self._orchestrator.execute()
            await self._handle_success(result)
        except Exception as e:
            logger.error(
                f'[{self._orchestrator.analysis_id}] Analysis failed: {e}',
                exc_info=True,
            )
            await self._handle_failure(e)
        finally:
            await self._cleanup()

    async def _handle_success(self, result: Analysis) -> None:
        await self._analysis_repository.save(result)

        analysis_schema = AnalysisSchemaMapper.from_model(result)
        result_json = analysis_schema.model_dump_json(by_alias=True)

        await self._notification_port.publish(
            analysis_id=self._orchestrator.analysis_id,
            event=SseEvent.ANALYSIS_RESULT,
            data=result_json,
        )
        await self._notification_port.publish(
            analysis_id=self._orchestrator.analysis_id,
            event=SseEvent.STATUS_UPDATE,
            data=AnalysisStatus.COMPLETED.value,
        )

    async def _handle_failure(self, error: Exception) -> None:
        failed_analysis = Analysis(
            id=self._orchestrator.analysis_id,
            user_id=self._orchestrator.user_id,
            status=AnalysisStatus.FAILED,
            updated_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
            filename=self._orchestrator.filename,
        )
        await self._analysis_repository.save(failed_analysis)
        await self._notification_port.publish(
            analysis_id=self._orchestrator.analysis_id,
            event=SseEvent.STATUS_UPDATE,
            data=AnalysisStatus.FAILED.value,
        )

    async def _cleanup(self) -> None:
        self._storage_port.cleanup_temporary_file(self._orchestrator.audio_path)
        logger.info(
            f'[{self._orchestrator.analysis_id}] Temporary audio file cleaned up'
        )
