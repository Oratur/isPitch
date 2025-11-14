export type TimeRange = 'day' | 'month' | 'year' | 'all';

export interface DashboardStats {
    totalAnalyses: number;
    totalFillerWords: number;
    totalDuration: number;
    chartData: ChartData[];
}

export interface ChartData {
    name: string;
    analyses: number;
}

export interface RecentAnalysis {
    id: string;
    filename: string;
    createdAt: string;
    fillerWordsCount: number;
    speechRate: number;
    pausesCount: number;
    status: 'completed' | 'pending' | 'failed' | 'transcribing' | 'analyzing_speech' | 'analyzing_audio';
}