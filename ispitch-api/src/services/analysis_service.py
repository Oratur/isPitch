import uuid

from fastapi import UploadFile


class InvalidFileError(ValueError):
    pass


class FileTooLargeError(InvalidFileError):
    pass


class UnsupportedFileTypeError(InvalidFileError):
    pass


class AnalysisService:
    """
    Encapsula toda a lógica de negócio para criar e gerir uma análise de áudio.
    """

    MAX_FILE_SIZE_BYTES = 60 * 1024 * 1024
    VALID_CONTENT_TYPES = ['audio/mpeg', 'audio/wav']

    def _validate_file(self, file: UploadFile):
        """
        Método privado para validar o arquivo. Levanta exceções de negócio
        específicas em caso de falha.
        """
        if file.size > self.MAX_FILE_SIZE_BYTES:
            raise FileTooLargeError(
                'Arquivo muito grande. O tamanho máximo permitido é de'
                + f' {self.MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.'
            )

        if file.content_type not in self.VALID_CONTENT_TYPES:
            raise UnsupportedFileTypeError(
                'Formato de arquivo não suportado.'
                + f' Use um dos seguintes: {self.VALID_CONTENT_TYPES}.'
            )

    def create_new_analysis(self, file: UploadFile) -> str:
        """
        Orquestra a criação de uma nova análise.
        """
        self._validate_file(file)

        analysis_id = str(uuid.uuid4())
        print(
            f'SERVICE: Análise criada com ID: {analysis_id}'
            + f' para o arquivo: {file.filename}'
        )

        return analysis_id
