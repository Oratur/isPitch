from dataclasses import dataclass

from .user import User


@dataclass
class LoginResponse:
    token: str
    user: User
