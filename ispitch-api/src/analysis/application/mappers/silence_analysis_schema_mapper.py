from dataclasses import asdict

from ...domain.models.silence import SilenceAnalysis
from ..rest.schemas.silence import SilenceAnalysisSchema


class SilenceAnalysisSchemaMapper:
    @staticmethod
    def from_model(silence_analysis: SilenceAnalysis) -> SilenceAnalysisSchema:
        return SilenceAnalysisSchema(
            duration=silence_analysis.duration,
            silences=[asdict(s) for s in silence_analysis.silences],
            pauses=silence_analysis.pauses,
        )
