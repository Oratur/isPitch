import { useQuery } from '@tanstack/react-query';

import { DashboardStats, RecentAnalysis, TimeRange } from '../types/dashboard';
import { getDashboardStats, getRecentAnalysis } from '../services/dashboardService';


export const useGetDashboardStats = (timeRange: TimeRange = 'month') => {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard', 'stats', timeRange],
        queryFn: () => getDashboardStats(timeRange),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGetRecentAnalysis = () => {
    return useQuery<RecentAnalysis | null, Error>({
        queryKey: ['dashboard', 'recent'],
        queryFn: getRecentAnalysis,
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: false,
        throwOnError: false,
    });
};