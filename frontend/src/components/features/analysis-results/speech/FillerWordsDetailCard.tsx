import { Card, CardHeader, CardContent, Box, Typography, Divider, Chip, Stack, Tooltip } from '@mui/material';
import { HelpCircle, MessageSquare } from 'lucide-react';
import theme from '@/styles/theme';
import { FillerwordAnalysis } from '@/domain/analysis/types/analysis';

interface FillerWordsDetailCardProps {
  fillerWords: FillerwordAnalysis;
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
    * Termos como &quot;tipo&quot;, &quot;né&quot;, &quot;ahn&quot; que quebram a fluidez do discurso. Algumas ocorrências podem ser naturais dependendo do contexto.
  </Typography>
);

const FillerWordsTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 220 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Parâmetros de Fluidez
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.success.main }}>
        • <strong>Excelente:</strong> 0 vícios
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.success.main }}>
        • <strong>Aceitável:</strong> 1 - 5 vícios
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: theme.palette.warning.main }}>
        • <strong>Excessivo:</strong> &gt; 5 vícios
      </Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

export function FillerWordsDetailCard({ fillerWords }: FillerWordsDetailCardProps) {
  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
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
          <Box>
            <MessageSquare size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
              Vícios de Linguagem
            </Typography>
            <Tooltip 
              title={<FillerWordsTooltipContent />} 
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
              color: fillerWords.total > 5 
                ? theme.palette.warning.main 
                : theme.palette.success.main,
              fontWeight: 700,
            }}
          >
            {fillerWords.total}
            <Typography component="span" variant="h6" sx={{ ml: 1, color: theme.palette.purple.light1 }}>
              detectados
            </Typography>
          </Typography>
        </Box>
        <Divider sx={{ my: 2, bgcolor: theme.palette.purple.light1 + '20' }} />
        <Box>
          {Object.entries(fillerWords.distribution).length > 0 ? (
            Object.entries(fillerWords.distribution).map(([word, count], idx) => (
              <Box 
                key={word} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1, 
                  alignItems: 'center',
                  animation: `slideIn 0.5s ease-out ${0.8 + idx * 0.1}s both`,
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
                <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
                  {word}
                </Typography>
                <Chip 
                  label={count} 
                  size="small"
                  sx={{ 
                    bgcolor: theme.palette.warning.main + '20',
                    color: theme.palette.warning.main,
                    fontWeight: 600
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1, textAlign: 'center' }}>
              Nenhum vício detectado! 🎉
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}