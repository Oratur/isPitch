export interface AnalysisResult {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    data?: {
        fileName?: string;
        transcription?: string;
    }
}

export interface AnalysisCreateResponse {
    id: string;
}
