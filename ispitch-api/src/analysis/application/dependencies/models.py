from functools import lru_cache

import nltk
import spacy
import whisper


@lru_cache(maxsize=1)
def get_whisper_model():
    return whisper.load_model('base')


@lru_cache(maxsize=1)
def get_spacy_model():
    return spacy.load('pt_core_news_sm')


def load_nltk_resources():
    try:
        nltk.data.find('corpora/wordnet')
    except LookupError:
        nltk.download('wordnet', quiet=True)
    try:
        nltk.data.find('corpora/omw-1.4')
    except LookupError:
        nltk.download('omw-1.4', quiet=True)
