from dataclasses import dataclass


@dataclass
class VocabularySuggestion:
    word: str
    count: int
    alternatives: list[str]


@dataclass
class VocabularyAnalysis:
    suggestions: list[VocabularySuggestion]
