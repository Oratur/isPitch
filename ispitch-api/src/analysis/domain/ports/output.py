from abc import ABC, abstractmethod

from fastapi import UploadFile

from src.analysis.domain.models.analysis import Analysis

from ..models.fillerwords import FillerWordsAnalysis
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
    def find_all(self) -> list[Analysis]:
        pass

    @abstractmethod
    def delete_by_id(self, analysis_id: str):
        pass
