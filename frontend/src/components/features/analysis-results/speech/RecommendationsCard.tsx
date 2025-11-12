import { Box, Typography, List, ListItem } from '@mui/material';
import theme from '@/styles/theme';
import { Analysis } from '@/domain/analysis/types/analysis';

interface RecommendationsCardProps {
  analysis: Analysis;
}

export function RecommendationsCard({ analysis }: RecommendationsCardProps) {
  const recommendations: string[] = [];

  // Gera recomendações baseadas na análise
  if (analysis.speechAnalysis.fillerwordsAnalysis.total > 5) {
    const topFiller = Object.keys(analysis.speechAnalysis.fillerwordsAnalysis.distribution)[0];
    recommendations.push(
      `Pratique reduzir o uso de palavras de preenchimento como "${topFiller}"`
    );
  }

  if (analysis.audioAnalysis.speechRate > 170) {
    recommendations.push('Diminua um pouco o ritmo da fala para melhorar a clareza');
  } else if (analysis.audioAnalysis.speechRate < 130) {
    recommendations.push('Aumente um pouco o ritmo da fala para manter o engajamento');
  }

  if (analysis.speechAnalysis.silenceAnalysis.pauses > 5) {
    recommendations.push('Trabalhe na fluência para reduzir pausas longas e hesitações');
  }

  if (analysis.speechAnalysis.lexicalRichnessAnalysis.typeTokenRatio < 50) {
    recommendations.push('Diversifique o vocabulário usando as alternativas sugeridas');
  }

  if (analysis.speechAnalysis.vocabularyAnalysis.suggestions.length > 0) {
    recommendations.push('Evite repetir as mesmas palavras com muita frequência');
  }

  // Adiciona recomendação padrão se não houver outras
  if (recommendations.length === 0) {
    recommendations.push('Excelente apresentação! Continue praticando para manter a qualidade');
  } else {
    recommendations.push('Continue praticando para aprimorar suas habilidades de oratória');
  }

  return (
    <Box>
      <List sx={{ listStyleType: 'disc', pl: 2 }}>
        {recommendations.map((rec, idx) => (
          <ListItem 
            key={idx} 
            sx={{ 
              display: 'list-item', 
              py: 0.5, 
              px: 0,
              animation: `slideInLeft 0.5s ease-out ${idx * 0.1}s both`,
              '@keyframes slideInLeft': {
                '0%': {
                  opacity: 0,
                  transform: 'translateX(-20px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
              {rec}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}