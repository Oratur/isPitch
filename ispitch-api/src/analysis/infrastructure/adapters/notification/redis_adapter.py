import logging

from src.analysis.domain.ports.output import NotificationPort
from src.core.celery_config import redis_client

logger = logging.getLogger(__name__)


class RedisNotificationAdapter(NotificationPort):
    @classmethod
    async def publish_status(self, analysis_id: str, status: str) -> None:
        channel = f'analysis:{analysis_id}'
        await redis_client.publish(channel, status)
        logger.info(f'[{analysis_id}] Published status: {status}')
