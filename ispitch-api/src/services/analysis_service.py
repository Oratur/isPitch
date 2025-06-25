import logging
import uuid

from fastapi import BackgroundTasks, Depends, UploadFile

from src.api.schemas.analysis import AnalysisResultData, AnalysisResultResponse
from src.core.dependencies import (
    get_speech_analysis_service,
    get_storage_service,
    get_transcription_service,
)
from src.services.speech_analysis_service import SpeechAnalysisService
from src.services.storage_service import StorageService
from src.services.transcription_service import TranscriptionService

logger = logging.getLogger(__name__)


class InvalidFileError(ValueError):
    pass


class FileTooLargeError(InvalidFileError):
    pass


class UnsupportedFileTypeError(InvalidFileError):
    pass


class AnalysisService:
    """
    Service responsible for handling audio analysis operations.
    """

    MAX_FILE_SIZE_BYTES = 60 * 1024 * 1024
    VALID_CONTENT_TYPES = ['audio/mpeg', 'audio/wav']

    def __init__(
        self,
        storage_service: StorageService = Depends(get_storage_service),
        transcription_service: TranscriptionService = Depends(
            get_transcription_service
        ),
        speech_analysis_service: SpeechAnalysisService = Depends(
            get_speech_analysis_service
        ),
    ):
        self.storage_service = storage_service
        self.transcription_service = transcription_service
        self.speech_analysis_service = speech_analysis_service

    def _validate_file(self, file: UploadFile):
        """
        Validates the uploaded audio file.
        Raises exceptions for invalid files.
        """
        if file.content_type not in self.VALID_CONTENT_TYPES:
            raise UnsupportedFileTypeError(
                f'Unsupported file type: {file.content_type}. '
                'Supported types are: ' + ', '.join(self.VALID_CONTENT_TYPES)
            )
        if file.size > self.MAX_FILE_SIZE_BYTES:
            raise FileTooLargeError(
                'File size exceeds the limit of '
                + f'{self.MAX_FILE_SIZE_BYTES} bytes.'
            )

    def start_analysis_process(
        self, file: UploadFile, background_tasks: BackgroundTasks
    ):
        """
        Starts the analysis process in the background.
        Args:
            file (UploadFile): The audio file to analyze.
            background_tasks (BackgroundTasks): FastAPI's background
            tasks manager.
        """
        self._validate_file(file)
        analysis_id = str(uuid.uuid4())
        temp_audio_path = self.storage_service.save_temporary_audio(file)
        original_filename = file.filename

        background_tasks.add_task(
            self._run_analysis,
            analysis_id,
            temp_audio_path,
            original_filename,
        )

        return analysis_id

    def _run_analysis(
        self, analysis_id: str, audio_path: str, original_filename: str
    ):
        try:
            transcription_result = self.transcription_service.transcribe(
                audio_path
            )

            silences = self.speech_analysis_service.detect_silences(
                transcription_result
            )

            filler_words = self.speech_analysis_service.detect_filler_words(
                transcription
            )

            result_data = {
                'fileName': original_filename,
                'transcription': transcription_result.get('text', '').strip(),
                'silences': silences,
                'filler_words': filler_words,
            }

            self.storage_service.save_analysis_result(analysis_id, result_data)
        finally:
            self.storage_service.cleanup_temporary_file(audio_path)

    def get_analysis(self, analysis_id: str) -> AnalysisResultResponse:
        """
        Retrieves the result of an analysis by its ID.
        Args:
            analysis_id (str): The unique ID of the analysis.
        Returns:
            AnalysisResultResponse: The result of the analysis.
        """
        try:
            logger.info(f'Retrieving analysis result for ID: {analysis_id}')
            result_data = self.storage_service.get_analysis_result(analysis_id)
            return AnalysisResultResponse(
                id=analysis_id,
                status='COMPLETED',
                data=AnalysisResultData(**result_data),
            )
        except FileNotFoundError:
            logger.error(f'Analysis result not found for ID: {analysis_id}')
            return AnalysisResultResponse(
                id=analysis_id,
                status='PENDING',
                data=None,
            )
