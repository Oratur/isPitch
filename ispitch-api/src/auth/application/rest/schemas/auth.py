from pydantic import EmailStr

from .....core.schemas.camel_case_model import CamelCaseModel


class UserRegisterSchema(CamelCaseModel):
    name: str
    email: EmailStr
    password: str


class UserLoginSchema(CamelCaseModel):
    email: EmailStr
    password: str


class UserSchema(CamelCaseModel):
    id: str
    name: str
    email: EmailStr


class UserLoginResponseSchema(CamelCaseModel):
    token: str
    user: UserSchema
