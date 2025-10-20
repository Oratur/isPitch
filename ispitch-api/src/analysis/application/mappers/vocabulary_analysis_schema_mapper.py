from dataclasses import asdict

from ...domain.models.vocabulary import VocabularyAnalysis
from ..rest.schemas.vocabulary import VocabularyAnalysisSchema


class VocabularyAnalysisSchemaMapper:
    @staticmethod
    def from_model(
        vocabulary_analysis: VocabularyAnalysis,
    ) -> VocabularyAnalysisSchema:
        if not vocabulary_analysis:
            return None
        return VocabularyAnalysisSchema(
            suggestions=[asdict(s) for s in vocabulary_analysis.suggestions]
        )
