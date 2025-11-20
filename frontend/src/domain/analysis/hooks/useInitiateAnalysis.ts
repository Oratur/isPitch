import { initiateAnalysis } from '@/domain/analysis/services/analysisService';
import { RecentAnalysis } from '@/domain/dashboard/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useInitiateAnalysis = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: initiateAnalysis,
        onSuccess: (analysisId, audioFile) => {

            const pendingAnalysis: RecentAnalysis = {
                id: analysisId,
                filename: audioFile.name,
                createdAt: new Date().toISOString(),
                fillerWordsCount: 0,
                speechRate: 0,
                pausesCount: 0,
                status: 'pending',
                score: 0,
            };

            queryClient.setQueryData(['dashboard', 'recent'], pendingAnalysis);

            queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });

            localStorage.setItem('pendingAnalysisId', analysisId);

            router.push('/dashboard');
        }
    });
};