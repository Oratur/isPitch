import { handleApiErrorResponse } from './apiErrorHandler';
import { API_BASE_URL } from './env';


type ApiRequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>
}

interface ApiRequestParameters {
    url: string;
    options: ApiRequestOptions;
}


export async function apiRequest<T>({ url, options = {} }: ApiRequestParameters): Promise<T> {

    const headers: Record<string, string> = {};

    const isFormData = options.body instanceof FormData;

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const requestOptions: RequestInit = {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);

    if (!response.ok) {
        await handleApiErrorResponse(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}