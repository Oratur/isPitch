from .....core.schemas.camel_case_model import CamelCaseModel


class LexicalRichnessAnalysisSchema(CamelCaseModel):
    type_token_ratio: float
    unique_words: int
    total_words: int
