from fastapi import APIRouter, File, UploadFile, status

from src.api.schemas.analysis import AnalysisCreateResponse
from src.services.analysis_service import AnalysisService

router = APIRouter(prefix='/analysis', tags=['Analysis'])
analysis_service = AnalysisService()


@router.post(
    '/',
    response_model=AnalysisCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary='Cria uma nova análise de áudio',
    description='Recebe um arquivo de áudio (.mp3 ou .wav), '
    + 'inicia o processo de análise e retorna um ID único.',
)
def create_audio_analysis(file: UploadFile = File(...)):
    """
    Endpoint para criar uma nova análise de áudio.
    Delega a lógica para o AnalysisService e confia nos manipuladores
    globais de exceção para tratar os erros.
    """

    analysis_id = analysis_service.create_new_analysis(file=file)
    return AnalysisCreateResponse(id=analysis_id)
