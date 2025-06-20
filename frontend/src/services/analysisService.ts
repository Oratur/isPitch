import apiClient from './apiClient';
import type { AnalysisCreateResponse, AnalysisResult } from '@/types/analysis';

/**
 * Uploads an audio file to start a new analysis.
 * Now it just creates the FormData and delegates the call to the apiClient.
 */
export const createAudioAnalysis = async (audioFile: File): Promise<AnalysisCreateResponse> => {
    const formData = new FormData();
    formData.append('file', audioFile);

    return apiClient.post<AnalysisCreateResponse>('/analysis/', formData);
};

/**
 * Fetches the result of a specific analysis by its ID.
 * This is also cleaner, delegating the call to the apiClient.
 */
export const getAnalysis = (id: string): Promise<AnalysisResult> => {
    return apiClient.get<AnalysisResult>(`/analysis/${id}`);
};