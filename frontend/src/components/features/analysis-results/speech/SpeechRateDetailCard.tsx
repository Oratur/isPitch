import { Card, CardHeader, CardContent, Box, Typography, Divider } from '@mui/material';
import { BarChart3, TrendingUp, TrendingDown, Award } from 'lucide-react';
import theme from '@/styles/theme';

interface SpeechRateDetailCardProps {
  speechRate: number;
}

export function SpeechRateDetailCard({ speechRate }: SpeechRateDetailCardProps) {
  const getSpeechRateFeedback = (rate: number) => {
    if (rate < 130) {
      return { 
        text: 'Ritmo abaixo do ideal. Tente falar um pouco mais rápido.', 
        icon: <TrendingDown size={20} />, 
        color: theme.palette.warning.main 
      };
    }
    if (rate > 170) {
      return { 
        text: 'Ritmo acima do ideal. Tente falar um pouco mais devagar.', 
        icon: <TrendingUp size={20} />, 
        color: theme.palette.warning.main 
      };
    }
    return { 
      text: 'Ritmo ideal para apresentações!', 
      icon: <Award size={20} />, 
      color: theme.palette.success.main 
    };
  };

  const feedback = getSpeechRateFeedback(speechRate);

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${feedback.color}40`,
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
          <Box>
            <BarChart3 size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Ritmo da Fala
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: feedback.color, 
              fontWeight: 700,
            }}
          >
            {Math.round(speechRate)}
            <Typography component="span" variant="h6" sx={{ ml: 1, color: theme.palette.purple.light1 }}>
              PPM
            </Typography>
          </Typography>
        </Box>
        <Divider sx={{ my: 2, bgcolor: theme.palette.purple.light1 + '20' }} />
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            justifyContent: 'center',
          }}
        >
          {feedback.icon}
          <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
            {feedback.text}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}