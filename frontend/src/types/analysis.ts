export interface Silence {
    start: number;
    end: number;
    duration: number;
}

export interface AnalysisResultData {
    fileName?: string;
    transcription?: string;
    silences?: Silence[];
}

export interface AnalysisResult {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    data?: AnalysisResultData;
}

export interface AnalysisCreateResponse {
    id: string;
}
