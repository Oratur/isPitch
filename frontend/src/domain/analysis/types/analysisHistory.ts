export type AnalysisStatus = 'pending' | 'transcribing' | 'analyzing_speech' | 'analyzing_audio' | 'completed' | 'failed';

export interface AnalysisHistoryItem {
  id: string;
  filename: string;
  createdAt: string;
  duration: string; // formato "XX:XX"
  status: AnalysisStatus;
  score: number; // pontuação geral (0-100)
}

export interface AnalysisHistoryResponse {
  analyses: AnalysisHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AnalysisHistoryFilters {
  page?: number;
  limit?: number;
  status?: AnalysisStatus | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'filename' | 'score';
  sortOrder?: 'asc' | 'desc';
}