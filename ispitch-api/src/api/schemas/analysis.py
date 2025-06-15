from pydantic import BaseModel, Field

# Documentação do Código
# Este módulo define os "Data Transfer Objects" (DTOs) ou
# Schemas para a funcionalidade de análise.
# Usamos Pydantic para garantir que os dados que entram e saem da nossa API
# tenham o formato esperado, melhorando a segurança e a previsibilidade.


class AnalysisCreateResponse(BaseModel):
    """
    Schema para a resposta enviada após o upload bem-sucedido de um áudio.
    Contém o ID único gerado para essa análise.
    """

    id: str = Field(
        ...,
        description='O ID único da análise criada.',
        example='exemplo-12345',
    )

    class Config:
        # Configuração para gerar um exemplo no OpenAPI/Swagger
        json_schema_extra = {'example': {'id': 'exemplo-12345'}}
