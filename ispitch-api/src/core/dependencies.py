from functools import lru_cache

from src.services.speech_analysis_service import SpeechAnalysisService
from src.services.storage_service import StorageService
from src.services.transcription_service import TranscriptionService


@lru_cache(maxsize=1)
def get_storage_service() -> StorageService:
    """
    Dependency to get the StorageService instance.
    Uses LRU cache to ensure a single instance is created.
    """
    return StorageService()


@lru_cache(maxsize=1)
def get_transcription_service() -> TranscriptionService:
    """
    Dependency to get the TranscriptionService instance.
    Uses LRU cache to ensure a single instance is created.
    This service is responsible for handling audio transcription.
    """
    return TranscriptionService()


@lru_cache(maxsize=1)
def get_speech_analysis_service() -> SpeechAnalysisService:
    """
    Dependency to get the SpeechAnalysisService instance.
    Uses LRU cache to ensure a single instance is created.
    This service is responsible for handling speech analysis operations.
    """

    return SpeechAnalysisService()
