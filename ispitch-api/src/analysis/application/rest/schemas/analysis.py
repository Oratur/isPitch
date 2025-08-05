from .....core.schemas.camel_case_model import CamelCaseModel
from ..schemas.fillerwords import FillerWordsAnalysisSchema
from ..schemas.silence import SilenceAnalysisSchema


class SpeechAnalysisSchema(CamelCaseModel):
    silence_analysis: SilenceAnalysisSchema
    fillerwords_analysis: FillerWordsAnalysisSchema


class AudioAnalysisSchema(CamelCaseModel):
    speech_rate: float


class AnalysisSchema(CamelCaseModel):
    id: str
    status: str
    filename: str
    transcription: str
    speech_analysis: SpeechAnalysisSchema
    audio_analysis: AudioAnalysisSchema
