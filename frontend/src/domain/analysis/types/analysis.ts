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

export interface ContourPoint {
  time: number;
  value: number;
}

export interface PitchAnalysis {
  meanPitch: number;
  minPitch: number;
  maxPitch: number;
  stdevPitch: number;
  stdevPitchSemitones: number;
  pitchContour: Array<{ time: number; pitch: number }>;
}

export interface IntensityAnalysis {
  meanIntensity: number;
  minIntensity: number;
  maxIntensity: number;
  stdevIntensity: number;
  intensityContour: Array<{ time: number; volume: number }>;
}

export interface ProsodyAnalysis {
  pitchAnalysis?: PitchAnalysis;
  intensityAnalysis?: IntensityAnalysis;
  vocalQuality?: VocalQualityAnalysis;
}

export interface VocalQualityAnalysis {
  jitter: number;
  shimmer: number;
  hnr: number;
}

export interface AudioAnalysis {
    speechRate: number;
    duration: number;
    prosodyAnalysis?: ProsodyAnalysis;
}

export interface Analysis {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    filename: string;
    createdAt: string;
    transcription: string;
    speechAnalysis: SpeechAnalysis;
    audioAnalysis: AudioAnalysis;
    score: number;
}
