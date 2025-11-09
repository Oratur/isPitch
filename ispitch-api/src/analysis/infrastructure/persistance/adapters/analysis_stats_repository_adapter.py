import asyncio
from typing import Any

from ....domain.models.analysis_stats import AnalysisStats, ChartData
from ....domain.ports.output import AnalysisStatsRepositoryPort
from ..documents.analysis_document import AnalysisDocument


class AnalysisStatsRepositoryAdapter(AnalysisStatsRepositoryPort):
    MONTH_NAMES = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ]

    async def get_stats(self, user_id: str) -> AnalysisStats:
        totals_pipeline = [
            {'$match': {'user_id': user_id}},
            {
                '$group': {
                    '_id': None,
                    'total_analyses': {'$sum': 1},
                    'total_filler_words': {
                        '$sum': '$speech_analysis.fillerwords_analysis.total'
                    },
                    'total_duration': {'$sum': '$audio_analysis.duration'},
                }
            },
        ]

        chart_pipeline = [
            {'$match': {'user_id': user_id}},
            {
                '$project': {
                    'month': {'$month': '$created_at'},
                    'year': {'$year': '$created_at'},
                }
            },
            {
                '$group': {
                    '_id': {'month': '$month', 'year': '$year'},
                    'analyses': {'$sum': 1},
                }
            },
            {'$sort': {'_id.year': 1, '_id.month': 1}},
        ]

        totals_result, chart_result = await asyncio.gather(
            self._run_pipeline(totals_pipeline),
            self._run_pipeline(chart_pipeline),
        )

        total_analyses, total_filler_words, total_duration = self._parse_totals(
            totals_result
        )

        chart_data = self._build_chart_data(chart_result)

        return AnalysisStats(
            total_analyses=total_analyses,
            total_filler_words=total_filler_words,
            total_duration=total_duration,
            chart_data=chart_data,
        )

    @staticmethod
    async def _run_pipeline(
        pipeline: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        cursor = AnalysisDocument.get_pymongo_collection().aggregate(pipeline)
        results: list[dict[str, Any]] = []
        async for doc in cursor:
            results.append(doc)
        return results

    @staticmethod
    def _parse_totals(
        totals_result: list[dict[str, Any]],
    ) -> tuple[int, int, float]:
        if not totals_result:
            return 0, 0, 0.0

        totals = totals_result[0]
        total_analyses = totals.get('total_analyses', 0)
        total_filler_words = totals.get('total_filler_words', 0)
        total_duration = round(totals.get('total_duration', 0.0), 2)
        return total_analyses, total_filler_words, total_duration

    def _build_chart_data(
        self, chart_result: list[dict[str, Any]]
    ) -> list[ChartData]:
        chart_data: list[ChartData] = []
        for item in chart_result:
            month = item['_id']['month']
            year = item['_id']['year']
            analyses_count = item['analyses']

            month_name = self.MONTH_NAMES[month - 1]
            year_short = str(year)[-2:]
            name = f'{month_name}/{year_short}'

            chart_data.append(ChartData(name=name, analyses=analyses_count))

        return chart_data
