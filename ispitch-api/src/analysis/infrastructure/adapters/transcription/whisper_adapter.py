from whisper import Whisper

from ....domain.mappers.transcription_mapper import TranscriptionMapper
from ....domain.ports.output import TranscriptionPort


class WhisperAdapter(TranscriptionPort):
    """
    Service responsible for handling audio transcription
    using the Whisper model.
    """

    def __init__(self, whisper: Whisper):
        self.whisper = whisper

    def transcribe(self, audio_path: str):
        """
        Transcribe the audio file at the given path using the Whisper model.

        Args:
        audio_path: Path to the audio file to be transcribed

        Returns:
        str: The transcribed text from the audio file.
        """
        result = self.whisper.transcribe(
            audio_path, fp16=False, word_timestamps=True
        )

        return TranscriptionMapper.from_whisper_result(result)
