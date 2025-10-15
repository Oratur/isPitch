from typing import Generator, List

from ..models.transcription import Word

# Define um novo tipo de dado para clareza
TextSegment = dict[str, float | str]


def segment_transcription(
    words: List[Word],
    pause_threshold_ms: int = 700,
) -> Generator[TextSegment, None, None]:
    """
    Segmenta uma lista de palavras transcritas em sentenças ou blocos lógicos.

    A quebra ocorre por pontuação final (.?!) ou por pausas silenciosas
    maiores que o `pause_threshold_ms`.

    Args:
        words: Uma lista de objetos Word da transcrição.
        pause_threshold_ms: O tempo em milissegundos para 
        considerar uma pausa longa.

    Yields:
        Um dicionário representando um segmento de texto com start_time, 
        end_time e text.
    """
    if not words:
        return

    sentence_punctuations = {'.', '?', '!'}
    current_segment_words: List[Word] = []

    for i, word in enumerate(words):
        current_segment_words.append(word)

        # Verifica se a palavra atual termina com uma pontuação de fim
        # de sentença
        ends_with_punctuation = (
            word.word.strip().endswith(tuple(sentence_punctuations))
        )

        # Verifica a pausa entre a palavra atual e a próxima
        is_long_pause = False
        if i + 1 < len(words):
            next_word = words[i + 1]
            pause_duration_ms = (next_word.start - word.end) * 1000
            if pause_duration_ms >= pause_threshold_ms:
                is_long_pause = True

        # Se for a última palavra, ou se houver pontuação ou
        # uma pausa longa, fecha o segmento
        is_last_word = (i == len(words) - 1)
        if is_last_word or ends_with_punctuation or is_long_pause:
            if not current_segment_words:
                continue

            start_time = current_segment_words[0].start
            end_time = current_segment_words[-1].end
            text = ' '.join(w.word for w in current_segment_words).strip()

            yield {
                'start_time': start_time,
                'end_time': end_time,
                'text': text,
            }
            current_segment_words = []
