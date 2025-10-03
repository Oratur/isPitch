from enum import Enum


class SseEvent(str, Enum):
    STATUS_UPDATE = 'status_update'
    ANALYSIS_RESULT = 'analysis_result'
