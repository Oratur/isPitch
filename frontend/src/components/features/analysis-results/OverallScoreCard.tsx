import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import theme from '@/styles/theme';
import { Analysis } from '@/domain/analysis/types/analysis';
import { calculateOverallScore, getScoreColor, getScoreLabel } from '@/domain/analysis/utils/scoreCalculator';


interface OverallScoreCardProps {
  analysis: Analysis;
}

export function OverallScoreCard({ analysis }: OverallScoreCardProps) {
  const overallScore = calculateOverallScore(analysis);
  const scoreColor = getScoreColor(overallScore);
  const scoreLabel = getScoreLabel(overallScore);

  return (
    <Card 
      sx={{ 
        mb: 4,
        bgcolor: theme.palette.purple.light2,
        border: `2px solid ${scoreColor}40`,
        position: 'relative',
        overflow: 'visible',
        animation: 'fadeInUp 0.6s ease-out',
        '@keyframes fadeInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: scoreColor,
          color: 'white',
          px: 4,
          py: 1,
          borderRadius: 3,
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: `0 8px 24px ${scoreColor}60`,
          zIndex: 10,
          animation: 'scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both',
          '@keyframes scaleIn': {
            '0%': {
              opacity: 0,
              transform: 'translateX(-50%) scale(0.5)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(-50%) scale(1)'
            }
          }
        }}
      >
        {overallScore}% • {scoreLabel}
      </Box>
      
      <CardContent sx={{ pt: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.purple.light1, 
              mb: 1,
              animation: 'fadeIn 0.8s ease-out 0.4s both',
              '@keyframes fadeIn': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
          >
            Pontuação Geral de Oratória
          </Typography>
          <Box
            sx={{
              position: 'relative',
              animation: 'fadeIn 1s ease-out 0.6s both'
            }}
          >
            <LinearProgress 
              variant="determinate" 
              value={overallScore}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: theme.palette.purple.dark,
                '& .MuiLinearProgress-bar': {
                  bgcolor: scoreColor,
                  borderRadius: 6,
                  transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
                  transformOrigin: 'left'
                }
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}