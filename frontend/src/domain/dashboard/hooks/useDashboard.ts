import { useQuery } from '@tanstack/react-query';

import { DashboardStats, RecentAnalysis } from '../types/dashboard';
import { getDashboardStats, getRecentAnalyses } from '../services/dashboardService';


export const useGetDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard', 'stats'],
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGetRecentAnalyses = (limit: number = 5) => {
    return useQuery<RecentAnalysis[], Error>({
        queryKey: ['dashboard', 'recent', limit],
        queryFn: () => getRecentAnalyses(limit),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};