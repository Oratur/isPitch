interface Silence {
    start: number;
    end: number;
    duration: number;
}

export interface SilenceAnalysis {
    duration: number;
    silences: Silence[];
    pauses: number;
}

export interface FillerwordOccurrence {
    start: number;
    end: number;
    word: string;
}

export interface FillerwordAnalysis {
    total: number;
    distribution: Record<string, number>;
    occurrences: FillerwordOccurrence[];
}

export interface VocabularySuggestion {
    word: string;
    count: number;
    alternatives: string[];
}

export interface VocabularyAnalysis {
    suggestions: VocabularySuggestion[];
}

export interface LexicalRichnessAnalysis {
    typeTokenRatio: number;
    uniqueWords: number;
    totalWords: number;
}

export interface Topic {
    topic: string;
    summary: string;
}

export interface TopicAnalysis {
    topics: Topic[];
}

export interface SpeechAnalysis {
    silenceAnalysis: SilenceAnalysis;
    fillerwordsAnalysis: FillerwordAnalysis;
    vocabularyAnalysis: VocabularyAnalysis;
    lexicalRichnessAnalysis: LexicalRichnessAnalysis;
    topicAnalysis: TopicAnalysis;
}

export interface AudioAnalysis {
    speechRate: number;
    duration: number;
}

export interface Analysis {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    filename: string;
    createdAt: string;
    transcription: string;
    speechAnalysis: SpeechAnalysis;
    audioAnalysis: AudioAnalysis;
}
