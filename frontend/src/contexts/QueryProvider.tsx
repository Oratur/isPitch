'use client';
import { ApiError } from '@/lib/apiErrorHandler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useState } from 'react';


interface QueryProviderProps {
    children: React.ReactNode;
}

export const handleGlobalError = (error: unknown) => {
    if (error instanceof ApiError) {
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
        }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}