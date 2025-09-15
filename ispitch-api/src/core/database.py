from typing import Optional

from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from .config import settings


class Database:
    client: Optional[AsyncIOMotorClient] = None

    async def connect(self, document_models: list[type[Document]]):
        self.client = AsyncIOMotorClient(settings.database_url)

        await init_beanie(
            database=self.client.ispitch,
            document_models=document_models,
        )

    async def close(self):
        if self.client:
            self.client.close()

    def get_client(self) -> AsyncIOMotorClient:
        if self.client is None:
            raise RuntimeError('Database client has not been initialized.')
        return self.client


db = Database()
