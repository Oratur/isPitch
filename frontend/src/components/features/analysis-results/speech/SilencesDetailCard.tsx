import { Card, CardHeader, CardContent, Stack, Box, Typography } from '@mui/material';
import { Clock } from 'lucide-react';
import theme from '@/styles/theme';
import { SilenceAnalysis } from '@/domain/analysis/types/analysis';

interface SilencesDetailCardProps {
  silences: SilenceAnalysis;
}

export function SilencesDetailCard({ silences }: SilencesDetailCardProps) {
  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
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
          <Box>
            <Clock size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Pausas e Silêncios
          </Typography>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1, mb: 0.5 }}>
              Pausas Longas
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.info.main, 
                fontWeight: 700,
              }}
            >
              {silences.pauses}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1, mb: 0.5 }}>
              Tempo Total em Pausa
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.info.main, 
                fontWeight: 700,
              }}
            >
              {silences.duration.toFixed(2)}s
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}