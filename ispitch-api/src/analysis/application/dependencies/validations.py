from fastapi import File, HTTPException, UploadFile, status

MAX_FILE_SIZE = 60 * 1024 * 1024
ALLOWED_CONTENT_TYPES = ['audio/mpeg', 'audio/wav']


async def validate_audio_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f'Unsupported file type: {file.content_type}. '
                'Supported types are: ' + ', '.join(ALLOWED_CONTENT_TYPES)
            ),
        )

    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(f'File size exceeds the limit of {MAX_FILE_SIZE} bytes.'),
        )

    return file
