from whisper import Whisper

from ....domain.mappers.transcription_mapper import TranscriptionMapper
from ....domain.ports.output import TranscriptionPort


class WhisperAdapter(TranscriptionPort):
    """
    Service responsible for handling audio transcription
    using the Whisper model.
    """

    def __init__(self, whisper: Whisper):
        self.whisper = whisper

    def transcribe(self, audio_path: str):
        """
        Transcribe the audio file at the given path using the Whisper model.

        Args:
        audio_path: Path to the audio file to be transcribed

        Returns:
        str: The transcribed text from the audio file.
        """

        prompt = (
            'Você é um especialista em transcrição verbatim (literal). '
            'Sua tarefa é transcrever o áudio a seguir com a máxima '
            'fidelidade ao que foi dito, seguindo rigorosamente estas '
            'diretrizes:\n\n'
            '1.  **Transcrição Estritamente Literal:** Preserve '
            'absolutamente todas as palavras, incluindo hesitações, '
            'repetições, falsos começos e interjeições.\n'
            '2.  **Manter Palavras de Preenchimento:** Não remova ou '
            'edite vícios de linguagem e pausas preenchidas. Mantenha '
            'explicitamente termos como:\n'
            '    * `hã`, `ãh`, `hum`\n'
            '    * `né`, `tipo`, `sabe`\n'
            '    * `então`, `aí`, `assim`\n'
            '    * `bom`, `certo`, `ok`, `tá`\n'
            '3.  **Não Realizar Correções:** Não corrija erros '
            'gramaticais, de concordância ou de pronúncia. '
            'Transcreva exatamente o que foi falado.\n\n'
            '**Exemplo do Formato Esperado:**\n'
            '"Bom, então, tipo, ãh... eu acho que a gente precisa, '
            'sabe... focar nisso aí, né? Tá?"\n'
        )

        result = self.whisper.transcribe(
            audio_path, fp16=False, word_timestamps=True, initial_prompt=prompt
        )

        return TranscriptionMapper.from_whisper_result(result)
