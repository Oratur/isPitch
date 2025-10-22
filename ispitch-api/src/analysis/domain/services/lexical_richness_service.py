import re

from ..models.lexical_richness import LexicalRichnessAnalysis
from ..models.transcription import Transcription
from ..ports.input import LexicalRichnessPort


class LexicalRichnessService(LexicalRichnessPort):
    @classmethod
    def analyze(self, transcription: Transcription) -> LexicalRichnessAnalysis:
        if not transcription or not transcription.text:
            return LexicalRichnessAnalysis(
                type_token_ratio=0.0, unique_words=0, total_words=0
            )

        normalized_text = re.sub(r'[^\w\s]', '', transcription.text.lower())
        tokens = normalized_text.split()

        if not tokens:
            return LexicalRichnessAnalysis(
                type_token_ratio=0.0, unique_words=0, total_words=0
            )

        total_words = len(tokens)
        unique_words = len(set(tokens))

        ttr = (unique_words / total_words) * 100 if total_words > 0 else 0

        return LexicalRichnessAnalysis(
            type_token_ratio=round(ttr, 2),
            unique_words=unique_words,
            total_words=total_words,
        )
