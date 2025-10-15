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

export interface SentimentSegment {
  startTime: number; 
  endTime: number; 
  sentiment: 'positivo' | 'negativo' | 'neutro';
  score: number;
}

export interface SentimentAnalysis {
  timeline: SentimentSegment[];
}

export interface SpeechAnalysis {
    silenceAnalysis: SilenceAnalysis;
    fillerwordsAnalysis: FillerwordAnalysis;
    sentimentAnalysis?: SentimentAnalysis;
}

export interface AudioAnalysis {
    speechRate: number;
}

export interface Analysis {
    id: string;
    status: 'pending' | 'transcribing' | 'analyzing_speech' | 'analyzing_audio' | 'completed' | 'failed';
    filename: string;
    transcription: string;
    speechAnalysis: SpeechAnalysis;
    audioAnalysis: AudioAnalysis;
}
