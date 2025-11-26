from ..models.sentiment import SentimentAnalysis, SentimentSegment
from ..models.transcription import Transcription
from ..ports.input import SentimentAnalysisPort as SentimentAnalysisInputPort
from ..ports.output import SentimentAnalysisPort as SentimentAnalysisOutputPort
from ..utils.text_segmenter import segment_transcription


class SentimentAnalysisService(SentimentAnalysisInputPort):
    def __init__(self, sentiment_analysis_port: SentimentAnalysisOutputPort):
        self.sentiment_analysis_port = sentiment_analysis_port

    def analyze_sentiment(
        self, transcription: Transcription
    ) -> SentimentAnalysis:
        """
        Orquestra a análise de sentimento da transcrição, segmentando o texto
        e analisando cada segmento individualmente.
        """
        all_words = [
            word for segment in transcription.segments for word in segment.words
        ]

        if not all_words:
            return SentimentAnalysis(timeline=[])

        timeline: list[SentimentSegment] = []

        # Itera sobre os segmentos gerados pela nossa nova função
        for segment in segment_transcription(all_words):
            text_to_analyze = str(segment['text'])

            # Pula segmentos vazios
            if not text_to_analyze.strip():
                continue

            # Delega a análise do texto do segmento para o adaptador
            analysis_result = self.sentiment_analysis_port.analyze(
                text_to_analyze
            )

            for result_segment in analysis_result.timeline:
                timeline.append(
                    SentimentSegment(
                        start_time=round(float(segment['start_time']), 2),
                        end_time=round(float(segment['end_time']), 2),
                        sentiment=result_segment.sentiment,
                        score=result_segment.score,
                    )
                )

        return SentimentAnalysis(timeline=timeline)
