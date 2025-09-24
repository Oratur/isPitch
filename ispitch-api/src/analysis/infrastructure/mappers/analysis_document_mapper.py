from ...domain.models.analysis import (
    Analysis,
    AudioAnalysis,
    SpeechAnalysis,
)
from ...domain.models.fillerwords import FillerWordPosition, FillerWordsAnalysis
from ...domain.models.silence import Silence, SilenceAnalysis
from ...domain.models.transcription import Segment, Transcription, Word
from ..persistance.documents import analysis_document
from ..persistance.documents.analysis_document import AnalysisDocument


def map_list(items, mapper):
    return [mapper(item) for item in items] if items else []


class AnalysisDocumentMapper:
    @staticmethod
    def from_document(document: AnalysisDocument) -> Analysis:
        if document is None:
            return None
        return Analysis(
            id=str(document.id),
            status=document.status,
            filename=document.filename,
            transcription=TranscriptionDocumentMapper.from_document(
                document.transcription
            )
            if document.transcription
            else None,
            speech_analysis=SpeechAnalysisDocumentMapper.from_document(
                document.speech_analysis
            )
            if document.speech_analysis
            else None,
            audio_analysis=AudioAnalysisDocumentMapper.from_document(
                document.audio_analysis
            )
            if document.audio_analysis
            else None,
        )

    @staticmethod
    def from_entity(entity: Analysis) -> AnalysisDocument:
        if entity is None:
            return None
        return AnalysisDocument(
            id=entity.id,
            status=entity.status,
            filename=entity.filename,
            transcription=TranscriptionDocumentMapper.from_entity(
                entity.transcription
            )
            if entity.transcription
            else None,
            speech_analysis=SpeechAnalysisDocumentMapper.from_entity(
                entity.speech_analysis
            )
            if entity.speech_analysis
            else None,
            audio_analysis=AudioAnalysisDocumentMapper.from_entity(
                entity.audio_analysis
            )
            if entity.audio_analysis
            else None,
        )


class TranscriptionDocumentMapper:
    @staticmethod
    def from_entity(entity: Transcription) -> analysis_document.Transcription:
        if entity is None:
            return None
        return analysis_document.Transcription(
            text=getattr(entity, 'text', ''),
            segments=map_list(
                getattr(entity, 'segments', []),
                TranscriptionDocumentMapper._map_segment,
            ),
        )

    @staticmethod
    def _map_segment(segment):
        return analysis_document.Segment(
            id=getattr(segment, 'id', 0),
            start=getattr(segment, 'start', 0.0),
            text=getattr(segment, 'text', ''),
            words=map_list(
                getattr(segment, 'words', []),
                TranscriptionDocumentMapper._map_word,
            ),
        )

    @staticmethod
    def _map_word(word):
        return analysis_document.Word(
            word=getattr(word, 'word', ''),
            start=getattr(word, 'start', 0.0),
            end=getattr(word, 'end', 0.0),
        )

    @staticmethod
    def from_document(document: analysis_document.Transcription):
        if document is None:
            return None
        return Transcription(
            text=getattr(document, 'text', ''),
            segments=map_list(
                getattr(document, 'segments', []),
                TranscriptionDocumentMapper._map_segment_from_document,
            ),
        )

    @staticmethod
    def _map_segment_from_document(segment):
        return Segment(
            id=getattr(segment, 'id', 0),
            start=getattr(segment, 'start', 0.0),
            text=getattr(segment, 'text', ''),
            words=map_list(
                getattr(segment, 'words', []),
                TranscriptionDocumentMapper._map_word_from_document,
            ),
        )

    @staticmethod
    def _map_word_from_document(word):
        return Word(
            word=getattr(word, 'word', ''),
            start=getattr(word, 'start', 0.0),
            end=getattr(word, 'end', 0.0),
        )


class SpeechAnalysisDocumentMapper:
    @staticmethod
    def from_entity(entity):
        if entity is None:
            return None
        return analysis_document.SpeechAnalysis(
            silence_analysis=SpeechAnalysisDocumentMapper._map_silence_analysis(
                getattr(entity, 'silence_analysis', None)
            ),
            fillerwords_analysis=SpeechAnalysisDocumentMapper._map_fillerwords_analysis(
                getattr(entity, 'fillerwords_analysis', None)
            ),
        )

    @staticmethod
    def _map_silence_analysis(sa):
        if sa is None:
            return None
        return analysis_document.SilenceAnalysis(
            duration=getattr(sa, 'duration', 0.0),
            silences=map_list(
                getattr(sa, 'silences', []),
                SpeechAnalysisDocumentMapper._map_silence,
            ),
            pauses=getattr(sa, 'pauses', 0),
        )

    @staticmethod
    def _map_silence(silence):
        return analysis_document.Silence(
            start=getattr(silence, 'start', 0.0),
            end=getattr(silence, 'end', 0.0),
            duration=getattr(silence, 'duration', 0.0),
        )

    @staticmethod
    def _map_fillerwords_analysis(fa):
        if fa is None:
            return None
        return analysis_document.FillerWordsAnalysis(
            total=getattr(fa, 'total', 0),
            distribution=getattr(fa, 'distribution', {}),
            occurrences=map_list(
                getattr(fa, 'occurrences', []),
                SpeechAnalysisDocumentMapper._map_fillerword_position,
            ),
        )

    @staticmethod
    def _map_fillerword_position(fwp):
        return analysis_document.FillerWordPosition(
            start=getattr(fwp, 'start', 0),
            end=getattr(fwp, 'end', 0),
            word=getattr(fwp, 'word', ''),
        )

    @staticmethod
    def from_document(document):
        if document is None:
            return None
        return SpeechAnalysis(
            silence_analysis=SpeechAnalysisDocumentMapper._map_silence_analysis_from_document(
                getattr(document, 'silence_analysis', None)
            ),
            fillerwords_analysis=SpeechAnalysisDocumentMapper._map_fillerwords_analysis_from_document(
                getattr(document, 'fillerwords_analysis', None)
            ),
        )

    @staticmethod
    def _map_silence_analysis_from_document(sa):
        if sa is None:
            return None
        return SilenceAnalysis(
            duration=getattr(sa, 'duration', 0.0),
            silences=map_list(
                getattr(sa, 'silences', []),
                SpeechAnalysisDocumentMapper._map_silence_from_document,
            ),
            pauses=getattr(sa, 'pauses', 0),
        )

    @staticmethod
    def _map_silence_from_document(silence):
        return Silence(
            start=getattr(silence, 'start', 0.0),
            end=getattr(silence, 'end', 0.0),
            duration=getattr(silence, 'duration', 0.0),
        )

    @staticmethod
    def _map_fillerwords_analysis_from_document(fa):
        if fa is None:
            return None
        return FillerWordsAnalysis(
            total=getattr(fa, 'total', 0),
            distribution=getattr(fa, 'distribution', {}),
            occurrences=map_list(
                getattr(fa, 'occurrences', []),
                SpeechAnalysisDocumentMapper._map_fillerword_position_from_document,
            ),
        )

    @staticmethod
    def _map_fillerword_position_from_document(fwp):
        return FillerWordPosition(
            start=getattr(fwp, 'start', 0),
            end=getattr(fwp, 'end', 0),
            word=getattr(fwp, 'word', ''),
        )


class AudioAnalysisDocumentMapper:
    @staticmethod
    def from_entity(entity):
        if entity is None:
            return None
        return analysis_document.AudioAnalysis(
            speech_rate=getattr(entity, 'speech_rate', 0.0)
        )

    @staticmethod
    def from_document(document: analysis_document.AudioAnalysis):
        if document is None:
            return None
        return AudioAnalysis(speech_rate=getattr(document, 'speech_rate', 0.0))
