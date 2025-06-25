from collections import Counter
from typing import Any, Dict

import spacy
from spacy.matcher import Matcher

from src.api.schemas.analysis import SilenceAnalysis


class SpeechAnalysisService:
    """
    Service responsible for analyzing speech data from a transcription result.
    """

    FILLER_WORDS = [
        'né',
        'tipo',
        'então',
        'aí',
        'quer dizer',
        'assim',
        'bom',
        'certo',
        'ok',
        'tá',
        'é',
        'tipo assim',
        'daí',
        'hã',
        'ãh',
        'hum',
    ]

    def __init__(self):
        try:
            self.nlp = spacy.load('pt_core_news_sm')
        except OSError:
            self.nlp = None

    @staticmethod
    def detect_silences(
        result: Dict[str, Any], threshold_ms: int = 1000
    ) -> SilenceAnalysis:
        """
        Detects silences in the audio based on word timestamps.
        """
        silences = []
        words = []
        for segment in result.get('segments', []):
            # A 'words' key may not exist if no speech was detected
            words.extend(segment.get('words', []))

        if not words:
            return []

        # Check for initial silence
        if words[0]['start'] > (threshold_ms / 1000.0):
            silences.append({
                'start': 0.0,
                'end': words[0]['start'],
                'duration': words[0]['start'],
            })

        # Find gaps between words
        for i in range(len(words) - 1):
            end_of_word = words[i]['end']
            start_of_next_word = words[i + 1]['start']
            gap = start_of_next_word - end_of_word

            if gap * 1000 >= threshold_ms:
                silences.append({
                    'start': round(end_of_word, 2),
                    'end': round(start_of_next_word, 2),
                    'duration': round(gap, 2),
                })

        return {
            'total_duration': sum(silence['duration'] for silence in silences),
            'silences': silences,
            'number_of_pauses': len(silences),
        }

    def detect_filler_words(self, transcription: str):
        """
        Detects filler words in the transcription.
        Args:
            transcription (str): The transcription text to analyze.
        Returns:
            List[str]: A list of detected filler words.
        """
        doc = self.nlp(transcription)

        matcher = Matcher(self.nlp.vocab)

        for filler in self.FILLER_WORDS:
            pattern_words = filler.split()
            pattern = [{'LOWER': word} for word in pattern_words]
            matcher.add(filler, [pattern])

        matches = matcher(doc)

        filler_word_counts = Counter()
        for match_id, start, end in matches:
            filler_text = self.nlp.vocab.strings[match_id]
            filler_word_counts[filler_text] += 1

        total_filler_words = sum(filler_word_counts.values())

        return {
            'total_filler_words': total_filler_words,
            'filler_words_count': dict(filler_word_counts),
        }
