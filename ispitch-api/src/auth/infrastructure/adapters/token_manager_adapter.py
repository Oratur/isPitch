from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from ...domain.ports.output import TokenManagerPort
from ....core.config import settings

class TokenManagerAdapter(TokenManagerPort):
    def create_access_token(self, data: dict) -> str:
        to_encode = data.copy()

        token_expire_minutes = settings.jwt_access_token_expire_minutes
        expire = datetime.now(timezone.utc) + timedelta(minutes=token_expire_minutes)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
        
        return encoded_jwt
    
    def verify_access_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            user_id: str = payload.get("sub")

            if user_id is None:
                raise JWTError("Token inválido")
            
            return user_id
        except JWTError as e:
            raise JWTError("Token inválido") from e