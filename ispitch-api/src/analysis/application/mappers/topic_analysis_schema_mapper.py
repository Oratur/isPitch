from dataclasses import asdict

from ...domain.models.topic import TopicAnalysis
from ..rest.schemas.topic import TopicAnalysisSchema


class TopicAnalysisSchemaMapper:
    @staticmethod
    def from_model(
        topic_analysis: TopicAnalysis,
    ) -> TopicAnalysisSchema:
        if not topic_analysis:
            return TopicAnalysisSchema(topics=[])
        return TopicAnalysisSchema(
            topics=[asdict(s) for s in topic_analysis.topics]
        )
