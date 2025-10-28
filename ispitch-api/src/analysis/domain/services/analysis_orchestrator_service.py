import logging
from dataclasses import dataclass
from typing import List

from ..models.analysis import (
    Analysis,
    AnalysisStatus,
    AudioAnalysis,
    SpeechAnalysis,
)
from ..models.transcription import Transcription
from ..ports.input import (
    AnalysisOrchestratorPort,
    AudioAnalysisPort,
    SpeechAnalysisPort,
)
from ..ports.output import (
    AnalysisRepositoryPort,
    StoragePort,
    TaskQueuePort,
    TranscriptionPort,
)

logger = logging.getLogger(__name__)


@dataclass
class AnalysisOrchestratorDependencies:
    transcription_port: TranscriptionPort
    storage_port: StoragePort
    speech_analysis_port: SpeechAnalysisPort
    audio_analysis_port: AudioAnalysisPort
    analysis_repository_port: AnalysisRepositoryPort
    task_queue_port: TaskQueuePort


class AnalysisOrchestratorService(AnalysisOrchestratorPort):
    def __init__(self, deps: AnalysisOrchestratorDependencies):
        self.transcription_port = deps.transcription_port
        self.storage_port = deps.storage_port
        self.speech_analysis_port = deps.speech_analysis_port
        self.audio_analysis_port = deps.audio_analysis_port
        self.analysis_repository_port = deps.analysis_repository_port
        self.task_queue_port = deps.task_queue_port

    async def initiate_analysis(self, file, user_id: str) -> str:
        analysis = Analysis(
            id=None,
            user_id=user_id,
            status=AnalysisStatus.PENDING,
            filename=file.filename,
            transcription=None,
            speech_analysis=None,
            audio_analysis=None,
        )
        new_analysis = await self.analysis_repository_port.save(analysis)

        temp_audio_path = self.storage_port.save_temporary_audio(file)

        self.task_queue_port.enqueue_analysis(
            analysis_id=new_analysis.id,
            user_id=user_id,
            audio_path=temp_audio_path,
            filename=file.filename,
        )

        return new_analysis.id

    async def initiate(self, file, background_tasks) -> str:
        analysis = await self.analysis_repository_port.save(
            Analysis(
                id=None,
                status=AnalysisStatus.PENDING,
                filename=file.filename,
                transcription=None,
                speech_analysis=None,
                audio_analysis=None,
            )
        )

        temp_audio_path = self.storage_port.save_temporary_audio(file)

        background_tasks.add_task(
            self._run_analysis, analysis.id, temp_audio_path, file.filename
        )

        return analysis.id

    async def get_by_id(self, analysis_id: str) -> Analysis:
        """
        Retrieves the result of an analysis by its ID.
        Args:
            analysis_id (str): The unique ID of the analysis.
        Returns:
            AnalysisResultResponse: The result of the analysis.
        """
        try:
            logger.info(f'Retrieving analysis result for ID: {analysis_id}')
            analysis = await self.analysis_repository_port.find_by_id(
                analysis_id
            )
            return analysis
        # TODO: THROW NOT FOUND EXCEPTION
        except FileNotFoundError:
            logger.error(f'Analysis result not found for ID: {analysis_id}')
            return Analysis(
                id=analysis_id,
                status=AnalysisStatus.PENDING,
                filename='',
                transcription='',
                speech_analysis=None,
                audio_analysis=None,
            )
        
    async def get_by_user_id(self, user_id: str) -> List[Analysis]:
        """
        Retrieves all analyses for a specific user by their user ID.
        Args:
            user_id (str): The unique ID of the user.
        Returns:
            List[Analysis]: A list of analyses associated with the user.
        """
        try:
            analyses = await self.analysis_repository_port.find_by_user_id(user_id)
            return analyses
        except Exception as e:
            logger.error(f'Error retrieving analyses for user {user_id}: {str(e)}')
            raise

    async def _run_analysis(
        self, analysis_id: str, audio_path: str, filename: str
    ):
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
                status=AnalysisStatus.COMPLETED,
                filename=filename,
                transcription=transcription,
                speech_analysis=speech_analysis,
                audio_analysis=audio_analysis,
            )
            await self.analysis_repository_port.save(result)
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
        logger.info(f'[{analysis_id}] Speech rate calculated: {speech_rate} WPM')

        return AudioAnalysis(speech_rate=speech_rate)
