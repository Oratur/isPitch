import { Card, CardHeader, CardContent, Box, Typography, Divider } from '@mui/material';
import { Smile, Frown, Meh, HeartPulse } from 'lucide-react';
import theme from '@/styles/theme';
import { SentimentAnalysis } from '@/domain/analysis/types/analysis';

interface SentimentDetailCardProps {
  sentimentAnalysis?: SentimentAnalysis;
}

export function SentimentDetailCard({ sentimentAnalysis }: SentimentDetailCardProps) {
  const getDominantSentiment = () => {
    if (!sentimentAnalysis?.timeline) return { label: 'Indisponível', icon: <Meh size={20} />, color: theme.palette.grey[500] };

    const counts = { positivo: 0, negativo: 0, neutro: 0 };
    
    sentimentAnalysis.timeline.forEach(seg => {
      if (seg.sentiment in counts) {
        counts[seg.sentiment as keyof typeof counts]++;
      }
    });

    // Encontra o maior valor
    if (counts.positivo > counts.negativo && counts.positivo > counts.neutro) {
      return { label: 'Predominantemente Positivo', icon: <Smile size={20} />, color: theme.palette.success.main };
    }
    if (counts.negativo > counts.positivo && counts.negativo > counts.neutro) {
      return { label: 'Predominantemente Negativo', icon: <Frown size={20} />, color: theme.palette.error.main };
    }
    return { label: 'Tom Neutro/Equilibrado', icon: <Meh size={20} />, color: theme.palette.info.main };
  };

  const sentiment = getDominantSentiment();

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${sentiment.color}40`,
          '& .icon-container': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        }
      }}
    >
      <CardHeader
        avatar={
          <Box>
            {/* Ícone genérico de "Sentimento/Emoção" para o cabeçalho */}
            <HeartPulse size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Tom da Fala
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: sentiment.color, 
              fontWeight: 700,
              fontSize: '1.8rem !important' // Ajuste de tamanho para caber texto
            }}
          >
             {/* Mostra apenas a primeira palavra (Positivo/Negativo/Neutro) em destaque */}
             {sentiment.label.split(' ').pop()}
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
          <Box sx={{ color: sentiment.color }}>
            {sentiment.icon}
          </Box>
          <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
            {sentiment.label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}