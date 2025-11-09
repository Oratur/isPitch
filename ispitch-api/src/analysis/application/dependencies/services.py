from functools import lru_cache
from typing import AsyncIterator

from ...application.dependencies.models import (
    get_spacy_model,
    get_summarizer_model,
    get_summarizer_tokenizer,
    get_whisper_model,
    load_nltk_synonym_resources,
    load_nltk_tokenizer,
)
from ...domain.ports.input import (
    AnalysisOrchestratorPort,
    AnalysisStatsPort,
    AudioAnalysisPort,
    LexicalRichnessPort,
    SpeechAnalysisPort,
    TopicAnalysisPort,
    VocabularyAnalysisPort,
)
from ...domain.ports.output import (
    AnalysisRepositoryPort,
    AudioPort,
    FillerWordsAnalysisPort,
    StoragePort,
    SynonymProviderPort,
    TaskQueuePort,
    TopicModelPort,
    TranscriptionPort,
)
from ...domain.services.analysis_orchestrator_service import (
    AnalysisOrchestratorDependencies,
    AnalysisOrchestratorService,
)
from ...domain.services.analysis_stats_service import AnalysisStatsService
from ...domain.services.audio_analysis_service import AudioAnalysisService
from ...domain.services.lexical_richness_service import LexicalRichnessService
from ...domain.services.speech_analysis_service import SpeechAnalysisService
from ...domain.services.topic_analysis_service import TopicAnalysisService
from ...domain.services.vocabulary_analysis_service import (
    VocabularyAnalysisService,
)
from ...infrastructure.adapters import (
    AudioAdapter,
    CeleryTaskQueueAdapter,
    FillerWordsAnalysisAdapter,
    HuggingFaceTopicAdapter,
    NltkSynonymProviderAdapter,
    WhisperAdapter,
)
from ...infrastructure.context.resource_manager import ResourceManager
from ...infrastructure.persistance.adapters import (
    AnalysisRepositoryAdapter,
    AnalysisStatsRepositoryAdapter,
    StorageAdapter,
)
from ..adapters.sse_adapter import RedisSSEAdapter


def get_analysis_orchestrator() -> AnalysisOrchestratorPort:
    deps = AnalysisOrchestratorDependencies(
        transcription_port=get_transcription_port(),
        storage_port=get_storage_port(),
        speech_analysis_port=get_speech_analysis_port(),
        audio_analysis_port=get_audio_analysis_port(),
        analysis_repository_port=get_analysis_repository(),
        task_queue_port=get_task_queue_port(),
    )
    return AnalysisOrchestratorService(deps)


def get_transcription_port() -> TranscriptionPort:
    return WhisperAdapter(get_whisper_model())


def get_storage_port() -> StoragePort:
    return StorageAdapter()


def get_speech_analysis_port() -> SpeechAnalysisPort:
    return SpeechAnalysisService(get_fillerwords_analysis_port())


def get_fillerwords_analysis_port() -> FillerWordsAnalysisPort:
    return FillerWordsAnalysisAdapter(get_spacy_model())


def get_audio_analysis_port() -> AudioAnalysisPort:
    return AudioAnalysisService(get_audio_port())


def get_audio_port() -> AudioPort:
    return AudioAdapter()


def get_analysis_repository() -> AnalysisRepositoryPort:
    return AnalysisRepositoryAdapter()


def get_task_queue_port() -> TaskQueuePort:
    return CeleryTaskQueueAdapter()


async def get_sse_adapter() -> AsyncIterator[RedisSSEAdapter]:
    async with ResourceManager.sse_adapter_context() as sse_adapter:
        yield sse_adapter


@lru_cache(maxsize=1)
def get_synonym_provider() -> SynonymProviderPort:
    load_nltk_synonym_resources()
    return NltkSynonymProviderAdapter()


@lru_cache(maxsize=1)
def get_vocabulary_analysis_port() -> VocabularyAnalysisPort:
    return VocabularyAnalysisService(get_synonym_provider())


@lru_cache(maxsize=1)
def get_lexical_richness_port() -> LexicalRichnessPort:
    return LexicalRichnessService()


@lru_cache(maxsize=1)
def get_topic_model_port() -> TopicModelPort:
    return HuggingFaceTopicAdapter(
        tokenizer=get_summarizer_tokenizer(), model=get_summarizer_model()
    )


@lru_cache(maxsize=1)
def get_topic_analysis_port() -> TopicAnalysisPort:
    load_nltk_tokenizer()
    return TopicAnalysisService(get_topic_model_port())


@lru_cache(maxsize=1)
def get_analysis_stats_service() -> AnalysisStatsPort:
    stats_repository = AnalysisStatsRepositoryAdapter()
    return AnalysisStatsService(stats_repository)
