import { initiateAnalysis } from '@/services/analysisService';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useInitiateAnalysis = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: initiateAnalysis,
        onSuccess: (analysisId) => {
            router.push(`/analysis/${analysisId}`);
        }
    });
};