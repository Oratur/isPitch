import { apiRequest } from '@/lib/api';
import { AnalysisHistoryResponse } from '../types/analysisHistory';

export const getAnalysisHistory = async (
  page: number = 1,
  pageSize: number = 10
): Promise<AnalysisHistoryResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  
  return apiRequest<AnalysisHistoryResponse>({
    url: `/v2/analysis/?${params.toString()}`,
    options: {
      method: 'GET',
    },
    useAuth: true
  });
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  return apiRequest<void>({
    url: `/v2/analysis/${id}`,
    options: {
      method: 'DELETE',
    },
    useAuth: true
  });
};