import { Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import { Lightbulb } from 'lucide-react';
import theme from '@/styles/theme';
import { VocabularySuggestion } from '@/domain/analysis/types/analysis';

interface VocabularySuggestionsCardProps {
  suggestions: VocabularySuggestion[];
}

export function VocabularySuggestionsCard({ suggestions }: VocabularySuggestionsCardProps) {
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
            <Lightbulb size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Sugestões de Vocabulário
          </Typography>
        }
      />
      <CardContent>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.purple.light1, 
            mb: 2,
            animation: 'fadeIn 0.8s ease-out 1s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 }
            }
          }}
        >
          Palavras repetidas com frequência:
        </Typography>
        
        {suggestions.length > 0 ? (
          <List dense>
            {suggestions.map((suggestion, idx) => (
              <ListItem 
                key={idx}
                sx={{ 
                  bgcolor: theme.palette.purple.dark,
                  borderRadius: 1,
                  mb: 1,
                  p: 1.5,
                  animation: `slideInRight 0.5s ease-out ${1.2 + idx * 0.1}s both`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    bgcolor: theme.palette.purple.dark + 'CC',
                    boxShadow: `0 4px 12px ${theme.palette.warning.main}20`
                  },
                  '@keyframes slideInRight': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateX(-30px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateX(0)'
                    }
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 0.5 
                    }}>
                      <Typography sx={{ color: theme.palette.purple.contrastText, fontWeight: 600 }}>
                        {suggestion.word}
                      </Typography>
                      <Chip 
                        label={`${suggestion.count}x`} 
                        size="small"
                        sx={{ 
                          bgcolor: theme.palette.warning.main + '20',
                          color: theme.palette.warning.main,
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' }
                          }
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
                      Alternativas: {suggestion.alternatives.join(', ')}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              animation: 'fadeIn 0.8s ease-out 1.2s both'
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
              Nenhuma repetição excessiva detectada. Ótimo uso do vocabulário! 🎉
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}