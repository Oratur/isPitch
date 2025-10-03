import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

import redis.asyncio as aioredis

from ....core.config import settings
from ....core.database import db
from ..adapters.notification.redis_adapter import RedisNotificationAdapter
from ..persistance.documents.analysis_document import AnalysisDocument

logger = logging.getLogger(__name__)


class ResourceManager:
    @staticmethod
    @asynccontextmanager
    async def analysis_resources() -> AsyncIterator[RedisNotificationAdapter]:
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
