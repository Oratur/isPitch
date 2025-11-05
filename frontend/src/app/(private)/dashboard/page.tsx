'use client';

import { Box, Typography, Grid, Alert } from '@mui/material';
import { 
  StatsCardsSkeleton,
  RecentAnalysisCardSkeleton,
  StatsCards,
} from '@/components/features/dashboard';

import { NewAnalysisButton } from '@/components/ui/NewAnalysisButton';
import { useGetDashboardStats, useGetRecentAnalyses } from '@/domain/dashboard/hooks';
import { RecentAnalysisCard } from '@/components/features/dashboard/RecentAnalysisCard';
import { AnalysisChartSkeleton } from '@/components/features/dashboard/AnalysisChartSkeleton';
import { AnalysisChart } from '@/components/features/dashboard/AnalysisChart';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetDashboardStats();
  const { data: recentAnalyses, isLoading: analysesLoading, error: analysesError } = useGetRecentAnalyses();

  const error = statsError || analysesError;

  return (
    <>
      <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, position: 'relative' }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-text)' }}>
          Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Visão geral das suas análises
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.message}
          </Alert>
        )}

        {statsLoading ? (
          <StatsCardsSkeleton />
        ) : (
          <StatsCards stats={stats} />
        )}

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            {analysesLoading ? (
              <RecentAnalysisCardSkeleton />
            ) : recentAnalyses && recentAnalyses.length > 0 ? (
              <RecentAnalysisCard analysis={recentAnalyses[0]} />
            ) : (
              <Alert severity="info">Nenhuma análise encontrada ainda.</Alert>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12 }}>
            {statsLoading ? (
              <AnalysisChartSkeleton />
            ) : stats ? (
              <AnalysisChart data={stats.chartData} />
            ) : null}
          </Grid>
        </Grid>
        <NewAnalysisButton anchored/>
      </Box>
    </>
  );
}