'use client';

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any;
}

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        if (!this.baseURL) {
            console.error('A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida.');
        }
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            method: options.method || 'GET',
            headers: {
                ...(options.headers || {}),
            },
            ...options,
        };

        if (options.body) {
            if (options.body instanceof FormData) {
                config.body = options.body;
            } else {
                config.body = JSON.stringify(options.body);
                (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
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

    public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    public post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'POST', body });
    }
}

const apiClient = new ApiClient();
export default apiClient;