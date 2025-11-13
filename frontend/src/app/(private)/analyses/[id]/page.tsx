'use client';

import { useParams } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import { AnalysisResultsView } from '@/components/features/analysis-results';
import { AnalysisResultsViewSkeleton } from '@/components/features/analysis-results/skeletons/AnalysisResultsViewSkeleton';
import { useGetAnalysis } from '@/domain/analysis/hooks';
import { useAnalysisSubscription } from '@/domain/analysis/hooks';

export default function AnalysisPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: analysis, error, isLoading } = useGetAnalysis(id);

  const processingStates = ['pending', 'transcribing', 'analyzing_speech', 'analyzing_audio'];
  const isSubscriptionEnabled = !!analysis && processingStates.includes(analysis.status ?? 'pending');

  useAnalysisSubscription({
    analysisId: id, 
    enabled: isSubscriptionEnabled
  });

  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const isProcessing = isLoading || isSubscriptionEnabled || !analysis;

  if (isProcessing) {
    return <AnalysisResultsViewSkeleton />;
  }

  return <AnalysisResultsView analysis={analysis} />;
}