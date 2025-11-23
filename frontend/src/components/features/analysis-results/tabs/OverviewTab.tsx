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
      <Grid size={{xs: 12, md: 3}}>
        <SpeechRateDetailCard speechRate={analysis.audioAnalysis.speechRate} />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <FillerWordsDetailCard fillerWords={analysis.speechAnalysis.fillerwordsAnalysis} />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <SilencesDetailCard silences={analysis.speechAnalysis.silenceAnalysis} />
      </Grid>

      <Grid size={{xs: 12, md: 3}}>
        <SentimentDetailCard sentimentAnalysis={analysis.speechAnalysis.sentimentAnalysis} />
      </Grid>

      {/* Gráfico de Prosódia */}
      {analysis.audioAnalysis.prosodyAnalysis && (
        <Grid size={{ xs: 12 }}>
           <ProsodyAnalysisCard prosodyData={analysis.audioAnalysis.prosodyAnalysis} />
        </Grid>
      )}      

      {/* Botões de Ação */}
      <Grid size={{xs: 12}}>
        <ActionButtons />
      </Grid>
    </Grid>
  );
}