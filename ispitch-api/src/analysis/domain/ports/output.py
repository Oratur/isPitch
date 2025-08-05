from abc import ABC, abstractmethod

from fastapi import UploadFile

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
    def save_analysis_result(self, analysis_id: str, result: dict):
        pass

    @abstractmethod
    def cleanup_temporary_file(self, file_path: str):
        pass

    @abstractmethod
    def get_analysis_result(self, analysis_id: str) -> dict:
        pass


class FillerWordsAnalysisPort(ABC):
    @abstractmethod
    def detect(self, transcription: Transcription) -> FillerWordsAnalysis:
        pass


class AudioPort(ABC):
    @abstractmethod
    def get_audio_duration(self, audio_path: str) -> float:
        pass
