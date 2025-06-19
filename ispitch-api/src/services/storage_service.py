import logging
import os
import tempfile

from fastapi import UploadFile

logger = logging.getLogger(__name__)


class StorageService:
    """
    Service responsible for handling file storage operations.
    """

    RESULTS_DIR = 'analysis_results'

    def __init__(self):
        os.makedirs(self.RESULTS_DIR, exist_ok=True)

    @staticmethod
    def save_temporary_audio(file: UploadFile) -> str:
        """
        Saves the uploaded audio file to a temporary location.

        Args:
            file: The uploaded audio file.

        Returns:
            str: The path to the saved temporary file.
        """
        try:
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix='.mp3' if file.content_type == 'audio/mpeg' else '.wav',
            ) as temp_file:
                temp_file.write(file.file.read())
                temp_file_path = temp_file.name
                logger.info(f'Temporary audio file saved at: {temp_file_path}')
                return temp_file_path
        except Exception as e:
            logger.error(
                f'Error saving temporary audio file: {e}', exc_info=True
            )
            raise

    def save_analysis_result(self, analysis_id: str, transcription: str):
        """
        Saves the transcription result to a file.

        Args:
            analysis_id: Unique identifier for the analysis.
        """

        output_path = os.path.join(self.RESULTS_DIR, f'{analysis_id}.txt')
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(transcription)
            logger.info(f'Analysis result saved at: {output_path}')
        except Exception as e:
            logger.error(
                f'Error saving analysis result for ID {analysis_id}: {e}',
                exc_info=True,
            )
            raise

    @staticmethod
    def cleanup_temporary_file(file_path: str):
        """
        Deletes the temporary audio file.

        Args:
            file_path: Path to the temporary audio file.
        """
        try:
            os.remove(file_path)
            logger.info(f'Temporary file {file_path} deleted successfully.')
        except Exception as e:
            logger.error(
                f'Error deleting temporary file {file_path}: {e}',
                exc_info=True,
            )
            raise
