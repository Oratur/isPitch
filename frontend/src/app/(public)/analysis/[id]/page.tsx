'use client'; 

import { Grid } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import {AnalysisLayout} from '@/components/layouts/AnalysisLayout';
import {TranscriptionCard} from '@/components/features/TranscriptionCard';
import SilenceAnalysisCard from '@/components/features/SilenceAnalysisCard';
import { FillerWordAnalysisCard } from '@/components/features/FillerWordAnalysisCard';
import SpeechRateCard from '@/components/features/SpeechRateCard';
import { useGetAnalysis } from '@/hooks/queries/useGetAnalysis';
import { useAnalysisSubscription } from '@/hooks/useAnalysisSubscription';


export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();  

  const id = params.id as string;
  const currentView = searchParams.get('view') || 'transcription';

  const {data: analysis, error, isLoading } = useGetAnalysis(id);



  const { statusMessage } = useAnalysisSubscription(id);

  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const processingStates = ['PENDING', 'TRANSCRIBING', 'ANALYZING_SPEECH', 'ANALYZING_AUDIO'];
  const isProcessing = isLoading || !analysis || processingStates.includes(analysis.status.toUpperCase());

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
        <Typography>{statusMessage}...</Typography>
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