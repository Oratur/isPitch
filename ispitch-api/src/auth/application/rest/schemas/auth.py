from .....core.schemas.camel_case_model import CamelCaseModel


class UserRegisterSchema(CamelCaseModel):
    name: str
    email: str
    password: str


class UserLoginSchema(CamelCaseModel):
    email: str
    password: str
