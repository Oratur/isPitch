from functools import lru_cache

import spacy
import whisper


@lru_cache(maxsize=1)
def get_whisper_model():
    return whisper.load_model('base')
    # return whisper.load_model('medium')


@lru_cache(maxsize=1)
def get_spacy_model():
    return spacy.load('pt_core_news_sm')
