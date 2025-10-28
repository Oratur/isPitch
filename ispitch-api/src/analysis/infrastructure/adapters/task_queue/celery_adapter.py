from src.analysis.domain.ports.output import TaskQueuePort
from src.core.celery_config import celery_app


class CeleryTaskQueueAdapter(TaskQueuePort):
    @classmethod
    def enqueue_analysis(
        self, analysis_id: str, user_id: str, audio_path: str, filename: str
    ) -> None:
        celery_app.send_task(
            'run_analysis', args=[analysis_id, user_id, audio_path, filename]
        )
