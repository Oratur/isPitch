from abc import ABC, abstractmethod

from ..models.login_response import LoginResponse
from ..models.user import User


class AuthPort(ABC):
    @abstractmethod
    def register(self, email: str, name: str, password: str) -> User:
        pass

    @abstractmethod
    def login(self, email: str, password: str) -> LoginResponse:
        pass
