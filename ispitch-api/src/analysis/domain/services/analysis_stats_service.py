from ..models.analysis_stats import AnalysisStats
from ..ports.input import AnalysisStatsPort
from ..ports.output import AnalysisStatsRepositoryPort


class AnalysisStatsService(AnalysisStatsPort):
    def __init__(self, stats_repository: AnalysisStatsRepositoryPort):
        self.stats_repository = stats_repository

    async def get_stats(self, user_id: str) -> AnalysisStats:
        return await self.stats_repository.get_stats(user_id)
