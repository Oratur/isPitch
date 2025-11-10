from ...domain.models.analysis import Analysis
from ..rest.schemas.recent_analysis import RecentAnalysisSchema


class RecentAnalysisMapper:
    @staticmethod
    def from_model(analysis: Analysis) -> RecentAnalysisSchema:
        return RecentAnalysisSchema(
            id=analysis.id,
            filename=analysis.filename,
            created_at=analysis.created_at,
            status=analysis.status,
            filler_words_count=(
                analysis.speech_analysis.fillerwords_analysis.total
                if analysis.speech_analysis
                and analysis.speech_analysis.fillerwords_analysis
                else 0
            ),
            speech_rate=(
                analysis.audio_analysis.speech_rate
                if analysis.audio_analysis
                else 0.0
            ),
            pauses_count=(
                analysis.speech_analysis.silence_analysis.pauses
                if analysis.speech_analysis
                and analysis.speech_analysis.silence_analysis
                else 0
            ),
        )
