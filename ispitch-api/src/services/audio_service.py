import librosa


class AudioService:
    @staticmethod
    def get_audio_duration(file_path: str) -> float:
        """
        Get the duration of an audio file in seconds.

        :param file_path: Path to the audio file.
        :return: Duration of the audio file in seconds.
        """
        try:
            return librosa.get_duration(path=file_path)
        except Exception as e:
            raise RuntimeError(f'Error getting audio duration: {e}')
