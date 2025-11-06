from ..ports.input import AudioAnalysisPort
from ..ports.output import AudioPort


class AudioAnalysisService(AudioAnalysisPort):
    def __init__(self, audio_port: AudioPort):
        self.audio_port = audio_port

    def get_audio_duration(self, audio_path):
        return self.audio_port.get_audio_duration(audio_path)

    @classmethod
    def get_speech_rate(
        cls,
        transcription: str,
        audio_duration: float,
        silence_duration: float,
    ) -> float:
        """
        Calculate the speech rate (words per minute) for the given audio and
        transcription.

        Args:
            transcription (str): Transcribed text of the audio.
            silence_duration (float): Total duration of silence in seconds.

        Returns:
            float: Speech rate in words per minute.
        """
        if not transcription or not transcription.strip():
            return 0.0

        if audio_duration <= 0:
            return 0.0

        speech_duration = audio_duration - silence_duration
        if speech_duration <= 0:
            return 0.0

        word_count = len(transcription.split())
        words_per_minute = (word_count / speech_duration) * 60

        return round(words_per_minute, 2)
