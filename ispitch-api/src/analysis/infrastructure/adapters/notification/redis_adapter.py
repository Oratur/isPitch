import json
import logging

import redis.asyncio as aioredis

from src.analysis.domain.ports.output import NotificationPort

from ....domain.models.events import SseEvent

logger = logging.getLogger(__name__)


class RedisNotificationAdapter(NotificationPort):
    def __init__(self, redis_client: aioredis.Redis):
        self.redis_client = redis_client

    async def publish(
        self, analysis_id: str, event: SseEvent, data: str
    ) -> None:
        channel = f'analysis:{analysis_id}'
        message = json.dumps({'event': event.value, 'data': data})
        await self.redis_client.publish(channel, message)

        if event == SseEvent.STATUS_UPDATE:
            logger.info(f'[{analysis_id}] Published status: {data}')
        else:
            logger.info(f'[{analysis_id}] Published event: {event.value}')
