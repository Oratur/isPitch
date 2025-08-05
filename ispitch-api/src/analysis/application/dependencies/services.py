from ...application.dependencies.models import (
    get_spacy_model,
    get_whisper_model,
)
from ...domain.ports.input import (
    AnalysisOrchestratorPort,
    AudioAnalysisPort,
    SpeechAnalysisPort,
)
from ...domain.ports.output import (
    AudioPort,
    FillerWordsAnalysisPort,
    StoragePort,
    TranscriptionPort,
)
from ...domain.services.analysis_orchestrator_service import (
    AnalysisOrchestratorService,
)
from ...domain.services.audio_analysis_service import AudioAnalysisService
from ...domain.services.speech_analysis_service import SpeechAnalysisService
from ...infrastructure.adapters.audio.audio_adapter import AudioAdapter
from ...infrastructure.adapters.persistence.storage_adapter import (
    StorageAdapter,
)
from ...infrastructure.adapters.speech.fillerwords_analysis_adapter import (
    FillerWordsAnalysisAdapter,
)
from ...infrastructure.adapters.transcription.whisper_adapter import (
    WhisperAdapter,
)


def get_analysis_orchestrator() -> AnalysisOrchestratorPort:
    return AnalysisOrchestratorService(
        get_transcription_port(),
        get_storage_port(),
        get_speech_analysis_port(),
        get_audio_analysis_port(),
    )


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
