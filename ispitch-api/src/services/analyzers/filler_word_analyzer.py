from collections import Counter
from typing import Any, Dict

from spacy.matcher import Matcher

from src.core.model_registry import get_spacy_model


class FillerWordAnalyzer:
    FILLER_WORDS = [
        'hã',
        'ãh',
        'hum',
        'né',
        'tipo',
        'então',
        'aí',
        'assim',
        'bom',
        'certo',
        'ok',
        'tá',
    ]
    END_FILLERS = ['né', 'tá', 'ok']
    PURE_HESITATION = ['hã', 'ãh', 'hum']

    def __init__(self):
        self.nlp = get_spacy_model()

    def analyze(self, transcription: str) -> Dict[str, Any]:
        if not self.nlp:
            return {'total_filler_words': 0, 'filler_words_count': {}}

        doc = self.nlp(transcription.lower())

        matcher = Matcher(self.nlp.vocab)

        matcher.add(
            'FILLER_ISOLATED',
            [
                [
                    {'ORTH': ','},
                    {'LOWER': {'IN': self.FILLER_WORDS}},
                    {'ORTH': ','},
                ]
            ],
        )

        matcher.add(
            'FILLER_FOLLOWED_BY_COMMA',
            [[{'LOWER': {'IN': self.FILLER_WORDS}}, {'ORTH': ','}]],
        )

        matcher.add(
            'FILLER_AT_END',
            [
                [
                    {'LOWER': {'IN': self.END_FILLERS}},
                    {'IS_PUNCT': True, 'OP': '+'},
                ]
            ],
        )

        matcher.add(
            'PURE_HESITATION', [[{'LOWER': {'IN': self.PURE_HESITATION}}]]
        )

        e_hesitations = transcription.lower().count('é...')

        matches = matcher(doc)

        found_matches = set()

        for _, start, end in matches:
            found_matches.add(doc[start:end].start_char)

        filler_word_counts = Counter()

        for _, start, end in matches:
            span = doc[start:end]

            if span.start_char in found_matches:
                filler_token = (
                    span[0] if span[0].text in self.FILLER_WORDS else span[1]
                )
                filler_word_counts[filler_token.text] += 1
                found_matches.remove(span.start_char)

        if e_hesitations > 0:
            filler_word_counts['é...'] = e_hesitations

        total_filler_words = sum(filler_word_counts.values())

        return {
            'total_filler_words': total_filler_words,
            'filler_words_count': dict(filler_word_counts),
        }
