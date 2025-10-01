import asyncio
from typing import AsyncGenerator, Dict

from sse_starlette.sse import EventSourceResponse

from src.core.celery_config import redis_client

from ...domain.models.analysis import AnalysisStatus


class RedisSSEAdapter:
    @classmethod
    async def _event_generator(
        self, analysis_id: str
    ) -> AsyncGenerator[Dict, None]:
        channel = f'analysis:{analysis_id}'
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(channel)

        try:
            while True:
                message = await pubsub.get_message(
                    ignore_subscribe_messages=True, timeout=15.0
                )
                if message:
                    status = message['data'].decode('utf-8')
                    yield {'event': 'status_update', 'data': status}
                    if status == AnalysisStatus.DONE.value:
                        break
                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()

    def stream_events(self, analysis_id: str) -> EventSourceResponse:
        return EventSourceResponse(self._event_generator(analysis_id))
