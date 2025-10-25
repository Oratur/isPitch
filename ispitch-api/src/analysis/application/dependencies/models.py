from functools import lru_cache

import nltk
import spacy
import whisper
from transformers import T5ForConditionalGeneration, T5Tokenizer

MODEL_NAME = 'unicamp-dl/ptt5-base-portuguese-vocab'


@lru_cache(maxsize=1)
def get_whisper_model():
    return whisper.load_model('base')


@lru_cache(maxsize=1)
def get_spacy_model():
    return spacy.load('pt_core_news_sm')


def load_nltk_tokenizer():
    try:
        nltk.data.find('tokenizers/punkt_tab')
    except LookupError:
        nltk.download('punkt_tab', quiet=True)


def load_nltk_synonym_resources():
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet', quiet=True)
    try:
        nltk.data.find('corpora/omw-1.4')
    except LookupError:
        nltk.download('omw-1.4', quiet=True)


@lru_cache(maxsize=1)
def get_summarizer_tokenizer():
    return T5Tokenizer.from_pretrained(MODEL_NAME, legacy=False)


@lru_cache(maxsize=1)
def get_summarizer_model():
    return T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
