from dataclasses import asdict
from ...domain.models.grammar import GrammarAnalysis
from ..rest.schemas.grammar import GrammarAnalysisSchema

class GrammarAnalysisSchemaMapper:
    @staticmethod
    def from_model(model: GrammarAnalysis) -> GrammarAnalysisSchema:
        return GrammarAnalysisSchema(
            issues=[asdict(i) for i in model.issues]
        )