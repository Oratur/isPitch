from dataclasses import dataclass


@dataclass
class Topic:
    topic: str
    summary: str


@dataclass
class TopicAnalysis:
    topics: list[Topic]
