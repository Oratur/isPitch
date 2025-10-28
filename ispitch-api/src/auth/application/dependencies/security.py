from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from ....auth.infrastructure.adapters.token_manager_adapter import (
    TokenManagerAdapter,
)

bearer_scheme = HTTPBearer(description='Bearer token authentication')


async def authentication(
    auth_credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    token_manager: TokenManagerAdapter = Depends(),
) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    try:
        token = auth_credentials.credentials
        user_id = token_manager.verify_access_token(token)
        if user_id is None:
            raise credentials_exception
    except (JWTError, AttributeError):
        raise credentials_exception
    return user_id
