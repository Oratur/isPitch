import { Grid } from '@mui/material';
import { Analysis } from '@/domain/analysis/types/analysis';
import { LexicalRichnessCard, TopicAnalysisCard, VocabularySuggestionsCard, GrammarDetailCard } from '../speech';


interface InsightsTabProps {
  analysis: Analysis;
}

export function InsightsTab({ analysis }: InsightsTabProps) {
  return (
    <Grid container spacing={3}>
      {/* Riqueza Lexical e Vocabulário */}
      <Grid size={{xs: 12, md: 6}}>
        <LexicalRichnessCard lexicalRichness={analysis.speechAnalysis.lexicalRichnessAnalysis} />
      </Grid>

      <Grid size={{xs: 12, md: 6}}>
        <VocabularySuggestionsCard suggestions={analysis.speechAnalysis.vocabularyAnalysis.suggestions} />
      </Grid>

      <Grid size={{xs: 12, md: 6}}>
        <GrammarDetailCard grammarAnalysis={analysis.speechAnalysis.grammarAnalysis} />
      </Grid>

      {/* Análise de Tópicos */}
      <Grid size={{xs: 12}}>
        <TopicAnalysisCard topics={analysis.speechAnalysis.topicAnalysis.topics} />
      </Grid>
    </Grid>
  );
}