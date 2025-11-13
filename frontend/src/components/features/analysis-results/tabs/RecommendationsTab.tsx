import { Grid, Box, Typography, Card, CardContent, CardHeader } from '@mui/material';
import { Analysis } from '@/domain/analysis/types/analysis';
import { TrendingUp, Award, Target } from 'lucide-react';
import theme from '@/styles/theme';
import { RecommendationsCard } from '../speech';
import { ActionButtons } from '../ActionButtons';

interface RecommendationsTabProps {
  analysis: Analysis;
}

export function RecommendationsTab({ analysis }: RecommendationsTabProps) {
  
  // Pontos Fortes
  const strengths: string[] = [];
  if (analysis.speechAnalysis.fillerwordsAnalysis.total <= 5) {
    strengths.push('Uso controlado de vícios de linguagem');
  }
  if (analysis.audioAnalysis.speechRate >= 130 && analysis.audioAnalysis.speechRate <= 170) {
    strengths.push('Ritmo de fala ideal para apresentações');
  }
  if (analysis.speechAnalysis.silenceAnalysis.pauses <= 3) {
    strengths.push('Boa fluência com poucas pausas longas');
  }
  if (analysis.speechAnalysis.lexicalRichnessAnalysis.typeTokenRatio > 50) {
    strengths.push('Vocabulário rico e diversificado');
  }
  if (strengths.length === 0) {
    strengths.push('Continue praticando para desenvolver seus pontos fortes');
  }

  // Áreas de Melhoria
  const improvements: string[] = [];
  if (analysis.speechAnalysis.fillerwordsAnalysis.total > 5) {
    improvements.push('Reduzir o uso de vícios de linguagem');
  }
  if (analysis.audioAnalysis.speechRate < 130 || analysis.audioAnalysis.speechRate > 170) {
    improvements.push('Ajustar o ritmo da fala');
  }
  if (analysis.speechAnalysis.silenceAnalysis.pauses > 5) {
    improvements.push('Trabalhar a fluência e reduzir pausas');
  }
  if (analysis.speechAnalysis.lexicalRichnessAnalysis.typeTokenRatio <= 50) {
    improvements.push('Ampliar o vocabulário utilizado');
  }

  return (
    <Grid container spacing={3}>
      {/* Pontos Fortes */}
      <Grid size={{xs: 12, md: 6}}>
        <Card 
          sx={{ 
            bgcolor: theme.palette.purple.light2,
            height: '100%',
            border: `2px solid ${theme.palette.success.main}40`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 24px ${theme.palette.success.main}40`,
              '& .icon-container': {
                transform: 'scale(1.1) rotate(5deg)',
              },
              '& .trend-chip': {
                transform: 'translateX(0)',
                opacity: 1,
              }
            }
          }}
        >
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, #16a34a 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={24} color="white" />
              </Box>
            }
            title={
              <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
                Pontos Fortes
              </Typography>
            }
          />
          <CardContent>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {strengths.map((strength, idx) => (
                <Box 
                  key={idx}
                  component="li" 
                  sx={{ 
                    mb: 1.5,
                    color: theme.palette.purple.light1,
                    animation: `slideIn 0.5s ease-out ${0.2 + idx * 0.1}s both`,
                    '@keyframes slideIn': {
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
                  <Typography variant="body2">
                    {strength}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Áreas de Melhoria */}
      <Grid size={{xs: 12, md: 6}}>
        <Card 
          sx={{ 
            bgcolor: theme.palette.purple.light2,
            height: '100%',
            border: `2px solid ${theme.palette.warning.main}40`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 24px ${theme.palette.warning.main}40`,
              '& .icon-container': {
                transform: 'scale(1.1) rotate(5deg)',
              },
              '& .trend-chip': {
                transform: 'translateX(0)',
                opacity: 1,
              }
            }
          }}
        >
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, #f59e0b 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp size={24} color="white" />
              </Box>
            }
            title={
              <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
                Áreas de Melhoria
              </Typography>
            }
          />
          <CardContent>
            {improvements.length > 0 ? (
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {improvements.map((improvement, idx) => (
                  <Box 
                    key={idx}
                    component="li" 
                    sx={{ 
                      mb: 1.5,
                      color: theme.palette.purple.light1,
                      animation: `slideIn 0.5s ease-out ${0.2 + idx * 0.1}s both`,
                      '@keyframes slideIn': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateX(20px)'
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateX(0)'
                        }
                      }
                    }}
                  >
                    <Typography variant="body2">
                      {improvement}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: theme.palette.purple.light1, textAlign: 'center', py: 2 }}>
                Parabéns! Não identificamos áreas críticas de melhoria. Continue praticando! 🎉
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Próximos Passos */}
      <Grid size={{xs: 12}}>
        <Card 
          sx={{ 
            bgcolor: theme.palette.purple.light2,
            border: `2px solid ${theme.palette.info.main}40`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 12px 24px ${theme.palette.info.main}40`,
              '& .icon-container': {
                transform: 'scale(1.1) rotate(5deg)',
              },
              '& .trend-chip': {
                transform: 'translateX(0)',
                opacity: 1,
              }
            }
          }}
        >
          <CardHeader
            avatar={
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, #0891b2 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={24} color="white" />
              </Box>
            }
            title={
              <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
                Próximos Passos
              </Typography>
            }
          />
          <CardContent>
            <RecommendationsCard analysis={analysis} />
          </CardContent>
        </Card>
      </Grid>

      {/* Botões de Ação */}
      <Grid size={{xs: 12}}>
        <ActionButtons />
      </Grid>
    </Grid>
  );
}