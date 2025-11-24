from ..models.fillerwords import FillerWordsAnalysis
from ..models.silence import Silence, SilenceAnalysis
from ..models.transcription import Transcription
from ..ports.input import SentimentAnalysisPort as SentimentAnalysisInputPort
from ..ports.input import SpeechAnalysisPort
from ..ports.output import FillerWordsAnalysisPort
from ..ports.output import GrammarCheckerPort
from ..models.grammar import GrammarAnalysis


class SpeechAnalysisService(SpeechAnalysisPort):
    def __init__(
            self,
            fillerwords_analysis_port: FillerWordsAnalysisPort,
            sentiment_analysis_port: SentimentAnalysisInputPort,
            grammar_checker_port: GrammarCheckerPort,
    ):
        self.fillerwords_analysis_port = fillerwords_analysis_port
        self.sentiment_analysis_port = sentiment_analysis_port
        self.grammar_checker_port = grammar_checker_port

    @classmethod
    def detect_silences(
        cls, transcription: Transcription, threshold_ms=1000
    ) -> SilenceAnalysis:
        def is_silence(gap):
            return gap * 1000 >= threshold_ms

        silences = []
        words = [w for s in transcription.segments for w in s.words]

        if not words:
            return SilenceAnalysis(duration=0, silences=[], pauses=0)

        # Check for initial silence before the first word
        first_word_start = words[0].start
        if first_word_start > (threshold_ms / 1000.0):
            silences.append(
                Silence(
                    start=0.0,
                    end=first_word_start,
                    duration=first_word_start,
                )
            )

        # Detect silences between words
        for prev_word, next_word in zip(words, words[1:]):
            gap = next_word.start - prev_word.end
            if is_silence(gap):
                silences.append(
                    Silence(
                        start=round(prev_word.end, 2),
                        end=round(next_word.start, 2),
                        duration=round(gap, 2),
                    )
                )

        total_duration = sum(silence.duration for silence in silences)
        return SilenceAnalysis(
            duration=total_duration,
            silences=silences,
            pauses=len(silences),
        )

    def detect_fillerwords(self, transcription) -> FillerWordsAnalysis:
        return self.fillerwords_analysis_port.detect(transcription)

    def analyze_sentiment(self, transcription: Transcription):
        return self.sentiment_analysis_port.analyze_sentiment(transcription)
    
    def analyze_grammar(self, transcription: Transcription):
        if not transcription or not transcription.text:
            return GrammarAnalysis(issues=[])
        return self.grammar_checker_port.analyze(transcription.text)
