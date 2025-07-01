class RateAnalyzer:
    @staticmethod
    def calculate_speech_rate(
        transcript: str,
        audio_duration_seconds: float,
        silence_duration_seconds: float,
    ) -> float:
        """
        Calculates the speech rate in words per minute (WPM).
        """
        if not transcript:
            return 0.0

        if audio_duration_seconds <= 0:
            return 0.0

        speech_duration_seconds = (
            audio_duration_seconds - silence_duration_seconds
        )

        if speech_duration_seconds <= 0:
            return 0.0

        word_count = len(transcript.split())

        rate = (word_count / speech_duration_seconds) * 60
        return round(rate, 2)
