from typing import Optional

from .camel_case_model import CamelCaseModel


class ErrorResponse(CamelCaseModel):
    message: str
    status_code: int
    error: str
    details: Optional[list[str]] = None
