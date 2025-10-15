# ispitch-api/src/analysis/infrastructure/adapters/speech/sentiment_analysis_adapter.py

from LeIA import SentimentIntensityAnalyzer
from ....domain.models.sentiment import SentimentAnalysis, SentimentSegment
from ....domain.ports.output import SentimentAnalysisPort


class SentimentAnalysisAdapter(SentimentAnalysisPort):
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str) -> SentimentAnalysis:
        """
        Analisa o sentimento de um texto usando a biblioteca LeIA-br (VADER).

        Args:
            text: O texto a ser analisado.

        Returns:
            Um objeto SentimentAnalysis contendo a timeline do sentimento.
        """
        scores = self.analyzer.polarity_scores(text)
        compound_score = scores['compound']

        # Define o sentimento com base no score 'compound'
        # Limites baseados na documentação do VADER/LeIA
        if compound_score >= 0.05:
            sentiment = "positivo"
            score = scores['pos']
        elif compound_score <= -0.05:
            sentiment = "negativo"
            score = scores['neg']
        else:
            sentiment = "neutro"
            score = scores['neu']

        # Como estamos analisando um segmento de texto por vez, a timeline terá um único item.
        # O serviço de domínio (SentimentAnalysisService) irá agregar os resultados.
        segment = SentimentSegment(
            start_time=0,  # Timestamps serão preenchidos pelo serviço de domínio
            end_time=0,
            sentiment=sentiment,
            score=round(score, 4)
        )

        return SentimentAnalysis(timeline=[segment])