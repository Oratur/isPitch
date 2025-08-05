from ...domain.models.analysis import Analysis, AudioAnalysis, SpeechAnalysis
from ...domain.models.fillerwords import (
    FillerWordPosition,
    FillerWordsAnalysis,
)
from ...domain.models.silence import Silence, SilenceAnalysis
from ...domain.models.transcription import Segment, Transcription, Word


class AnalysisModelMapper:
    @staticmethod
    def from_dict(data: dict) -> Analysis:
        # Transcription
        transcription_data = data.get('transcription')
        if isinstance(transcription_data, dict):
            segments = []
            for seg in transcription_data.get('segments', []):
                words = [Word(**w) for w in seg.get('words', [])]
                segments.append(
                    Segment(
                        id=seg.get('id'),
                        start=seg.get('start'),
                        text=seg.get('text'),
                        words=words,
                    )
                )
            transcription = Transcription(
                text=transcription_data.get('text'), segments=segments
            )
        else:
            transcription = transcription_data

        # SilenceAnalysis
        speech_analysis_data = data.get('speech_analysis', {})
        silence_analysis_data = speech_analysis_data.get(
            'silence_analysis', {}
        )
        silences = [
            Silence(**s) for s in silence_analysis_data.get('silences', [])
        ]
        silence_analysis = SilenceAnalysis(
            duration=silence_analysis_data.get('duration', 0.0),
            silences=silences,
            pauses=silence_analysis_data.get('pauses', 0),
        )

        # FillerWordsAnalysis
        fillerwords_analysis_data = speech_analysis_data.get(
            'fillerwords_analysis', {}
        )
        occurrences = [
            FillerWordPosition(**o)
            for o in fillerwords_analysis_data.get('occurrences', [])
        ]
        fillerwords_analysis = FillerWordsAnalysis(
            total=fillerwords_analysis_data.get('total', 0),
            distribution=fillerwords_analysis_data.get('distribution', {}),
            occurrences=occurrences,
        )

        speech_analysis = SpeechAnalysis(
            silence_analysis=silence_analysis,
            fillerwords_analysis=fillerwords_analysis,
        )

        # AudioAnalysis
        audio_analysis_data = data.get('audio_analysis', {})
        audio_analysis = AudioAnalysis(
            speech_rate=audio_analysis_data.get('speech_rate', 0.0)
        )

        return Analysis(
            id=data.get('id'),
            status=data.get('status'),
            filename=data.get('filename'),
            transcription=transcription,
            speech_analysis=speech_analysis,
            audio_analysis=audio_analysis,
        )
