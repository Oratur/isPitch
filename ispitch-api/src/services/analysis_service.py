import logging
import uuid

from fastapi import Depends, UploadFile

from src.core.dependencies import (
    get_storage_service,
    get_transcription_service,
)
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
    ):
        self.storage_service = storage_service
        self.transcription_service = transcription_service

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

    def create_analysis(self, file: UploadFile) -> str:
        self._validate_file(file)
        analysis_id = str(uuid.uuid4())
        logger.info(f'Creating analysis with ID: {analysis_id}')

        try:
            temp_audio_path = self.storage_service.save_temporary_audio(file)
            transcription = self.transcription_service.transcribe(
                temp_audio_path
            )
            self.storage_service.save_analysis_result(
                analysis_id, transcription
            )

            return analysis_id
        finally:
            # Clean up temporary audio file
            if temp_audio_path:
                self.storage_service.cleanup_temporary_file(temp_audio_path)
