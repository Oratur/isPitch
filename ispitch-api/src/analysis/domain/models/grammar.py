from dataclasses import dataclass
from typing import List


@dataclass
class GrammarIssue:
    offset: int
    length: int
    message: str
    short_message: str
    text: str
    suggestions: List[str]
    rule_id: str


@dataclass
class GrammarAnalysis:
    issues: List[GrammarIssue]