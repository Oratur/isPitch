from src.services.analyzers.filler_word_analyzer import FillerWordAnalyzer
from src.services.analyzers.silence_analyzer import SilenceAnalyzer


class SpeechAnalysisService:
    def __init__(self, nlp=None):
        self.filler_analyzer = FillerWordAnalyzer(nlp)

    @staticmethod
    def detect_silences(result, threshold_ms=1000):
        return SilenceAnalyzer.analyze(result, threshold_ms)

    def detect_filler_words(self, transcription):
        return self.filler_analyzer.analyze(transcription)
