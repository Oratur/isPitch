from ..models.analysis import Analysis
from ..ports.input import ScoreCalculationPort


class ScoreCalculationService(ScoreCalculationPort):
    BASE_SCORE = 100
    MIN_SCORE = 0
    MAX_SCORE = 100

    # Penalties
    FILLER_WORD_PENALTY = 3
    LONG_PAUSE_PENALTY = 5

    # Speech Rate Thresholds (PPM)
    MIN_IDEAL_RATE = 100
    MAX_IDEAL_RATE = 160
    IDEAL_CENTER_RATE = 150
    RATE_PENALTY_FACTOR = 0.5

    # Bonus
    LEXICAL_RICHNESS_THRESHOLD = 50.0
    LEXICAL_BONUS = 5

    def execute(self, analysis: Analysis) -> int:
        if not analysis.speech_analysis or not analysis.audio_analysis:
            return 0

        score = float(self.BASE_SCORE)

        total_fillers = analysis.speech_analysis.fillerwords_analysis.total
        score -= total_fillers * self.FILLER_WORD_PENALTY

        total_pauses = analysis.speech_analysis.silence_analysis.pauses
        score -= total_pauses * self.LONG_PAUSE_PENALTY

        speech_rate = analysis.audio_analysis.speech_rate
        if (
            speech_rate < self.MIN_IDEAL_RATE
            or speech_rate > self.MAX_IDEAL_RATE
        ):
            distance = abs(self.IDEAL_CENTER_RATE - speech_rate)
            score -= distance * self.RATE_PENALTY_FACTOR

        lexical = analysis.speech_analysis.lexical_richness_analysis
        if (
            lexical
            and lexical.type_token_ratio > self.LEXICAL_RICHNESS_THRESHOLD
        ):
            score += self.LEXICAL_BONUS

        final_score = round(score)
        return max(self.MIN_SCORE, min(self.MAX_SCORE, final_score))
