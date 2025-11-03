from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ....auth.infrastructure.adapters.token_manager_adapter import (
    TokenManagerAdapter,
)
from ....core.exceptions import InvalidCredentialsException

bearer_scheme = HTTPBearer(description='Bearer token authentication')


async def authentication(
    auth_credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    token_manager: TokenManagerAdapter = Depends(),
) -> str:
    token = auth_credentials.credentials
    user_id = token_manager.verify_access_token(token)
    if user_id is None:
        raise InvalidCredentialsException(
            details=['Could not validate credentials']
        )

    return user_id
