from passlib.context import CryptContext
from ...domain.ports.output import PasswordManagerPort

class PasswordManagerAdapter(PasswordManagerPort):
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

    async def hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    async def verify(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)