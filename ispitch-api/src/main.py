from fastapi import FastAPI, HTTPException, status
from fastapi.concurrency import asynccontextmanager
from pymongo.errors import ConnectionFailure

from src.analysis.application.rest.endpoints import analysis
from src.analysis.infrastructure.persistance.documents.analysis_document import (
    AnalysisDocument,
)
from src.core.database import db
from src.core.middlewares import configure_cors


@asynccontextmanager
async def lifespan(app: FastAPI):
    models_to_init = [
        AnalysisDocument,
    ]

    await db.connect(document_models=models_to_init)
    yield
    await db.close()


app = FastAPI(
    title='isPitch API',
    version='1.0.0',
    description='API for verbal communication analysis from audio.',
    lifespan=lifespan,
)


configure_cors(app)


app.include_router(analysis.router)


@app.get('/', tags=['Root'])
def read_root():
    return {'message': 'Welcome to the isPitch API!'}


@app.get('/health', tags=['Health Check'])
async def health_check():
    try:
        client = db.get_client()
        await client.admin.command('ping')

        return {'status': 'ok', 'database': 'connected'}
    except ConnectionFailure as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f'Database connection failed: {e}',
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'An unexpected error occurred: {e}',
        )
