from abc import ABC, abstractmethod

from ..models.user import User


class PasswordManagerPort(ABC):
    @abstractmethod
    def hash(self, password: str) -> str:
        pass

    @abstractmethod
    def verify(self, plain_password: str, hashed_password: str) -> bool:
        pass


class TokenManagerPort(ABC):
    @abstractmethod
    def create_access_token(self, user_id: str) -> str:
        pass

    @abstractmethod
    def verify_access_token(self, token: str) -> str:
        pass


class UserRepositoryPort(ABC):
    @abstractmethod
    def save(self, user: User) -> User:
        pass

    @abstractmethod
    def find_by_email(self, email: str) -> User | None:
        pass
