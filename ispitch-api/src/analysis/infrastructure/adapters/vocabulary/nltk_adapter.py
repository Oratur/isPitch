from nltk.corpus import wordnet

from ....domain.ports.output import SynonymProviderPort


class NltkSynonymProviderAdapter(SynonymProviderPort):
    def __init__(self, language: str = 'por'):
        self.language = language

    def get_synonyms(self, word: str) -> list[str]:
        synonyms = set()

        for syn in wordnet.synsets(word, lang=self.language):
            for lemma in syn.lemmas(lang=self.language):
                synonym = lemma.name().replace('_', ' ')
                if synonym.lower() != word.lower():
                    synonyms.add(synonym)

        return list(synonyms)
