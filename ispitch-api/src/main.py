from fastapi import FastAPI

from src.api.endpoints import analysis
from src.api.exception_handler import register_exception_handlers

app = FastAPI(
    title='isPitch API',
    version='1.0.0',
    description='API for verbal communication analysis from audio.',
)

register_exception_handlers(app)

app.include_router(analysis.router, prefix='/api')


@app.get('/', tags=['Root'])
def read_root():
    """
    Root endpoint to check if the API is online.
    """
    return {'message': 'Welcome to the isPitch API!'}
