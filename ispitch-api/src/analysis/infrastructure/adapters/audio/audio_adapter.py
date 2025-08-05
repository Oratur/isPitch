import librosa

from ....domain.ports.output import AudioPort


class AudioAdapter(AudioPort):
    @classmethod
    def get_audio_duration(cls, audio_path: str) -> float:
        """
        Get the duration of an audio file in seconds.

        :param audio_path: Path to the audio file.
        :return: Duration of the audio file in seconds.
        """
        try:
            return librosa.get_duration(path=audio_path)
        except Exception as e:
            raise RuntimeError(f'Error getting audio duration: {e}')
