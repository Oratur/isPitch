# ispitch_api/main.py

from fastapi import FastAPI

from src.api.endpoints import analysis
from src.api.exception_handler import register_exception_handlers

app = FastAPI(
    title='isPitch API',
    version='1.0.0',
    description='API para análise de comunicação verbal a partir de áudio.',
)

register_exception_handlers(app)

# Inclui o roteador de análise na aplicação principal.
# Todas as rotas definidas em `analysis.py` serão adicionadas à nossa app,
app.include_router(analysis.router, prefix='/api')


@app.get('/', tags=['Root'])
def read_root():
    """
    Endpoint raiz para verificar se a API está online.
    """
    return {'message': 'Welcome to the isPitch API!'}
