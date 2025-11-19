import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/config/env';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getClientSideToken } from '@/domain/auth/services/tokenService';
import { RecentAnalysis } from '@/domain/dashboard/types';

const statusMessages: Record<string, string> = {
    pending: 'Aguardando início...',
    transcribing: 'Transcrevendo áudio...',
    analyzing_speech: 'Analisando fala...',
    analyzing_audio: 'Analisando áudio...',
    completed: 'Análise concluída!',
    failed: 'Falha na análise.',
};

interface UseDashboardAnalysisSubscriptionProps {
    analysisId: string;
    enabled: boolean;
}

export function useDashboardAnalysisSubscription({
    analysisId,
    enabled
}: UseDashboardAnalysisSubscriptionProps) {
    const queryClient = useQueryClient();
    const [statusMessage, setStatusMessage] = useState('Aguardando início...');

    useEffect(() => {
        if (!analysisId || !enabled) {
            return;
        }

        const token = getClientSideToken();
        const eventSource = new EventSourcePolyfill(
            `${API_BASE_URL}/v2/analysis/${analysisId}/stream`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        eventSource.addEventListener('status_update', (event) => {
            const newStatus = (event as MessageEvent).data;

            setStatusMessage(statusMessages[newStatus.toLowerCase()] || 'Processando...');

            // Atualiza o status na query do dashboard
            queryClient.setQueryData<RecentAnalysis>(
                ['dashboard', 'recent'],
                (oldData) => {
                    if (!oldData || oldData.id !== analysisId) {
                        return oldData;
                    }
                    const updated = {
                        ...oldData,
                        status: newStatus.toLowerCase() as RecentAnalysis['status']
                    };

                    return updated;
                }
            );
        });

        eventSource.addEventListener('analysis_result', (event) => {
            const analysisData = JSON.parse((event as MessageEvent).data);

            queryClient.setQueryData<RecentAnalysis>(
                ['dashboard', 'recent'],
                (oldData) => {
                    if (!oldData || oldData.id !== analysisId) return oldData;

                    return {
                        ...oldData,
                        status: 'completed',
                        fillerWordsCount: analysisData.speechAnalysis?.fillerwordsAnalysis?.total || 0,
                        speechRate: Math.round(analysisData.audioAnalysis?.speechRate || 0),
                        pausesCount: analysisData.speechAnalysis?.silenceAnalysis?.pauses || 0,
                        score: analysisData?.score || 0,
                    };
                }
            );

            setStatusMessage('Análise concluída!');

            queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
        });

        eventSource.onerror = () => {
            setStatusMessage('Erro na conexão. Tentando reconectar...');
        };

        return () => {
            eventSource.close();
        };
    }, [analysisId, queryClient, enabled]);

    return { statusMessage };
}