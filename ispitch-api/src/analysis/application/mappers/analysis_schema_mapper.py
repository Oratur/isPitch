from ...domain.models.analysis import Analysis
from ..mappers.fillerwords_analysis_schema_mapper import (
    FillerWordsAnalysisSchemaMapper,
)
from ..mappers.silence_analysis_schema_mapper import (
    SilenceAnalysisSchemaMapper,
)
from ..rest.schemas.analysis import (
    AnalysisSchema,
    AudioAnalysisSchema,
    SpeechAnalysisSchema,
)


class AnalysisSchemaMapper:
    @staticmethod
    def from_model(analysis: Analysis) -> AnalysisSchema:
        return AnalysisSchema(
            id=analysis.id,
            status=analysis.status,
            filename=analysis.filename,
            transcription=analysis.transcription.text,
            speech_analysis=SpeechAnalysisSchema(
                silence_analysis=SilenceAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.silence_analysis
                ),
                fillerwords_analysis=FillerWordsAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.fillerwords_analysis
                ),
            ),
            audio_analysis=AudioAnalysisSchema(
                speech_rate=analysis.audio_analysis.speech_rate
            ),
        )
