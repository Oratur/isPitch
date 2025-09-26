import logging
from http import HTTPStatus

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .exceptions import DomainException
from .schemas.error import ErrorResponse

logger = logging.getLogger(__name__)


async def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            statusCode=exc.status_code,
            message=exc.message,
            error=HTTPStatus(exc.status_code).phrase,
            details=exc.details,
        ).model_dump(by_alias=True),
    )


async def request_validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    status_code = HTTPStatus.UNPROCESSABLE_ENTITY

    details = []
    for error in exc.errors():
        field = '.'.join(map(str, error.get('loc', [])))
        message = error.get('msg', '')
        details.append(f"Campo '{field}': {message}")

    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            statusCode=status_code,
            message='Erro de validação. Verifique os dados enviados.',
            error=HTTPStatus(status_code).phrase,
            details=details,
        ).model_dump(by_alias=True),
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            statusCode=exc.status_code,
            message=str(exc.detail),
            error=HTTPStatus(exc.status_code).phrase,
        ).model_dump(by_alias=True),
    )


async def generic_exception_handler(request: Request, exc: Exception):
    status_code = HTTPStatus.INTERNAL_SERVER_ERROR

    logger.error(
        f'Erro não tratado na rota {request.url.path}: {exc}', exc_info=True
    )

    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            statusCode=status_code,
            message='Ocorreu um erro interno inesperado no servidor.',
            error=HTTPStatus(status_code).phrase,
        ).model_dump(by_alias=True),
    )


def add_exception_handlers(app: FastAPI):
    app.add_exception_handler(DomainException, domain_exception_handler)
    app.add_exception_handler(
        RequestValidationError, request_validation_exception_handler
    )
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
