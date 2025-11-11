import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from ....domain.models.analysis_stats import AnalysisStats, ChartData
from ....domain.models.time_range import TimeRange
from ....domain.ports.output import AnalysisStatsRepositoryPort
from ..documents.analysis_document import AnalysisDocument

SECONDS_TO_MINUTES = 60


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

    async def get_stats(
        self, user_id: str, time_range: TimeRange
    ) -> AnalysisStats:
        base_match = {'user_id': user_id, 'status': 'completed'}
        time_filter = self._get_time_filter(time_range)

        if time_filter:
            base_match.update(time_filter)

        totals_pipeline = [
            {'$match': base_match},
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

        chart_grouping = self._get_chart_grouping(time_range)
        name_projection = self._get_name_projection(time_range)

        chart_pipeline = [
            {'$match': base_match},
            {'$group': {'_id': chart_grouping, 'analyses': {'$sum': 1}}},
            {'$sort': {'_id': 1}},
            {'$project': {'_id': 0, 'name': name_projection, 'analyses': 1}},
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
        total_duration = round(
            totals.get('total_duration', 0) / SECONDS_TO_MINUTES
        )
        return total_analyses, total_filler_words, total_duration

    @staticmethod
    def _build_chart_data(chart_result: list[dict[str, Any]]) -> list[ChartData]:
        chart_data: list[ChartData] = []
        for item in chart_result:
            name = item.get('name')
            analyses_count = item.get('analyses', 0)
            chart_data.append(ChartData(name=name, analyses=analyses_count))

        return chart_data

    @staticmethod
    def _get_time_filter(time_range: TimeRange) -> Optional[dict]:
        if time_range == TimeRange.ALL:
            return None

        now = datetime.now(timezone.utc)

        if time_range == TimeRange.DAY:
            start_date = now - timedelta(days=1)
        elif time_range == TimeRange.MONTH:
            start_date = now - timedelta(days=30)
        elif time_range == TimeRange.YEAR:
            start_date = now - timedelta(days=365)
        else:
            return None

        return {'created_at': {'$gte': start_date}}

    @staticmethod
    def _get_chart_grouping(time_range: TimeRange) -> dict:
        if time_range == TimeRange.DAY:
            return {
                'year': {'$year': '$created_at'},
                'month': {'$month': '$created_at'},
                'day': {'$dayOfMonth': '$created_at'},
                'hour': {'$hour': '$created_at'},
            }
        elif time_range == TimeRange.MONTH:
            # Agrupa por dia
            return {
                'year': {'$year': '$created_at'},
                'month': {'$month': '$created_at'},
                'day': {'$dayOfMonth': '$created_at'},
            }
        else:
            # Agrupa por mês
            return {
                'year': {'$year': '$created_at'},
                'month': {'$month': '$created_at'},
            }

    def _get_name_projection(self, time_range: TimeRange) -> dict:
        # Depois do $group o campo de agrupamento fica em "_id"
        if time_range == TimeRange.DAY:
            return {'$concat': [{'$toString': '$_id.hour'}, 'h']}
        elif time_range == TimeRange.MONTH:
            return {
                '$concat': [
                    {'$toString': '$_id.day'},
                    '/',
                    {'$toString': '$_id.month'},
                ]
            }
        else:
            return {
                '$arrayElemAt': [
                    self.MONTH_NAMES,
                    {'$subtract': ['$_id.month', 1]},
                ]
            }
