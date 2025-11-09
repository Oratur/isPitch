from ...domain.models.analysis_stats import AnalysisStats
from ..rest.schemas.analysis_stats import (
    AnalysisStatsSchema,
    ChartDataSchema,
)


class AnalysisStatsMapper:
    @staticmethod
    def from_model(stats: AnalysisStats) -> AnalysisStatsSchema:
        """
        Converts domain model to response schema.

        Args:
            stats: AnalysisStats domain model.

        Returns:
            AnalysisStatsSchema for API response.
        """
        return AnalysisStatsSchema(
            total_analyses=stats.total_analyses,
            total_filler_words=stats.total_filler_words,
            total_duration=stats.total_duration,
            chart_data=[
                ChartDataSchema(name=chart.name, analyses=chart.analyses)
                for chart in stats.chart_data
            ],
        )
