from typing import List

from .....core.schemas.camel_case_model import CamelCaseModel


class GrammarIssueSegmentSchema(CamelCaseModel):
    offset: int
    length: int
    message: str
    short_message: str
    text: str
    suggestions: List[str]
    rule_id: str


class GrammarAnalysisSchema(CamelCaseModel):
    timeline: List[GrammarIssueSegmentSchema]
