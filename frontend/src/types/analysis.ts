interface Silence {
    start: number;
    end: number;
    duration: number;
}

export interface SilenceAnalysis {
    silences: Silence[];
    totalDuration: number;
    numberOfPauses: number;
}

export interface FillerWordAnalysis {
    totalFillerWords: number;
    fillerWordsCount: Record<string, number>;
}


export interface AnalysisResultData {
    fileName: string;
    transcription: string;
    silences: SilenceAnalysis;
    fillerWords: FillerWordAnalysis;
}

export interface AnalysisResult {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    data: AnalysisResultData;
}

export interface AnalysisCreateResponse {
    id: string;
}
