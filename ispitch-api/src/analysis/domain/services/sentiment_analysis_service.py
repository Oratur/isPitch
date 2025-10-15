# ispitch-api/src/analysis/domain/services/sentiment_analysis_service.py

from ..models.sentiment import SentimentAnalysis
from ..models.transcription import Transcription
from ..ports.input import SentimentAnalysisPort as SentimentAnalysisInputPort
from ..ports.output import SentimentAnalysisPort as SentimentAnalysisOutputPort


class SentimentAnalysisService(SentimentAnalysisInputPort):
    def __init__(
        self, sentiment_analysis_port: SentimentAnalysisOutputPort
    ):
        self.sentiment_analysis_port = sentiment_analysis_port

    def analyze_sentiment(
        self, transcription: Transcription
    ) -> SentimentAnalysis:
        """
        Orquestra a análise de sentimento da transcrição.
        """
        # Aqui entrará a lógica da [TASK-41] para segmentar o texto.
        # Por enquanto, vamos analisar o texto completo como um único segmento.

        full_text = transcription.text
        if not full_text.strip():
            return SentimentAnalysis(timeline=[])

        # Delega a análise para o adaptador através da porta de saída
        sentiment_analysis = self.sentiment_analysis_port.analyze(full_text)

        # Simula o timestamp para o texto completo (provisório)
        if transcription.segments:
            start_time = transcription.segments[0].start
            end_time = transcription.segments[-1].words[-1].end if transcription.segments[-1].words else start_time
            for segment in sentiment_analysis.timeline:
                segment.start_time = round(start_time, 2)
                segment.end_time = round(end_time, 2)

        return sentiment_analysis