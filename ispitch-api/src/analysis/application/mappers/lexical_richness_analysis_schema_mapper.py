from ...domain.models.lexical_richness import LexicalRichnessAnalysis
from ..rest.schemas.lexical_richness import LexicalRichnessAnalysisSchema


class LexicalRichnessAnalysisSchemaMapper:
    @staticmethod
    def from_model(
        analysis: LexicalRichnessAnalysis,
    ) -> LexicalRichnessAnalysisSchema:
        if not analysis:
            return None
        return LexicalRichnessAnalysisSchema(
            type_token_ratio=analysis.type_token_ratio,
            unique_words=analysis.unique_words,
            total_words=analysis.total_words,
        )
