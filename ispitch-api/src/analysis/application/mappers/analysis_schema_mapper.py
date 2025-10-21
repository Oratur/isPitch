from ...domain.models.analysis import Analysis
from ..mappers.fillerwords_analysis_schema_mapper import (
    FillerWordsAnalysisSchemaMapper,
)
from ..mappers.silence_analysis_schema_mapper import (
    SilenceAnalysisSchemaMapper,
)
from ..mappers.vocabulary_analysis_schema_mapper import (
    VocabularyAnalysisSchemaMapper,
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
            transcription=analysis.transcription.text
            if analysis.transcription
            else None,
            speech_analysis=SpeechAnalysisSchema(
                silence_analysis=SilenceAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.silence_analysis
                )
                if analysis.speech_analysis
                else None,
                fillerwords_analysis=FillerWordsAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.fillerwords_analysis
                )
                if analysis.speech_analysis
                else None,
                vocabulary_analysis=VocabularyAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.vocabulary_analysis
                )
                if analysis.speech_analysis
                and analysis.speech_analysis.vocabulary_analysis
                else None,
            ),
            audio_analysis=AudioAnalysisSchema(
                speech_rate=analysis.audio_analysis.speech_rate
            )
            if analysis.audio_analysis
            else None,
        )
