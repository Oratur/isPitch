from ..models.topic import TopicAnalysis
from ..models.transcription import Transcription
from ..ports.input import TopicAnalysisPort
from ..ports.output import TopicModelPort


class TopicAnalysisService(TopicAnalysisPort):
    def __init__(self, topic_model_port: TopicModelPort):
        self.topic_model_port = topic_model_port

    def analyze(self, transcription: Transcription) -> TopicAnalysis:
        if not transcription or not transcription.text:
            return TopicAnalysis(topics=[])

        return self.topic_model_port.extract_topics(transcription.text)
