from dataclasses import dataclass


@dataclass
class ChartData:
    name: str
    analyses: int


@dataclass
class AnalysisStats:
    total_analyses: int
    total_filler_words: int
    total_duration: float
    chart_data: list[ChartData]
