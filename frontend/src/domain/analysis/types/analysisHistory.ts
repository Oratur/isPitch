export type AnalysisStatus = 'pending' | 'completed' | 'failed';

export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  filename: string;
  createdAt: string;
  duration: number;
  status: AnalysisStatus;
  score: number;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface AnalysisHistoryResponse {
  analyses: AnalysisHistoryItem[];
  metadata: PaginationMetadata;
}