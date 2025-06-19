from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.services.analysis_service import (
    FileTooLargeError,
    InvalidFileError,
    UnsupportedFileTypeError,
)


async def handle_file_too_large(request: Request, exc: FileTooLargeError):
    """Handler for the FileTooLargeError exception."""
    return JSONResponse(
        status_code=413,
        content={'detail': str(exc)},
    )


async def handle_unsupported_file_type(
    request: Request, exc: UnsupportedFileTypeError
):
    """Handler for the UnsupportedFileTypeError exception."""
    return JSONResponse(
        status_code=415,
        content={'detail': str(exc)},
    )


async def handle_invalid_file(request: Request, exc: InvalidFileError):
    """Generic handler for other invalid file errors."""
    return JSONResponse(
        status_code=400,
        content={'detail': str(exc)},
    )


def register_exception_handlers(app: FastAPI):
    """
    Registers all custom exception handlers on the FastAPI application
    instance.
    """
    app.add_exception_handler(FileTooLargeError, handle_file_too_large)
    app.add_exception_handler(
        UnsupportedFileTypeError, handle_unsupported_file_type
    )
    app.add_exception_handler(InvalidFileError, handle_invalid_file)
