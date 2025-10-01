from abc import ABC, abstractmethod

from fastapi import BackgroundTasks, UploadFile

from ..models.analysis import Analysis
from ..models.fillerwords import FillerWordsAnalysis
from ..models.silence import SilenceAnalysis
from ..models.transcription import Transcription


class AnalysisOrchestratorPort(ABC):
    @abstractmethod
    def initiate(
        self, file: UploadFile, background_tasks: BackgroundTasks
    ) -> str:
        pass

    @abstractmethod
    def initiate_analysis(self, file: UploadFile) -> str:
        pass

    @abstractmethod
    def get_by_id(self, analysis_id: str) -> Analysis:
        pass


class SpeechAnalysisPort(ABC):
    @abstractmethod
    def detect_silences(
        self, transcription: Transcription, threshold_ms=1000
    ) -> SilenceAnalysis:
        pass

    @abstractmethod
    def detect_fillerwords(
        self, transcription: Transcription
    ) -> FillerWordsAnalysis:
        pass


class AudioAnalysisPort(ABC):
    @abstractmethod
    def get_speech_rate(
        self,
        audio_path: str,
        transcription: str,
        silence_duration: float,
    ) -> float:
        pass
