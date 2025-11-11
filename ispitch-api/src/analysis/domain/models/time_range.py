from enum import Enum


class TimeRange(str, Enum):
    DAY = 'day'
    MONTH = 'month'
    YEAR = 'year'
    ALL = 'all'
