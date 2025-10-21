import re
from collections import Counter
from typing import List

from ..models.transcription import Transcription
from ..models.vocabulary import VocabularyAnalysis, VocabularySuggestion
from ..ports.input import VocabularyAnalysisPort
from ..ports.output import SynonymProviderPort

PORTUGUESE_STOPS = [
    'de',
    'a',
    'o',
    'que',
    'e',
    'do',
    'da',
    'em',
    'um',
    'para',
    'é',
    'com',
    'não',
    'uma',
    'os',
    'no',
    'se',
    'na',
    'por',
    'mais',
    'as',
    'dos',
    'como',
    'mas',
    'foi',
    'ao',
    'ele',
    'das',
    'tem',
    'à',
    'seu',
    'sua',
    'ou',
    'ser',
    'quando',
    'muito',
    'há',
    'nos',
    'já',
    'está',
    'eu',
    'também',
    'só',
    'pelo',
    'pela',
    'até',
    'isso',
    'ela',
    'entre',
    'era',
    'depois',
    'sem',
    'mesmo',
    'aos',
    'ter',
    'seus',
    'quem',
    'nas',
    'me',
    'esse',
    'eles',
    'estão',
    'você',
    'tinha',
    'foram',
    'essa',
    'num',
    'nem',
    'suas',
    'meu',
    'às',
    'minha',
    'têm',
    'numa',
    'pelos',
    'elas',
    'havia',
    'seja',
    'qual',
    'será',
    'nós',
    'tenho',
    'lhe',
    'deles',
    'essas',
    'esses',
    'pelas',
    'este',
    'fosse',
    'dele',
    'tu',
    'te',
    'vocês',
    'vos',
    'lhes',
    'meus',
    'minhas',
    'teu',
    'tua',
    'teus',
    'tuas',
    'nosso',
    'nossa',
    'nossos',
    'nossas',
    'dela',
    'tipo',
    'né',
    'tá',
    'aí',
    'então',
    'assim',
]

MIN_WORD_LENGTH = 2


class VocabularyAnalysisService(VocabularyAnalysisPort):
    def __init__(
        self,
        synonym_provider: SynonymProviderPort,
        stopwords: List[str] = PORTUGUESE_STOPS,
        top_n: int = 5,
    ):
        self._synonym_provider = synonym_provider
        self._stopwords = set(stopwords)
        self._top_n = top_n

    def analyze(self, transcription: Transcription) -> VocabularyAnalysis:
        if not transcription or not transcription.text:
            return VocabularyAnalysis(suggestions=[])

        words = self._tokenize_and_normalize(transcription.text)
        frequent_words = self._get_most_frequent_words(words)

        suggestions = []
        for word, count in frequent_words:
            alternatives = self._synonym_provider.get_synonyms(word)
            suggestions.append(
                VocabularySuggestion(
                    word=word,
                    count=count,
                    alternatives=alternatives[:5],
                )
            )

        return VocabularyAnalysis(suggestions=suggestions)

    def _tokenize_and_normalize(self, text: str) -> List[str]:
        text = text.lower()

        text = re.sub(r"[^\w\s']", '', text)
        words = text.split()
        return [
            word
            for word in words
            if word not in self._stopwords and len(word) > MIN_WORD_LENGTH
        ]

    def _get_most_frequent_words(
        self, words: List[str]
    ) -> List[tuple[str, int]]:
        word_counts = Counter(words)
        return word_counts.most_common(self._top_n)
