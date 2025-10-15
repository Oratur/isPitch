from dataclasses import asdict

from ...domain.models.sentiment import SentimentAnalysis
from ..rest.schemas.sentiment import SentimentAnalysisSchema


class SentimentAnalysisSchemaMapper:
    @staticmethod
    def from_model(
        sentiment_analysis: SentimentAnalysis) -> SentimentAnalysisSchema:
        if not sentiment_analysis:
            return SentimentAnalysisSchema(timeline=[])

        return SentimentAnalysisSchema(
            timeline=[asdict(seg) for seg in sentiment_analysis.timeline]
        )
