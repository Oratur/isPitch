import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from ..models.analysis import (
    Analysis,
    AnalysisStatus,
    AudioAnalysis,
    SpeechAnalysis,
)
from ..models.events import SseEvent
from ..ports.input import (
    AsyncAnalysisOrchestratorPort,
    AudioAnalysisPort,
    LexicalRichnessPort,
    SpeechAnalysisPort,
    TopicAnalysisPort,
    VocabularyAnalysisPort,
)
from ..ports.output import NotificationPort, TranscriptionPort

logger = logging.getLogger(__name__)


@dataclass
class AnalysisConfig:
    analysis_id: str
    user_id: str
    audio_path: str
    filename: str


@dataclass
class AnalysisPort:
    transcription_port: TranscriptionPort
    speech_analysis_port: SpeechAnalysisPort
    audio_analysis_port: AudioAnalysisPort
    vocabulary_analysis_port: VocabularyAnalysisPort
    lexical_richness_port: LexicalRichnessPort
    topic_analysis_port: TopicAnalysisPort
    notification_port: NotificationPort


@dataclass
class AsyncAnalysisOrchestratorService(AsyncAnalysisOrchestratorPort):
    def __init__(self, config: AnalysisConfig, ports: AnalysisPort):
        self.analysis_id = config.analysis_id
        self.audio_path = config.audio_path
        self.filename = config.filename
        self.user_id = config.user_id
        self._transcription_port = ports.transcription_port
        self._speech_analysis_port = ports.speech_analysis_port
        self._audio_analysis_port = ports.audio_analysis_port
        self._vocabulary_analysis_port = ports.vocabulary_analysis_port
        self._lexical_richness_port = ports.lexical_richness_port
        self._topic_analysis_port = ports.topic_analysis_port
        self._notification_port = ports.notification_port

    async def execute(self) -> Analysis:
        transcription = await self._transcribe_audio()
        speech_analysis = await self._analyze_speech(transcription=transcription)
        audio_analysis = await self._analyze_audio(
            transcription=transcription, speech_analysis=speech_analysis
        )

        return self._build_result(
            transcription=transcription,
            speech_analysis=speech_analysis,
            audio_analysis=audio_analysis,
        )

    async def _transcribe_audio(self):
        await self._publish_status(AnalysisStatus.TRANSCRIBING)
        transcription = self._transcription_port.transcribe(self.audio_path)
        logger.info(f'[{self.analysis_id}] Transcription completed')
        return transcription

    async def _analyze_speech(self, transcription) -> SpeechAnalysis:
        await self._publish_status(AnalysisStatus.ANALYZING_SPEECH)

        silence = self._speech_analysis_port.detect_silences(transcription)
        filler = self._speech_analysis_port.detect_fillerwords(transcription)
        vocabulary = self._vocabulary_analysis_port.analyze(transcription)
        lexical_richness = self._lexical_richness_port.analyze(transcription)
        topics = self._topic_analysis_port.analyze(transcription)

        logger.info(f'[{self.analysis_id}] Speech analysis completed')
        return SpeechAnalysis(
            silence_analysis=silence,
            fillerwords_analysis=filler,
            vocabulary_analysis=vocabulary,
            lexical_richness_analysis=lexical_richness,
            topic_analysis=topics,
        )

    async def _analyze_audio(
        self, transcription, speech_analysis: SpeechAnalysis
    ) -> AudioAnalysis:
        await self._publish_status(AnalysisStatus.ANALYZING_AUDIO)

        audio_duration = self._audio_analysis_port.get_audio_duration(
            audio_path=self.audio_path
        )
        speech_rate = self._audio_analysis_port.get_speech_rate(
            transcription=transcription.text,
            audio_duration=audio_duration,
            silence_duration=speech_analysis.silence_analysis.duration,
        )

        logger.info(f'[{self.analysis_id}] Audio analysis completed')

        prosody_analysis = self._audio_analysis_port.get_prosody_analysis(
            self.audio_path
        )

        logger.info(f'[{self.analysis_id}] Prosody analysis completed')

        return AudioAnalysis(
            duration=audio_duration,
            speech_rate=speech_rate,
            prosody_analysis=prosody_analysis,
        )

    def _build_result(
        self,
        transcription,
        speech_analysis: SpeechAnalysis,
        audio_analysis: AudioAnalysis,
    ) -> Analysis:
        return Analysis(
            id=self.analysis_id,
            user_id=self.user_id,
            status=AnalysisStatus.COMPLETED,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            filename=self.filename,
            transcription=transcription,
            speech_analysis=speech_analysis,
            audio_analysis=audio_analysis,
        )

    async def _publish_status(self, status: AnalysisStatus) -> None:
        await self._notification_port.publish(
            analysis_id=self.analysis_id,
            event=SseEvent.STATUS_UPDATE,
            data=status.value,
        )
