# ispitch-api/src/services/speech_analysis_service.py

from typing import Any, Dict, List


class SpeechAnalysisService:
    """
    Service responsible for analyzing speech data from a transcription result.
    """

    @staticmethod
    def detect_silences(
        result: Dict[str, Any], threshold_ms: int = 1000
    ) -> List[Dict[str, float]]:
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

        return silences
