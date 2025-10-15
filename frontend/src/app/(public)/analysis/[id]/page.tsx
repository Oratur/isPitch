'use client'; 

import { Grid } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import {AnalysisLayout} from '@/components/layouts/AnalysisLayout/AnalysisLayout';
import { FillerWordAnalysisCard, SilenceAnalysisCard, SpeechRateCard, TranscriptionCard, SentimentTimelineChart } from '@/components/features/analysis';
import { useAnalysisSubscription, useGetAnalysis } from '@/domain/analysis/hooks';


export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();  

  const id = params.id as string;
  const currentView = searchParams.get('view') || 'transcription';

  const {data: analysis, error, isLoading } = useGetAnalysis(id);

  const processingStates = ['pending', 'transcribing', 'analyzing_speech', 'analyzing_audio'];
  
  const isSubscriptionEnabled = !!analysis && processingStates.includes(analysis.status ?? 'pending');

  const { statusMessage } = useAnalysisSubscription({
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
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>{statusMessage}</Typography>
      </Box>
    );
  }


  return (
    <AnalysisLayout
      analysisId={analysis.id}
      fileName={analysis.filename ?? 'Nome não encontrado'}
    >
      {currentView === 'analytics' ? (
        <Grid container spacing={4}>
          <Grid size={{xs: 12, lg: 6, xl: 4}}>
            <FillerWordAnalysisCard analysis={analysis.speechAnalysis.fillerwordsAnalysis} />
          </Grid>
          <Grid size={{xs: 12, lg: 6, xl: 4}}>
            <SilenceAnalysisCard silences={analysis.speechAnalysis.silenceAnalysis} />
          </Grid>  
          <Grid size={{xs: 12, lg: 6, xl: 4}}>
            <SpeechRateCard speechRate={analysis.audioAnalysis.speechRate} />
          </Grid>
          <Grid size={{xs: 12, lg: 6, xl: 4}}>
            <SentimentTimelineChart sentimentAnalysis={analysis.speechAnalysis.sentimentAnalysis} />
          </Grid>
        </Grid>
      ) : (
        <TranscriptionCard 
          transcription={analysis.transcription ?? 'Transcrição não disponível.'}
          fillerWords={analysis.speechAnalysis.fillerwordsAnalysis}
        />
      )}
    </AnalysisLayout>
  );
}