'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';
import { 
  StatsCardsSkeleton,
  RecentAnalysisCardSkeleton,
  StatsCards,
} from '@/components/features/dashboard';

import { NewAnalysisButton } from '@/components/ui/NewAnalysisButton';
import { useGetDashboardStats, useGetRecentAnalysis } from '@/domain/dashboard/hooks';
import { RecentAnalysisCard } from '@/components/features/dashboard/RecentAnalysisCard';
import { AnalysisChartSkeleton } from '@/components/features/dashboard/AnalysisChartSkeleton';
import { AnalysisChart } from '@/components/features/dashboard/AnalysisChart';
import { TimeRange } from '@/domain/dashboard/types';
import { useDashboardAnalysisSubscription } from '@/domain/dashboard/hooks/useDashboardAnalysisSubscription';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [pendingAnalysisId, setPendingAnalysisId] = useState<string | null>(null);
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetDashboardStats(timeRange);
  const { data: recentAnalysis, isLoading: analysesLoading, error: analysesError } = useGetRecentAnalysis();

  // Detecta se há uma análise pendente após upload
  useEffect(() => {
    const storedId = localStorage.getItem('pendingAnalysisId');
    if (storedId) {
      setPendingAnalysisId(storedId);
    }
  }, []);

  const processingStates = ['pending', 'transcribing', 'analyzing_speech', 'analyzing_audio'];
  const isSubscriptionEnabled = !!pendingAnalysisId && 
    (!recentAnalysis || processingStates.includes(recentAnalysis.status));

  const { statusMessage } = useDashboardAnalysisSubscription({
    analysisId: pendingAnalysisId || '',
    enabled: isSubscriptionEnabled
  });

  useEffect(() => {
    if (recentAnalysis && recentAnalysis.status === 'completed' && pendingAnalysisId) {
      localStorage.removeItem('pendingAnalysisId');
      setPendingAnalysisId(null);
    }
  }, [recentAnalysis, pendingAnalysisId]);

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

        {/* Cards de estatísticas */}
        {statsLoading ? (
          <StatsCardsSkeleton />
        ) : (
          <StatsCards stats={stats} />
        )}

        {/* Análise recente com status ao vivo */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            {analysesLoading ? (
              <RecentAnalysisCardSkeleton />
            ) : recentAnalysis ? (
                <RecentAnalysisCard 
                  analysis={recentAnalysis} 
                  statusMessage={isSubscriptionEnabled ? statusMessage : undefined}
                />
            ) : (
              <Alert severity="info">Nenhuma análise encontrada ainda.</Alert>
            )}
          </Grid>
        </Grid>

        {/* Gráfico com controles integrados */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            {statsLoading ? (
              <AnalysisChartSkeleton />
            ) : stats ? (
              <AnalysisChart 
                data={stats.chartData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                isLoading={statsLoading}
              />
            ) : null}
          </Grid>
        </Grid>
        <NewAnalysisButton anchored/>
      </Box>
    </>
  );
}