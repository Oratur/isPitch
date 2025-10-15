import logging

from transformers import pipeline

from ....domain.models.sentiment import SentimentAnalysis, SentimentSegment
from ....domain.ports.output import SentimentAnalysisPort

logger = logging.getLogger(__name__)


class SentimentAnalysisAdapter(SentimentAnalysisPort):
    def __init__(self):
        try:
            # Carrega um modelo de pipeline focado em sentimento para português.
            # Este modelo é baseado em BERT e entende contexto.
            # O modelo será baixado na primeira vez que for executado.
            logger.info(
                "Carregando modelo de análise de sentimento (Hugging Face)..."
            )
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="pysentimiento/bertweet-pt-sentiment"
            )
            logger.info(
                "Modelo de análise de sentimento carregado com sucesso."
            )
        except Exception as e:
            logger.error(
                f"Falha ao carregar o modelo de sentimento: {e}", exc_info=True
            )
            self.sentiment_pipeline = None

    def analyze(self, text: str) -> SentimentAnalysis:
        """
        Analisa o sentimento de um texto usando um modelo de Transformers.

        Args:
            text: O texto a ser analisado.

        Returns:
            Um objeto SentimentAnalysis contendo a timeline do sentimento.
        """
        if self.sentiment_pipeline is None:
            logger.warning(
                "Pipeline de sentimento não está disponível. Pulando análise."
            )
            return SentimentAnalysis(timeline=[])

        try:
            # O pipeline retorna uma lista de resultados. Pega o primeiro.
            # Ex: [{'label': 'POS', 'score': 0.98}]
            result = self.sentiment_pipeline(text)[0]

            label = result['label']
            score = result['score']

            # Converte a label do modelo para o nosso formato de domínio
            if label == 'POS':
                sentiment = "positivo"
            elif label == 'NEG':
                sentiment = "negativo"
            else:  # (NEU)
                sentiment = "neutro"

            segment = SentimentSegment(
                start_time=0,
                end_time=0,
                sentiment=sentiment,
                score=round(score, 4)
            )

            return SentimentAnalysis(timeline=[segment])

        except Exception as e:
            logger.error(
                f"Erro durante a análise de sentimento: {e}", exc_info=True
            )
            return SentimentAnalysis(timeline=[])
