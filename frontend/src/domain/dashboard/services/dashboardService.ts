import { apiRequest } from '@/lib/api';
import { DashboardStats, RecentAnalysis } from '../types/dashboard';
import { mockDashboardStats, mockRecentAnalyses } from '../mocks/dashboard.mock.data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockDashboardStats;
    }

    return apiRequest<DashboardStats>({
        url: '/v2/analysis/stats',
        options: {
            method: 'GET',
        },
        useAuth: true
    });
};

export const getRecentAnalysis = async (): Promise<RecentAnalysis> => {
    if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return mockRecentAnalyses.slice(0, 5)[0];
    }

    return apiRequest<RecentAnalysis>({
        url: '/v2/analysis/recent',
        options: {
            method: 'GET',
        },
        useAuth: true
    });
};