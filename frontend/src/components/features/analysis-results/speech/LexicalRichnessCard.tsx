import { Card, CardHeader, CardContent, Box, Typography, LinearProgress, Stack } from '@mui/material';
import { BookOpen } from 'lucide-react';
import theme from '@/styles/theme';
import { LexicalRichnessAnalysis } from '@/domain/analysis/types/analysis';

interface LexicalRichnessCardProps {
  lexicalRichness: LexicalRichnessAnalysis;
}

export function LexicalRichnessCard({ lexicalRichness }: LexicalRichnessCardProps) {
  const ratio = lexicalRichness.typeTokenRatio;
  const isGood = ratio > 50;

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${theme.palette.purple.main}40`,
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
            <BookOpen size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Riqueza Lexical
          </Typography>
        }
      />
      <CardContent>
        <Box 
          sx={{ 
            mb: 3,
            animation: 'fadeIn 0.8s ease-out 0.9s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
              Diversidade de Vocabulário
            </Typography>
            <Typography variant="body2" sx={{ 
              color: isGood ? theme.palette.success.main : theme.palette.warning.main,
              fontWeight: 600
            }}>
              {ratio.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={ratio}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: theme.palette.purple.dark,
              '& .MuiLinearProgress-bar': {
                bgcolor: isGood ? theme.palette.success.main : theme.palette.warning.main,
                borderRadius: 4,
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 1.1s',
                transformOrigin: 'left'
              }
            }}
          />
        </Box>
        
        <Stack 
          direction="row" 
          spacing={3} 
          sx={{ 
            mb: 2,
            animation: 'fadeIn 0.8s ease-out 1.3s both'
          }}
        >
          <Box 
            sx={{ 
              flex: 1, 
              textAlign: 'center', 
              p: 2, 
              bgcolor: theme.palette.purple.dark, 
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.purple.main, 
                fontWeight: 700,
                animation: 'countUp 1s ease-out 1.5s both',
                '@keyframes countUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.5)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)'
                  }
                }
              }}
            >
              {lexicalRichness.uniqueWords}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
              Palavras Únicas
            </Typography>
          </Box>
          <Box 
            sx={{ 
              flex: 1, 
              textAlign: 'center', 
              p: 2, 
              bgcolor: theme.palette.purple.dark, 
              borderRadius: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.purple.main, 
                fontWeight: 700,
                animation: 'countUp 1s ease-out 1.7s both',
                '@keyframes countUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.5)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)'
                  }
                }
              }}
            >
              {lexicalRichness.totalWords}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
              Palavras Totais
            </Typography>
          </Box>
        </Stack>

        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.purple.light1, 
            display: 'block', 
            textAlign: 'center',
            animation: 'fadeIn 0.8s ease-out 1.9s both'
          }}
        >
          {isGood 
            ? 'Excelente variedade de vocabulário! Continue assim.' 
            : 'Tente usar palavras mais variadas para enriquecer sua fala.'}
        </Typography>
      </CardContent>
    </Card>
  );
}