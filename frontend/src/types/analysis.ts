export interface Silence {
    start: number;
    end: number;
    duration: number;
}

export interface FillerWordAnalysis {
    totalFillerWords: number;
    fillerWordsCount: Record<string, number>;
}


export interface AnalysisResultData {
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
