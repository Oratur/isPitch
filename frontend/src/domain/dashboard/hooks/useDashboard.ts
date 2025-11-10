import { useQuery } from '@tanstack/react-query';

import { DashboardStats, RecentAnalysis } from '../types/dashboard';
import { getDashboardStats, getRecentAnalysis } from '../services/dashboardService';


export const useGetDashboardStats = () => {
    return useQuery<DashboardStats, Error>({
        queryKey: ['dashboard', 'stats'],
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

export const useGetRecentAnalysis = () => {
    return useQuery<RecentAnalysis, Error>({
        queryKey: ['dashboard', 'recent'],
        queryFn: getRecentAnalysis,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};