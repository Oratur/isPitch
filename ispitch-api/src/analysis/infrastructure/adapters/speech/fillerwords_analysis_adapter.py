from collections import Counter

from spacy.language import Language
from spacy.matcher import Matcher

from ....domain.models.fillerwords import (
    FillerWordPosition,
    FillerWordsAnalysis,
)
from ....domain.models.transcription import Transcription
from ....domain.ports.output import FillerWordsAnalysisPort


class FillerWordsAnalysisAdapter(FillerWordsAnalysisPort):
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

    def __init__(self, spacy: Language):
        self.spacy = spacy

    def detect(self, transcription: Transcription) -> FillerWordsAnalysis:
        """
        Detects filler words in the given transcription and returns analysis.
        """
        if not self.spacy:
            return self._empty_analysis()

        doc = self.spacy(transcription.text.lower())
        matcher = self._build_matcher()
        matches = matcher(doc)
        matches = self._get_non_overlapping_matches(matches, doc)

        distribution, occurrences = self._extract_filler_data(matches, doc)
        self._add_e_hesitations(transcription, distribution, occurrences)

        total_filler_words = sum(distribution.values())
        return FillerWordsAnalysis(
            total=total_filler_words,
            distribution=dict(distribution),
            occurrences=occurrences,
        )

    @classmethod
    def _empty_analysis(cls):
        """Returns an empty FillerWordsAnalysis."""
        return FillerWordsAnalysis(
            total=0,
            distribution={},
            occurrences=[],
        )

    def _build_matcher(self):
        """Builds and returns a spaCy Matcher with filler word patterns."""
        matcher = Matcher(self.spacy.vocab)
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
            'PURE_HESITATION',
            [[{'LOWER': {'IN': self.PURE_HESITATION}}]],
        )
        return matcher

    def _extract_filler_data(self, matches, doc):
        """
        Extracts filler word counts and positions from matches.
        """
        found_matches = set(
            doc[start:end].start_char for _, start, end in matches
        )
        filler_word_counts = Counter()
        filler_word_positions = []

        for _, start, end in matches:
            span = doc[start:end]
            if span.start_char in found_matches:
                filler_token = (
                    span[0] if span[0].text in self.FILLER_WORDS else span[1]
                )
                filler_word_counts[filler_token.text] += 1
                filler_word_positions.append(
                    FillerWordPosition(
                        start=span.start_char,
                        end=span.end_char,
                        word=filler_token.text,
                    )
                )
                found_matches.remove(span.start_char)
        return filler_word_counts, filler_word_positions

    @classmethod
    def _add_e_hesitations(
        cls, transcription, filler_word_counts, filler_word_positions
    ):
        """
        Adds occurrences of 'é...' hesitations to the counts and positions.
        """
        e_hesitations = transcription.text.lower().count('é...')
        if e_hesitations == 0:
            return

        filler_word_counts['é...'] = e_hesitations
        idx = 0
        while True:
            idx = transcription.text.lower().find('é...', idx)
            if idx == -1:
                break
            filler_word_positions.append(
                FillerWordPosition(
                    start=idx,
                    end=idx + 3,
                    word='é...',
                )
            )
            idx += 4

    @classmethod
    def _get_non_overlapping_matches(cls, matches, doc):
        """
        Returns non-overlapping matches sorted by start position and length.
        """
        sorted_matches = sorted(
            matches,
            key=lambda m: (
                doc[m[1] : m[2]].start_char,
                -(doc[m[1] : m[2]].end_char - doc[m[1] : m[2]].start_char),
            ),
        )
        result = []
        last_end = -1
        for match_id, start, end in sorted_matches:
            span = doc[start:end]
            if span.start_char >= last_end:
                result.append((match_id, start, end))
                last_end = span.end_char
        return result
