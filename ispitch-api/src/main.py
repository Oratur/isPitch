from fastapi import FastAPI

from src.analysis.application.rest.endpoints import analysis
from src.core.middlewares import configure_cors

app = FastAPI(
    title='isPitch API',
    version='1.0.0',
    description='API for verbal communication analysis from audio.',
)

configure_cors(app)


app.include_router(analysis.router)


@app.get('/', tags=['Root'])
def read_root():
    """
    Root endpoint to check if the API is online.
    """
    return {'message': 'Welcome to the isPitch API!'}
