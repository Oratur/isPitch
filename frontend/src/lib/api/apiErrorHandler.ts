import { ApiErrorResponse } from '@/types/apiErrorResponse';

export class ApiError extends Error {
    statusCode: number;
    details?: string[] | Record<string, unknown>;

    constructor(response: ApiErrorResponse) {
        super(response.message);
        this.name = 'ApiError';
        this.statusCode = response.statusCode;
        this.details = response.details;
    }
}


export async function handleApiErrorResponse(response: Response) {

    try {
        const payload: ApiErrorResponse = await response.json();
        throw new ApiError(payload);
    } catch (e) {
        if (e instanceof ApiError) {
            throw e;
        }

        const genericError: ApiErrorResponse = {
            message: `Ocorreu um erro na requisição: ${response.statusText || 'Erro de comunicação'}`,
            statusCode: response.status,
            error: response.statusText,
        };

        throw new ApiError(genericError);
    }
}