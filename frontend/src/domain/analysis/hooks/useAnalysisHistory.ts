import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalysisHistory, deleteAnalysis } from '../services/analysisHistoryService';
import { AnalysisHistoryResponse } from '../types/analysisHistory';
import { toast } from 'react-hot-toast';

export const useAnalysisHistory = (page: number, pageSize: number) => {
  return useQuery<AnalysisHistoryResponse, Error>({
    queryKey: ['analysisHistory', page, pageSize],
    queryFn: () => getAnalysisHistory(page, pageSize),
    staleTime: 1000 * 60 * 2, // 2 minutos
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