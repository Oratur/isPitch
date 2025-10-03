import asyncio
import json
from typing import AsyncGenerator, Dict

import redis.asyncio as aioredis
from sse_starlette.sse import EventSourceResponse

from ...domain.models.analysis import AnalysisStatus


class RedisSSEAdapter:
    def __init__(self, redis_client: aioredis.Redis):
        self.redis_client = redis_client

    def stream_events(self, analysis_id: str) -> EventSourceResponse:
        async def event_generator() -> AsyncGenerator[Dict, None]:
            channel = f'analysis:{analysis_id}'
            pubsub = self.redis_client.pubsub()
            await pubsub.subscribe(channel)

            try:
                while True:
                    message = await pubsub.get_message(
                        ignore_subscribe_messages=True,
                        timeout=30.0,
                    )
                    if message:
                        payload = json.loads(message['data'])
                        event_name = payload['event']
                        event_data = payload['data']

                        yield {'event': event_name, 'data': event_data}

                        if event_data == AnalysisStatus.DONE:
                            break
                    await asyncio.sleep(0.1)
            finally:
                await pubsub.unsubscribe(channel)
                await pubsub.close()

        return EventSourceResponse(event_generator())
