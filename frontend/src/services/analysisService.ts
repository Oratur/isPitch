import { apiRequest } from '@/lib/apiClient'
import type { Analysis } from '@/types/analysis';

/**
 * Uploads an audio file to start a new analysis.
 * Now it just creates the FormData and delegates the call to the apiClient.
 */
export const initiateAnalysis = async (audioFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', audioFile);

    return apiRequest<string>({
        url: '/analysis/initiate',
        options: {
            method: 'POST',
            body: formData
        }
    });
};

/**
 * Fetches the result of a specific analysis by its ID.
 * This is also cleaner, delegating the call to the apiClient.
 */
export const getAnalysis = (id: string): Promise<Analysis> => {
    return apiRequest<Analysis>({
        url: `/analysis/${id}`,
        options: {
            method: 'GET',
        }
    });
};