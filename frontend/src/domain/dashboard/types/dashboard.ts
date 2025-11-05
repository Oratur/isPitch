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
    status: 'completed' | 'pending' | 'failed';
}