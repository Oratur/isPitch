from pydantic import BaseModel, EmailStr


# Utilizado BaseModel ao invés de CamelCaseModel para evitar warnings
# por conta da redundância de configuração com o tipo EmailStr.
# Se um campo com nome composto for adicionado, utilizar alias no campo.
class UserRegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class UserSchema(BaseModel):
    id: str
    name: str
    email: EmailStr


class UserLoginResponseSchema(BaseModel):
    token: str
    user: UserSchema
