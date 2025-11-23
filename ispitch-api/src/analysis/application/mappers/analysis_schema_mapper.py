from ...domain.models.analysis import Analysis
from ..mappers.fillerwords_analysis_schema_mapper import (
    FillerWordsAnalysisSchemaMapper,
)
from ..mappers.lexical_richness_analysis_schema_mapper import (
    LexicalRichnessAnalysisSchemaMapper,
)
from ..mappers.prosody_analysis_schema_mapper import (
    ProsodyAnalysisSchemaMapper,
)
from ..mappers.sentiment_analysis_schema_mapper import (
    SentimentAnalysisSchemaMapper,
)
from ..mappers.silence_analysis_schema_mapper import (
    SilenceAnalysisSchemaMapper,
)
from ..mappers.grammar_analysis_schema_mapper import (
    GrammarAnalysisSchemaMapper,
)
from ..mappers.topic_analysis_schema_mapper import TopicAnalysisSchemaMapper
from ..mappers.vocabulary_analysis_schema_mapper import (
    VocabularyAnalysisSchemaMapper,
)
from ..rest.schemas import (
    AnalysisSchema,
    AnalysisSummarySchema,
    AudioAnalysisSchema,
    SpeechAnalysisSchema,
)


class AnalysisSchemaMapper:
    @staticmethod
    def from_model(analysis: Analysis) -> AnalysisSchema:
        return AnalysisSchema(
            id=analysis.id,
            user_id=analysis.user_id,
            status=analysis.status,
            filename=analysis.filename,
            created_at=analysis.created_at,
            updated_at=analysis.updated_at,
            score=analysis.score,
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
                lexical_richness_analysis=LexicalRichnessAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.lexical_richness_analysis
                )
                if analysis.speech_analysis
                and analysis.speech_analysis.lexical_richness_analysis
                else None,
                topic_analysis=TopicAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.topic_analysis
                )
                if analysis.speech_analysis
                and analysis.speech_analysis.topic_analysis
                else None,
                sentiment_analysis=SentimentAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.sentiment_analysis
                )                
                if analysis.speech_analysis
                and analysis.speech_analysis.sentiment_analysis
                else None,
                grammar_analysis=GrammarAnalysisSchemaMapper.from_model(
                    analysis.speech_analysis.grammar_analysis
                )
                if analysis.speech_analysis
                and analysis.speech_analysis.grammar_analysis
                else None,
            ),
            audio_analysis=AudioAnalysisSchema(
                duration=analysis.audio_analysis.duration,
                speech_rate=analysis.audio_analysis.speech_rate,
                prosody_analysis=ProsodyAnalysisSchemaMapper.from_model(
                    analysis.audio_analysis.prosody_analysis
                )
                if (
                    analysis.audio_analysis
                    and analysis.audio_analysis.prosody_analysis
                )
                else None,
            )
            if analysis.audio_analysis
            else None,
        )

    @staticmethod
    def to_summary(analysis: Analysis) -> AnalysisSummarySchema:
        return AnalysisSummarySchema(
            id=analysis.id,
            user_id=analysis.user_id,
            status=analysis.status,
            filename=analysis.filename,
            duration=analysis.audio_analysis.duration
            if analysis.audio_analysis
            else 0.0,
            created_at=analysis.created_at,
            score=analysis.score,
        )
