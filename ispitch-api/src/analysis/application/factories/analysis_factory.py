from ...domain.ports.output import NotificationPort
from ...domain.services.async_analysis_orchestrator_service import (
    AnalysisConfig,
    AnalysisPort,
    AsyncAnalysisOrchestratorService,
)
from ..dependencies import services as deps
from ..services.analysis_workflow_service import (
    AsyncAnalysisWorkflowService,
)


class AsyncAnalysisFactory:
    @staticmethod
    def create_workflow_service(
        analysis_id: str,
        audio_path: str,
        filename: str,
        notification_port: NotificationPort,
    ) -> AsyncAnalysisWorkflowService:
        transcription_port = deps.get_transcription_port()
        speech_analysis_port = deps.get_speech_analysis_port()
        audio_analysis_port = deps.get_audio_analysis_port()
        vocabulary_analysis_port = deps.get_vocabulary_analysis_port()
        analysis_repository = deps.get_analysis_repository()
        storage_port = deps.get_storage_port()

        orchestrator = AsyncAnalysisOrchestratorService(
            config=AnalysisConfig(
                analysis_id=analysis_id, audio_path=audio_path, filename=filename
            ),
            ports=AnalysisPort(
                transcription_port=transcription_port,
                speech_analysis_port=speech_analysis_port,
                audio_analysis_port=audio_analysis_port,
                vocabulary_analysis_port=vocabulary_analysis_port,
                notification_port=notification_port,
            ),
        )

        return AsyncAnalysisWorkflowService(
            orchestrator=orchestrator,
            analysis_repository=analysis_repository,
            notification_port=notification_port,
            storage_port=storage_port,
        )
