import logging
from typing import Any, Dict

from src.core.model_registry import get_whisper_model

logger = logging.getLogger(__name__)


class TranscriptionService:
    """
    Service responsible for handling audio transcription
    using the Whisper model.
    """

    def __init__(self):
        self.model = get_whisper_model()

    def transcribe(self, audio_path: str) -> Dict[str, Any]:
        """
        Transcribe the audio file at the given path using the Whisper model.

        Args:
        audio_path: Path to the audio file to be transcribed

        Returns:
        str: The transcribed text from the audio file.
        """

        try:
            logger.info(f'Starting transcription for audio file: {audio_path}')
            result = self.model.transcribe(
                audio_path, fp16=False, word_timestamps=True
            )
            logger.info('Transcription completed successfully.')
            return result
        except Exception as e:
            logger.error(
                f'An error occurred during transcription: {e}', exc_info=True
            )
            raise
