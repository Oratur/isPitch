import { apiRequest } from './apiClient';

export function createAudioAnalysis(
    file: File,
): Promise<{ id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<{ id: string }>({
        endpoint: '/analysis',
        method: 'POST',
        body: formData,
    });
}