import { Card, CardHeader, CardContent, Stack, Box, Typography, Tooltip } from '@mui/material';
import { Clock, HelpCircle } from 'lucide-react';
import theme from '@/styles/theme';
import { SilenceAnalysis } from '@/domain/analysis/types/analysis';

interface SilencesDetailCardProps {
  silences: SilenceAnalysis;
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
    * Consideram-se &quot;pausas longas&quot; interrupções significativas no fluxo da fala (ex: &gt; 2s). Algumas pausas podem ser naturais dependendo do contexto.
  </Typography>
);

const SilencesTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 230 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Continuidade do Discurso
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.success.main }}>
        • <strong>Fluido:</strong> 0 - 2 pausas longas
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.info.main }}>
        • <strong>Moderado:</strong> 3 - 5 pausas longas
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.warning.main }}>
        • <strong>Hesitante:</strong> &gt; 5 pausas longas
      </Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
              Pausas e Silêncios
            </Typography>
            <Tooltip 
              title={<SilencesTooltipContent />} 
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