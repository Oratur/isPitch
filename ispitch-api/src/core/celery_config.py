from celery import Celery

from src.core.config import settings

celery_app = Celery(
    'ispitch',
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=['src.analysis.application.tasks.analysis_tasks'],
)

celery_app.conf.update(
    task_track_started=True,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Sao_Paulo',
    enable_utc=True,
    broker_connection_retry_on_startup=True,
    worker_force_execv=True,
)
