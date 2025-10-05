import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

import redis.asyncio as aioredis

from ....core.config import settings
from ....core.database import db
from ...application.adapters.sse_adapter import RedisSSEAdapter
from ...domain.ports.output import NotificationPort
from ..adapters.notification.redis_adapter import RedisNotificationAdapter
from ..persistance.documents.analysis_document import AnalysisDocument

logger = logging.getLogger(__name__)


class ResourceManager:
    @staticmethod
    @asynccontextmanager
    async def analysis_resources() -> AsyncIterator[NotificationPort]:
        redis_client = None
        try:
            redis_client = aioredis.from_url(settings.redis_url)
            await db.connect(document_models=[AnalysisDocument])
            notification_port = RedisNotificationAdapter(redis_client)

            logger.info('Async analysis resources initialized')
            yield notification_port

        except Exception as e:
            logger.error(f'Error managing resources: {e}', exc_info=True)
            raise
        finally:
            if redis_client:
                await redis_client.close()
            await db.close()
            logger.info('Async analysis resources cleaned up')

    @staticmethod
    @asynccontextmanager
    async def sse_adapter_context() -> AsyncIterator[RedisSSEAdapter]:
        redis_client = None
        try:
            redis_client = aioredis.from_url(settings.redis_url)
            sse_adapter = RedisSSEAdapter(redis_client)
            yield sse_adapter
        except Exception as e:
            logger.error(f'Error initializing SSE adapter: {e}', exc_info=True)
        finally:
            if redis_client:
                await redis_client.close()
            logger.info('Redis SSE client cleaned up')
