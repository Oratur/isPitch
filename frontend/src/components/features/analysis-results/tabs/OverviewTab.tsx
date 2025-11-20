import { Grid } from '@mui/material';
import { Analysis } from '@/domain/analysis/types/analysis';
import { FillerWordsDetailCard, SilencesDetailCard, SpeechRateDetailCard, SentimentDetailCard } from '../speech';
import { ProsodyAnalysisCard } from '../speech/ProsodyAnalysisCard'; // Importe o novo componente
import { ActionButtons } from '../ActionButtons';

interface OverviewTabProps {
  analysis: Analysis;
}

export function OverviewTab({ analysis }: OverviewTabProps) {
  return (
    <Grid container spacing={3}>
      {/* Métricas Principais */}
      <Grid size={{xs: 12, md: 4}}>
        <SpeechRateDetailCard speechRate={analysis.audioAnalysis.speechRate} />
      </Grid>

      <Grid size={{xs: 12, md: 4}}>
        <FillerWordsDetailCard fillerWords={analysis.speechAnalysis.fillerwordsAnalysis} />
      </Grid>

      <Grid size={{xs: 12, md: 4}}>
        <SilencesDetailCard silences={analysis.speechAnalysis.silenceAnalysis} />
      </Grid>

      {/* Gráfico de Prosódia */}
      {analysis.audioAnalysis.prosodyAnalysis && (
        <Grid size={{ xs: 12 }}>
           <ProsodyAnalysisCard prosodyData={analysis.audioAnalysis.prosodyAnalysis} />
        </Grid>
      )}

      <Grid size={{xs: 12, md: 6, lg: 3}}>
        <SentimentDetailCard sentimentAnalysis={analysis.speechAnalysis.sentimentAnalysis} />
      </Grid>

      {/* Botões de Ação */}
      <Grid size={{xs: 12}}>
        <ActionButtons />
      </Grid>
    </Grid>
  );
}