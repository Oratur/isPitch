'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAudioAnalysis } from '@/services/analysisService';

export function useAudioUpload() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFileAccepted = (file: File) => {
        setError(null);
        setAudioFile(file);
    };

    const handleUpload = async () => {
        if (!audioFile) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await createAudioAnalysis(audioFile);
            router.push(`/analysis/${response.id}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido durante o upload.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setAudioFile(null);
        setError(null);
    };

    return {
        audioFile,
        isLoading,
        error,
        handleFileAccepted,
        handleUpload,
        handleCancel,
        setError,
    };
}