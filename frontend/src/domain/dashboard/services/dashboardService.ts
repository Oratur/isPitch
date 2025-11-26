import { ApiError, apiRequest } from '@/lib/api';
import { DashboardStats, RecentAnalysis, TimeRange } from '../types/dashboard';

export const getDashboardStats = async (timeRange: TimeRange = 'month'): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>({
        url: `/v2/analysis/stats?timeRange=${timeRange}`,
        options: {
            method: 'GET',
        },
        useAuth: true
    });
};

export const getRecentAnalysis = async (): Promise<RecentAnalysis | null> => {
    try {
        return await apiRequest<RecentAnalysis>({
            url: '/v2/analysis/recent',
            options: {
                method: 'GET',
            },
            useAuth: true
        });
    } catch (error) {
        if (error instanceof ApiError && error.statusCode === 404) {
            return null;
        }
        throw error;
    }
};