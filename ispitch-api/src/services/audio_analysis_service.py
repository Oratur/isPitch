from src.services.analyzers.rate_analyzer import RateAnalyzer
from src.services.audio_service import AudioService


class AudioAnalysisService:
    def __init__(self):
        self.audio_service = AudioService()

    def get_speech_rate(
        self,
        audio_path: str,
        transcription: str,
        silence_duration: float,
    ) -> float:
        if not transcription or not transcription.strip():
            return 0.0

        duration = self.audio_service.get_audio_duration(audio_path)
        return RateAnalyzer.calculate_speech_rate(
            transcription, duration, silence_duration
        )
