import { Card, CardHeader, CardContent, Box, Typography, Divider, Stack, Tooltip } from '@mui/material';
import { BarChart3, TrendingUp, TrendingDown, Award, HelpCircle } from 'lucide-react';
import theme from '@/styles/theme';

interface SpeechRateDetailCardProps {
  speechRate: number;
}

const DisclaimerText = () => (
  <Typography 
    variant="caption" 
    display="block" 
    sx={{ 
      mt: 1.5, 
      pt: 1, 
      borderTop: '1px solid rgba(255,255,255,0.1)', 
      color: 'rgba(255,255,255,0.5)', 
      fontSize: '0.65rem',
      fontStyle: 'italic',
      lineHeight: 1.3
    }}
  >
    * Valores de referência para apresentações. O ritmo ideal pode variar conforme o contexto.
  </Typography>
);

const SpeechRateTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 220 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Ritmo da Fala (PPM)
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.warning.main }}>
        • <strong>Lento:</strong> &lt; 100 PPM
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.success.main }}>
        • <strong>Ideal:</strong> 100 - 160 PPM
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.warning.main }}>
        • <strong>Rápido:</strong> &gt; 160 PPM
      </Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

export function SpeechRateDetailCard({ speechRate }: SpeechRateDetailCardProps) {
  const getSpeechRateFeedback = (rate: number) => {
    if (rate < 100) {
      return { 
        text: 'Ritmo abaixo do ideal. Tente falar um pouco mais rápido.', 
        icon: <TrendingDown size={20} />, 
        color: theme.palette.warning.main 
      };
    }
    if (rate > 160) {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
              Ritmo da Fala
            </Typography>
            
            {/* Tooltip adicionado aqui */}
            <Tooltip 
              title={<SpeechRateTooltipContent />} 
              arrow 
              placement="top"
              componentsProps={{ 
                tooltip: { 
                  sx: { 
                    bgcolor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)' 
                  } 
                } 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'help' }}>
                <HelpCircle size={16} color={theme.palette.purple.light1} style={{ opacity: 0.7 }} />
              </Box>
            </Tooltip>
          </Box>
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