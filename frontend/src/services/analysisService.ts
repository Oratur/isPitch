import apiClient from './apiClient';
import type { Analysis } from '@/types/analysis';

/**
 * Uploads an audio file to start a new analysis.
 * Now it just creates the FormData and delegates the call to the apiClient.
 */
export const createAudioAnalysis = async (audioFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', audioFile);

    return apiClient.post<string>('/analysis/initiate', formData);
};

/**
 * Fetches the result of a specific analysis by its ID.
 * This is also cleaner, delegating the call to the apiClient.
 */
export const getAnalysis = (id: string): Promise<Analysis> => {
    return apiClient.get<Analysis>(`/analysis/${id}`);
};