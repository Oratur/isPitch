from abc import ABC, abstractmethod
from typing import List

from fastapi import UploadFile

from src.analysis.domain.models.analysis import Analysis

from ..models.analysis_stats import AnalysisStats
from ..models.events import SseEvent
from ..models.fillerwords import FillerWordsAnalysis
from ..models.topic import TopicAnalysis
from ..models.transcription import Transcription


class TranscriptionPort(ABC):
    @abstractmethod
    def transcribe(self, audio_path: str) -> Transcription:
        pass


class StoragePort(ABC):
    @abstractmethod
    def save_temporary_audio(self, file: UploadFile) -> str:
        pass

    @abstractmethod
    def cleanup_temporary_file(self, file_path: str):
        pass


class FillerWordsAnalysisPort(ABC):
    @abstractmethod
    def detect(self, transcription: Transcription) -> FillerWordsAnalysis:
        pass


class AudioPort(ABC):
    @abstractmethod
    def get_audio_duration(self, audio_path: str) -> float:
        pass


class AnalysisRepositoryPort(ABC):
    @abstractmethod
    def save(self, analysis: Analysis) -> Analysis:
        pass

    @abstractmethod
    def find_by_id(self, analysis_id: str) -> Analysis:
        pass

    @abstractmethod
    async def find_by_user_id(self, user_id: str) -> List[Analysis]:
        pass

    @abstractmethod
    def find_all(self) -> list[Analysis]:
        pass

    @abstractmethod
    def delete_by_id(self, analysis_id: str):
        pass


class NotificationPort(ABC):
    @abstractmethod
    async def publish(
        self, analysis_id: str, event: SseEvent, data: str
    ) -> None:
        pass


class TaskQueuePort(ABC):
    @abstractmethod
    def enqueue_analysis(
        self, analysis_id: str, user_id: str, audio_path: str, filename: str
    ) -> None:
        pass


class SynonymProviderPort(ABC):
    @abstractmethod
    def get_synonyms(self, word: str) -> list[str]:
        pass


class TopicModelPort(ABC):
    @abstractmethod
    def extract_topics(self, text: str) -> TopicAnalysis:
        pass


class AnalysisStatsRepositoryPort(ABC):
    @abstractmethod
    async def get_stats(self, user_id: str) -> AnalysisStats:
        pass
