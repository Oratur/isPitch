from dataclasses import dataclass


@dataclass
class LexicalRichnessAnalysis:
    type_token_ratio: float
    unique_words: int
    total_words: int
