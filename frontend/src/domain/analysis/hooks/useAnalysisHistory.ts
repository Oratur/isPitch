import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalysisHistory, deleteAnalysis } from '../services/analysisHistoryService';
import { AnalysisHistoryFilters, AnalysisHistoryResponse } from '../types/analysisHistory';
import { toast } from 'react-hot-toast';

export const useAnalysisHistory = (filters: AnalysisHistoryFilters) => {
  return useQuery<AnalysisHistoryResponse, Error>({
    queryKey: ['analysisHistory', filters],
    queryFn: () => getAnalysisHistory(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisHistory'] });
      toast.success('Análise excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir análise. Tente novamente.');
    }
  });
};