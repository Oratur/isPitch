from .....core.schemas.camel_case_model import CamelCaseModel


class TopicSchema(CamelCaseModel):
    topic: str
    summary: str


class TopicAnalysisSchema(CamelCaseModel):
    topics: list[TopicSchema]
