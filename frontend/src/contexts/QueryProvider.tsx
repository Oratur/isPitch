'use client';
import { ApiError } from '@/lib/api/apiErrorHandler';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache, } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { removeClientSideToken } from '@/domain/auth/services/tokenService';

interface QueryProviderProps {
    children: React.ReactNode;
}

let isLoggingOut = false;

export const handleGlobalError = (error: unknown) => {
    if (error instanceof ApiError) {
        if (error.statusCode === 401 || error.statusCode === 403) {
            if (isLoggingOut) return;

            isLoggingOut = true;

            toast.error('Sessão expirada. Por favor, faça login novamente.');
            removeClientSideToken();
            
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return;
        }
        toast.error(error.message);
    } else {
        toast.error('Ocorreu um erro inesperado.');
    }
};

export default function QueryProvider({children}: QueryProviderProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
            mutations: {
                onError: handleGlobalError
            }
        },
        queryCache: new QueryCache({
            onError: handleGlobalError,
        }),
        mutationCache: new MutationCache({
            onError: handleGlobalError,
        }),
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}