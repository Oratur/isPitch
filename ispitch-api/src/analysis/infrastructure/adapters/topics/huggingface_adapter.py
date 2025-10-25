import logging
import re

import nltk
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

from ....domain.models.topic import Topic, TopicAnalysis
from ....domain.ports.output import TopicModelPort
from .prompt_templates import PromptCleaner, PromptStyle, PromptTemplates

logger = logging.getLogger(__name__)

MIN_WORDS_FOR_TOPIC_ANALYSIS = 50
MIN_WORDS_FOR_SEGMENT_SUMMARY = 30
MIN_WORDS_FOR_SUMMARY = 10
MAX_WORDS_FOR_SEGMENT = 250

SUMMARY_ORIGINAL_OVERLAP_THRESHOLD = 0.7

MODEL_NAME = 'unicamp-dl/ptt5-base-portuguese-vocab'

FILLER_WORDS_TO_REMOVE = [
    r'\b(tipo|né|sabe|tal|aí|então|assim|é)\b',
    r'(\?|\.|\,|\!)?\s*(né|tipo|sabe)(\?|\.|\,|\!)?',
    r'\s+[,.]\s+',
]
FILLER_REGEX = re.compile('|'.join(FILLER_WORDS_TO_REMOVE), re.IGNORECASE)

PROMPT_STYLE = PromptStyle.DETAILED


def WHITESPACE_HANDLER(k):
    return re.sub(r'\s+', ' ', re.sub(r'\n+', ' ', k.strip()))


class HuggingFaceTopicAdapter(TopicModelPort):
    """
    Adapter that uses Hugging Face AutoTokenizer and AutoModelForSeq2SeqLM
    to segment text, summarize segments, and generate titles.
    """

    def __init__(
        self, tokenizer: T5Tokenizer, model: T5ForConditionalGeneration
    ):
        self.tokenizer = tokenizer
        self.model = model
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.to(self.device)

    def extract_topics(self, text: str) -> TopicAnalysis:
        if not text or len(text.split()) < MIN_WORDS_FOR_TOPIC_ANALYSIS:
            return TopicAnalysis(topics=[])

        processed_text = self._preprocess_text(text)

        if (
            not processed_text
            or len(processed_text.split()) < MIN_WORDS_FOR_TOPIC_ANALYSIS
        ):
            return TopicAnalysis(topics=[])

        segments = self._segment_text(processed_text)

        topics = []

        for segment in segments:
            segment_word_count = len(segment.split())

            if segment_word_count < MIN_WORDS_FOR_SEGMENT_SUMMARY:
                continue

            segment_text = segment
            if segment_word_count > MAX_WORDS_FOR_SEGMENT:
                words = segment.split()[:MAX_WORDS_FOR_SEGMENT]
                segment_text = ' '.join(words)
                segment_word_count = len(words)

            max_len = min(150, max(50, int(segment_word_count * 0.5)))
            min_len = max(30, int(segment_word_count * 0.2))
            summary_text = self._run_summarization(
                segment_text, max_tokens=max_len, min_tokens=min_len
            )

            if (
                not summary_text
                or len(summary_text.split()) < MIN_WORDS_FOR_SUMMARY
            ):
                continue

            if not self._validate_summary(summary_text, segment_text):
                continue

            topic_title = self._generate_title_from_summary(summary_text)

            topics.append(Topic(topic=topic_title, summary=summary_text))

        return TopicAnalysis(topics=topics)

    @staticmethod
    def _preprocess_text(text: str) -> str:
        """Removes common filler words and normalizes whitespace."""
        cleaned_text = FILLER_REGEX.sub(' ', text)
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        cleaned_text = re.sub(r'\s+([,.!?])', r'\1', cleaned_text)
        return cleaned_text

    @staticmethod
    def _segment_text(text: str, sentences_per_segment: int = 8) -> list[str]:
        """
        Splits the text into segments based on sentences.
        Increased to 8 sentences per segment for better context.
        """
        try:
            sentences = nltk.sent_tokenize(text, language='portuguese')
        except LookupError:
            sentences = nltk.sent_tokenize(text)

        segments = []
        for i in range(0, len(sentences), sentences_per_segment):
            segment = ' '.join(sentences[i : i + sentences_per_segment])
            if len(segment.split()) >= MIN_WORDS_FOR_SEGMENT_SUMMARY:
                segments.append(segment)

        return segments

    def _run_summarization(
        self, text_to_summarize: str, max_tokens: int, min_tokens: int
    ) -> str:
        """
        Handles tokenization, generation, and decoding with proper prompts.
        """

        if 'ptt5' in MODEL_NAME.lower() or 't5' in MODEL_NAME.lower():
            prompt = f'summarize: {text_to_summarize}'
        elif 'mbart' in MODEL_NAME.lower():
            prompt = f'Resumir: {text_to_summarize}'
        else:
            prompt = text_to_summarize

        cleaned_text = WHITESPACE_HANDLER(prompt)

        try:
            input_ids = self.tokenizer(
                [cleaned_text],
                return_tensors='pt',
                padding='max_length',
                truncation=True,
                max_length=512,
            )['input_ids'].to(self.device)

            output_ids = self.model.generate(
                input_ids=input_ids,
                max_length=max_tokens,
                min_length=min_tokens,
                do_sample=True,
                temperature=0.8,
                top_p=0.9,
                no_repeat_ngram_size=3,
            )[0]

            summary = self.tokenizer.decode(
                output_ids,
                skip_special_tokens=True,
                clean_up_tokenization_spaces=False,
            )

            # Remove o prompt se ele aparecer no output
            summary = (
                summary.replace('summarize:', '').replace('Resumir:', '').strip()
            )

            return summary

        except Exception:
            return ''

    @staticmethod
    def _build_summarization_prompt(text: str) -> str:
        return PromptTemplates.get_summarization_prompt(
            model_name=MODEL_NAME, text=text, style=PROMPT_STYLE
        )

    @staticmethod
    def _clean_generated_summary(summary: str) -> str:
        return PromptCleaner.clean_summary(summary)

    @staticmethod
    def _validate_summary(summary: str, original: str) -> bool:
        """
        Validates that the summary is good quality and not just copying.
        """

        summary_words = set(summary.lower().split())
        original_words = set(original.lower().split())

        overlap = len(summary_words & original_words) / len(original_words)

        if overlap > SUMMARY_ORIGINAL_OVERLAP_THRESHOLD:
            return False

        return True

    @staticmethod
    def _generate_title_from_summary(summary_text: str) -> str:
        """
        Generates a concise title from the summary.
        Uses extractive approach to avoid hallucination.
        """
        if not summary_text:
            return 'Tópico Indefinido'

        try:
            sentences = nltk.sent_tokenize(summary_text, language='portuguese')
            first_sentence = sentences[0] if sentences else summary_text
        except LookupError:
            first_sentence = summary_text.split('.', 1)[0]

        # Limpa e formata
        title = re.sub(r'\s+', ' ', first_sentence).strip()
        title = title.rstrip('.')

        # Limita tamanho
        max_title_length = 80
        if len(title) > max_title_length:
            last_space = title.rfind(' ', 0, max_title_length)
            title = (
                title[:last_space] + '...'
                if last_space > 0
                else title[:max_title_length] + '...'
            )

        # Capitaliza adequadamente
        if title and title[0].islower():
            title = title.capitalize()

        return title if title else 'Tópico Principal'
