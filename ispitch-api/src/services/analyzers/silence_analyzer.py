from typing import Any, Dict

from src.api.schemas.analysis import SilenceAnalysis


class SilenceAnalyzer:
    @staticmethod
    def analyze(
        result: Dict[str, Any], threshold_ms: int = 1000
    ) -> SilenceAnalysis:
        silences = []
        words = [
            w for s in result.get('segments', []) for w in s.get('words', [])
        ]

        if not words:
            return {
                'total_duration': 0,
                'silences': [],
                'number_of_pauses': 0,
            }

        if words[0]['start'] > (threshold_ms / 1000.0):
            silences.append({
                'start': 0.0,
                'end': words[0]['start'],
                'duration': words[0]['start'],
            })

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
            'total_duration': sum(s['duration'] for s in silences),
            'silences': silences,
            'number_of_pauses': len(silences),
        }
