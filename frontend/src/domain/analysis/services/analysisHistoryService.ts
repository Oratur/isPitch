// frontend/src/domain/analysis/services/analysisHistoryService.ts

import { apiRequest } from '@/lib/api';
import { AnalysisHistoryResponse, AnalysisHistoryFilters, AnalysisHistoryItem } from '../types/analysisHistory';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data para desenvolvimento
const mockAnalyses: AnalysisHistoryItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `analysis-${i + 1}`,
  filename: `arquivo_audio_${i + 1}.mp3`,
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  duration: `${String(Math.floor(Math.random() * 20)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
  score: Math.floor(Math.random() * 40) + 60, // 60-100
}));

export const getAnalysisHistory = async (
  filters: AnalysisHistoryFilters = {}
): Promise<AnalysisHistoryResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const {
      page = 1,
      limit = 10,
      status = 'all',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    let filtered = [...mockAnalyses];

    // Filtrar por status
    if (status !== 'all') {
      filtered = filtered.filter(a => a.status === status);
    }

    // Filtrar por busca
    if (search) {
      filtered = filtered.filter(a => 
        a.filename.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'filename') {
        comparison = a.filename.localeCompare(b.filename);
      } else if (sortBy === 'score') {
        comparison = a.score - b.score;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Paginar
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      analyses: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  }

  // Construir query string
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  return apiRequest<AnalysisHistoryResponse>({
    url: `/v2/analysis/history?${params.toString()}`,
    options: {
      method: 'GET',
    },
    useAuth: true
  });
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  return apiRequest<void>({
    url: `/v2/analysis/${id}`,
    options: {
      method: 'DELETE',
    },
    useAuth: true
  });
};