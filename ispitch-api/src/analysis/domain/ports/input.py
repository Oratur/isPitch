from abc import ABC, abstractmethod
from typing import List

from fastapi import BackgroundTasks, UploadFile

from ..models.analysis import Analysis
from ..models.analysis_stats import AnalysisStats
from ..models.fillerwords import FillerWordsAnalysis
from ..models.lexical_richness import LexicalRichnessAnalysis
from ..models.silence import SilenceAnalysis
from ..models.topic import TopicAnalysis
from ..models.transcription import Transcription
from ..models.vocabulary import VocabularyAnalysis


class AnalysisOrchestratorPort(ABC):
    @abstractmethod
    def initiate(
        self, file: UploadFile, background_tasks: BackgroundTasks
    ) -> str:
        pass

    @abstractmethod
    def initiate_analysis(self, file: UploadFile, user_id: str) -> str:
        pass

    @abstractmethod
    def get_by_id(self, analysis_id: str) -> Analysis:
        pass

    @abstractmethod
    async def get_by_user_id(
        self, user_id: str, page: int, page_size: int
    ) -> List[Analysis]:
        pass


class AsyncAnalysisOrchestratorPort(ABC):
    @abstractmethod
    async def execute(self) -> Analysis:
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
    def get_audio_duration(
        self,
        audio_path: str,
    ) -> float:
        pass

    @classmethod
    @abstractmethod
    def get_speech_rate(
        cls,
        transcription: str,
        audio_duration: float,
        silence_duration: float,
    ) -> float:
        pass


class VocabularyAnalysisPort(ABC):
    @abstractmethod
    def analyze(self, transcription: Transcription) -> VocabularyAnalysis:
        pass


class LexicalRichnessPort(ABC):
    @abstractmethod
    def analyze(self, transcription: Transcription) -> LexicalRichnessAnalysis:
        pass


class TopicAnalysisPort(ABC):
    @abstractmethod
    def analyze(self, transcription: Transcription) -> TopicAnalysis:
        pass


class AnalysisStatsPort(ABC):
    @abstractmethod
    async def get_stats(self, user_id: str) -> AnalysisStats:
        pass
