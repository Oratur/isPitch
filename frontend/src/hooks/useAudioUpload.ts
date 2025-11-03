'use client';

import { useState } from 'react';
import { useInitiateAnalysis } from '../domain/analysis/hooks/useInitiateAnalysis';

export function useAudioUpload() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { mutate: uploadAudio, isPending, error: mutationError } = useInitiateAnalysis();

    const error = validationError || mutationError?.message || null;

    const handleValidationError = (message: string) => {
        setValidationError(message);
    };

    const handleFileAccepted = (file: File) => {
        setValidationError(null);
        setAudioFile(file);
    };

    const handleUpload = async () => {
        if (!audioFile) return;

        uploadAudio(audioFile);
    };

    const handleCancel = () => {
        setAudioFile(null);
        setValidationError(null);
    };

    return {
        audioFile,
        isLoading: isPending,
        error,
        handleFileAccepted,
        handleUpload,
        handleCancel,
        handleValidationError,
    };
}