from typing import List

from .....core.schemas.camel_case_model import CamelCaseModel


class VocabularySuggestionSchema(CamelCaseModel):
    word: str
    count: int
    alternatives: List[str]


class VocabularyAnalysisSchema(CamelCaseModel):
    suggestions: List[VocabularySuggestionSchema]
