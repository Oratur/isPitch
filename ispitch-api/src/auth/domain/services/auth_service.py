from fastapi import status
from ....core.exceptions import DomainException
from ..models.user import User
from ..ports.input import AuthPort
from ..ports.output import (
    PasswordManagerPort,
    TokenManagerPort,
    UserRepositoryPort,
)


class AuthService(AuthPort):
    def __init__(
        self,
        user_repository: UserRepositoryPort,
        password_manager: PasswordManagerPort,
        token_manager: TokenManagerPort,
    ):
        self.user_repository = user_repository
        self.password_manager = password_manager
        self.token_manager = token_manager

    async def register(self, email: str, name: str, password: str) -> User:
        existing_user = await self.user_repository.find_by_email(email)
        if existing_user:
            # TODO: Verificar tratamento de status code posteriormente
            raise DomainException(
                status.HTTP_409_CONFLICT, 'Email is already in use'
            )

        hashed_password = await self.password_manager.hash(password)
        user = User(
            id=None, email=email, name=name, hashed_password=hashed_password
        )

        return await self.user_repository.save(user)

    async def login(self, email: str, password: str) -> User:
        user = await self.user_repository.find_by_email(email)

        if not user or not await self.password_manager.verify(
            password, user.hashed_password
        ):
            # TODO: Verificar tratamento de status code posteriormente
            raise DomainException(
                status.HTTP_401_UNAUTHORIZED, 'Invalid username or password'
            )

        token = self.token_manager.create_access_token(
            data={'sub': str(user.id), 'name': user.name}
        )

        return token
