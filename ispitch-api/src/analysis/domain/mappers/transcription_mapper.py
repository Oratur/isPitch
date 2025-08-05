from ..models.transcription import Segment, Transcription, Word


class TranscriptionMapper:
    @staticmethod
    def from_whisper_result(result: dict) -> Transcription:
        segments = []
        for seg in result.get('segments', []):
            words = [
                Word(
                    word=word.get('word', ''),
                    start=word.get('start', 0.0),
                    end=word.get('end', 0.0),
                )
                for word in seg.get('words', [])
            ]
            segment = Segment(
                id=seg.get('id', 0),
                start=seg.get('start', 0.0),
                text=seg.get('text', ''),
                words=words,
            )
            segments.append(segment)

        return Transcription(text=result.get('text', ''), segments=segments)
