import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/config/env';
import { Analysis } from '@/domain/analysis/types/analysis';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getClientSideToken } from '@/domain/auth/services/tokenService';

const statusMessages: Record<string, string> = {
    pending: 'Aguardando início...',
    transcribing: 'Transcrevendo...',
    analyzing_speech: 'Analisando fala...',
    analyzing_audio: 'Analisando áudio...',
    completed: 'Análise concluída!',
    failed: 'Falha na análise.',
};

interface UseAnalysisSubscriptionProps {
    analysisId: string;
    enabled: boolean;
}

export function useAnalysisSubscription({ analysisId, enabled }: UseAnalysisSubscriptionProps) {
    const queryClient = useQueryClient();

    const [statusMessage, setStatusMessage] = useState('Conectando...');

    useEffect(() => {
        if (!analysisId || !enabled) {
            return;
        }

        const token = getClientSideToken();
        const eventSource = new EventSourcePolyfill(`${API_BASE_URL}/v2/analysis/${analysisId}/stream`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        eventSource.addEventListener('status_update', (event) => {
            const newStatus = (event as MessageEvent).data;
            setStatusMessage(statusMessages[newStatus.toLowerCase()] || 'Processando...');

            queryClient.setQueryData(['analysis', analysisId], (oldData) => {
                if (!oldData) return undefined;
                return { ...oldData, status: newStatus };
            });
        });

        eventSource.addEventListener('analysis_result', (event) => {
            const analysis: Analysis = JSON.parse((event as MessageEvent).data);
            queryClient.setQueryData(['analysis', analysisId], analysis);
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