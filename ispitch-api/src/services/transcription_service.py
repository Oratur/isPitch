import logging

import whisper

logger = logging.getLogger(__name__)


class TranscriptionService:
    """
    Service responsible for handling audio transcription
    using the Whisper model.
    """

    def __init__(self):
        self.model = whisper.load_model('base')

    def transcribe(self, audio_path: str) -> str:
        """
        Transcribe the audio file at the given path using the Whisper model.

        Args:
        audio_path: Path to the audio file to be transcribed

        Returns:
        str: The transcribed text from the audio file.
        """

        try:
            logger.info(f'Starting transcription for audio file: {audio_path}')
            result = self.model.transcribe(audio_path, fp16=False)
            transcription_text = result.get('text', 'Transcription failed.')
            logger.info('Transcription completed successfully.')
            return transcription_text
        except Exception as e:
            logger.error(
                f'An error occurred during transcription: {e}', exc_info=True
            )
            raise
