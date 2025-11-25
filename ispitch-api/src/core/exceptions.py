from typing import Optional

from fastapi import status


class DomainException(Exception):
    def __init__(
        self, status_code: int, message: str, details: Optional[list[str]]
    ):
        self.status_code = status_code
        self.message = message
        self.details = details
        super().__init__(self.message)


class NotFoundException(DomainException):
    def __init__(self, resource: str):
        message = f'{resource} não encontrado(a).'
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND, message=message, details=[]
        )


class ValidationException(DomainException):
    def __init__(self, message: str, details: list[str]):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            details=details,
        )


class AuthException(DomainException):
    def __init__(
        self,
        message: str,
        details: Optional[list[str]] = None,
        headers: Optional[dict] = None,
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            details=details,
            headers={'WWW-Authenticate': 'Bearer'},
        )


class InvalidCredentialsException(AuthException):
    def __init__(
        self,
        message: str = 'Invalid credentials',
        details: Optional[list[str]] = None,
    ):
        super().__init__(message=message, details=details)
