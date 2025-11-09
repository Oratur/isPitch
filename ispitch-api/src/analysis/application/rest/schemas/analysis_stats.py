from src.core.schemas.camel_case_model import CamelCaseModel


class ChartDataSchema(CamelCaseModel):
    name: str
    analyses: int


class AnalysisStatsSchema(CamelCaseModel):
    total_analyses: int
    total_filler_words: int
    total_duration: float
    chart_data: list[ChartDataSchema]
