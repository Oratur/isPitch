import logging
import uuid
from dataclasses import asdict

from ..mappers.analysis_mapper import AnalysisModelMapper
from ..models.analysis import Analysis, AudioAnalysis, SpeechAnalysis
from ..models.transcription import Transcription
from ..ports.input import (
    AnalysisOrchestratorPort,
    AudioAnalysisPort,
    SpeechAnalysisPort,
)
from ..ports.output import StoragePort, TranscriptionPort

logger = logging.getLogger(__name__)


class AnalysisOrchestratorService(AnalysisOrchestratorPort):
    def __init__(
        self,
        transcription_port: TranscriptionPort,
        storage_port: StoragePort,
        speech_analysis_port: SpeechAnalysisPort,
        audio_analysis_port: AudioAnalysisPort,
    ):
        self.transcription_port = transcription_port
        self.storage_port = storage_port
        self.speech_analysis_port = speech_analysis_port
        self.audio_analysis_port = audio_analysis_port

    def initiate(self, file, background_tasks) -> str:
        analysis_id = str(uuid.uuid4())
        temp_audio_path = self.storage_port.save_temporary_audio(file)

        background_tasks.add_task(
            self._run_analysis, analysis_id, temp_audio_path, file.filename
        )

        return analysis_id

    def get_by_id(self, analysis_id: str) -> Analysis:
        """
        Retrieves the result of an analysis by its ID.
        Args:
            analysis_id (str): The unique ID of the analysis.
        Returns:
            AnalysisResultResponse: The result of the analysis.
        """
        try:
            logger.info(f'Retrieving analysis result for ID: {analysis_id}')
            analysis = self.storage_port.get_analysis_result(analysis_id)
            return AnalysisModelMapper.from_dict(analysis)
        except FileNotFoundError:
            logger.error(f'Analysis result not found for ID: {analysis_id}')
            return Analysis(
                id=analysis_id,
                status='PENDING',
                filename='',
                transcription='',
                speech_analysis=None,
                audio_analysis=None,
            )

    def _run_analysis(self, analysis_id: str, audio_path: str, filename: str):
        try:
            transcription = self._run_transcription(
                analysis_id=analysis_id,
                audio_path=audio_path,
            )
            speech_analysis = self._run_speech_analysis(
                analysis_id=analysis_id,
                transcription=transcription,
            )
            audio_analysis = self._run_audio_analysis(
                analysis_id=analysis_id,
                audio_path=audio_path,
                transcription=transcription,
                speech_analysis=speech_analysis,
            )

            result = Analysis(
                id=analysis_id,
                status='COMPLETED',
                filename=filename,
                transcription=transcription,
                speech_analysis=speech_analysis,
                audio_analysis=audio_analysis,
            )
            self.storage_port.save_analysis_result(analysis_id, asdict(result))
        finally:
            self.storage_port.cleanup_temporary_file(audio_path)

    def _run_transcription(self, analysis_id: str, audio_path: str):
        logger.info(f'[{analysis_id}] Starting transcription')
        transcription_result = self.transcription_port.transcribe(audio_path)
        logger.info(f'[{analysis_id}] Transcription completed')

        return transcription_result

    def _run_speech_analysis(
        self, analysis_id: str, transcription: Transcription
    ) -> SpeechAnalysis:
        logger.info(f'[{analysis_id}] Detecting silences in transcription')
        silence_analysis = self.speech_analysis_port.detect_silences(
            transcription
        )
        logger.info(f'[{analysis_id}] Silences detection completed')

        logger.info(f'[{analysis_id}] Starting filler words analysis')
        fillerwords_analysis = self.speech_analysis_port.detect_fillerwords(
            transcription
        )
        logger.info(f'[{analysis_id}] Filler words analysis completed')

        return SpeechAnalysis(
            silence_analysis=silence_analysis,
            fillerwords_analysis=fillerwords_analysis,
        )

    def _run_audio_analysis(
        self,
        analysis_id: str,
        audio_path: str,
        transcription: Transcription,
        speech_analysis: SpeechAnalysis,
    ) -> AudioAnalysis:
        logger.info(f'[{analysis_id}] Calculating speech rate')
        speech_rate = self.audio_analysis_port.get_speech_rate(
            audio_path=audio_path,
            transcription=transcription.text,
            silence_duration=speech_analysis.silence_analysis.duration,
        )
        logger.info(
            f'[{analysis_id}] Speech rate calculated: {speech_rate} WPM'
        )

        return AudioAnalysis(speech_rate=speech_rate)
