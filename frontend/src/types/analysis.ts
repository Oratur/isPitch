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


export interface SpeechAnalysis {
    silenceAnalysis: SilenceAnalysis;
    fillerwordsAnalysis: FillerwordAnalysis;
}

export interface AudioAnalysis {
    speechRate: number;
}

export interface Analysis {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    filename: string;
    transcription: string;
    speechAnalysis: SpeechAnalysis;
    audioAnalysis: AudioAnalysis;
}
