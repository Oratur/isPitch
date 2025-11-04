from fastapi import APIRouter, Depends, status

from ....domain.ports.input import AuthPort
from ...dependencies.services import get_auth_service
from ..schemas.auth import (
    UserLoginResponseSchema,
    UserLoginSchema,
    UserRegisterSchema,
    UserSchema,
)

router_v2 = APIRouter(prefix='/v2/auth', tags=['Authentication'])


@router_v2.post(
    '/register',
    response_model=str,
    status_code=status.HTTP_201_CREATED,
    summary='User Registration',
    description='Register a new user.',
)
async def register(
    user: UserRegisterSchema,
    auth_service: AuthPort = Depends(get_auth_service),
):
    response_user = await auth_service.register(
        user.email, user.name, user.password
    )
    return str(response_user.id)


@router_v2.post(
    '/login',
    response_model=UserLoginResponseSchema,
    summary='User login',
    description='Loga um usuário e retorna um token JWT.',
)
async def login(
    user: UserLoginSchema,
    auth_service: AuthPort = Depends(get_auth_service),
):
    login_response = await auth_service.login(user.email, user.password)
    return UserLoginResponseSchema(
        token=login_response.token,
        user=UserSchema(
            id=login_response.user.id,
            email=login_response.user.email,
            name=login_response.user.name,
        ),
    )
