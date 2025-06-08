'use server';

const API_BASE_URL = process.env.API_BASE_URL;

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'method'> {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
}

export async function apiRequest<T>({
    endpoint,
    method,
    body,
    ...options
}: ApiRequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = new Headers({
        ...options.headers,
    });

    const config: RequestInit = {
        method,
        headers,
        ...options
    };

    if (body) {
        if (body instanceof FormData) {
            config.body = body;
        } else {
            headers.set('Content-Type', 'application/json');
            config.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.detail || `Erro na requisição para ${endpoint}`;
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}