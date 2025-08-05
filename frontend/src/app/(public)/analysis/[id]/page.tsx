'use client'; 

import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import {AnalysisLayout} from '@/components/layouts/AnalysisLayout';
import {TranscriptionCard} from '@/components/features/TranscriptionCard';
import { getAnalysis } from '@/services/analysisService';
import type { Analysis } from '@/types/analysis';
import SilenceAnalysisCard from '@/components/features/SilenceAnalysisCard';
import { FillerWordAnalysisCard } from '@/components/features/FillerWordAnalysisCard';
import SpeechRateCard from '@/components/features/SpeechRateCard';

export default function AnalysisPage() {
  const params = useParams();
  const searchParams = useSearchParams();  

  const id = params.id as string;
  const currentView = searchParams.get('view') || 'transcription';

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const POLLING_INTERVAL = 3000;

    const fetchResult = async () => {
      try {
        const result = await getAnalysis(id);
        if (!isMounted) return;

        if (result.status === 'COMPLETED') {
          setAnalysis(result);
        } else if (result.status === 'PENDING') {
          setTimeout(fetchResult, POLLING_INTERVAL);
        } else {
          setError('A análise falhou. Por favor, tente novamente.');
        }
      } catch {
        if (!isMounted) return;
        setError('Não foi possível obter o resultado da análise.');
      }
    };

    fetchResult();

    return () => { isMounted = false; };
  }, [id]);

  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }


  if (!analysis) {
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
        <Typography>Processando sua análise, por favor aguarde...</Typography>
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