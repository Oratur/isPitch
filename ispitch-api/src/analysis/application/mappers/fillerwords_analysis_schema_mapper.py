from dataclasses import asdict

from ...domain.models.fillerwords import FillerWordsAnalysis
from ..rest.schemas.fillerwords import FillerWordsAnalysisSchema


class FillerWordsAnalysisSchemaMapper:
    @staticmethod
    def from_model(
        fillerwords_analysis: FillerWordsAnalysis,
    ) -> FillerWordsAnalysisSchema:
        return FillerWordsAnalysisSchema(
            distribution=fillerwords_analysis.distribution,
            occurrences=[asdict(o) for o in fillerwords_analysis.occurrences],
            total=fillerwords_analysis.total,
        )
