import { Card, CardHeader, CardContent, Box, Typography, Divider, Chip } from '@mui/material';
import { MessageSquare } from 'lucide-react';
import theme from '@/styles/theme';
import { FillerwordAnalysis } from '@/domain/analysis/types/analysis';

interface FillerWordsDetailCardProps {
  fillerWords: FillerwordAnalysis;
}

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
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Vícios de Linguagem
          </Typography>
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