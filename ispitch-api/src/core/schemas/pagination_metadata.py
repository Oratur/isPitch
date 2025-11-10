from .camel_case_model import CamelCaseModel


class PaginationMetadata(CamelCaseModel):
    total: int
    page: int
    page_size: int
    has_more: bool
