// src/components/features/analysis-results/speech/SentimentDetailCard.tsx
import { Card, CardHeader, CardContent, Box, Typography, Divider } from '@mui/material';
import { HeartPulse } from 'lucide-react';
import theme from '@/styles/theme';
import { SentimentAnalysis } from '@/domain/analysis/types/analysis';
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SentimentDetailCardProps {
  sentimentAnalysis?: SentimentAnalysis;
}

export function SentimentDetailCard({ sentimentAnalysis }: SentimentDetailCardProps) {
  // 1. Determinar o sentimento predominante
  const getDominantSentiment = () => {
    if (!sentimentAnalysis?.timeline || sentimentAnalysis.timeline.length === 0) {
      return { label: 'Indisponível', color: theme.palette.grey[500] };
    }

    const counts = { positivo: 0, negativo: 0, neutro: 0 };
    sentimentAnalysis.timeline.forEach(seg => {
      if (seg.sentiment === 'positivo') counts.positivo++;
      else if (seg.sentiment === 'negativo') counts.negativo++;
      else counts.neutro++;
    });

    if (counts.positivo > counts.negativo && counts.positivo > counts.neutro) {
      return { label: 'Predominantemente Positivo', color: theme.palette.success.main };
    }
    if (counts.negativo > counts.positivo && counts.negativo > counts.neutro) {
      return { label: 'Predominantemente Negativo', color: theme.palette.error.main };
    }
    return { label: 'Tom Neutro / Equilibrado', color: theme.palette.info.main };
  };

  const dominant = getDominantSentiment();

  const sentimentColors: Record<string, string> = {
    positivo: theme.palette.success.main,
    negativo: theme.palette.error.main,
    neutro: theme.palette.grey[400],
  };

  // 2. Preparar dados da timeline (agora com nome formatado para o eixo X)
  const chartData = sentimentAnalysis?.timeline.map((seg) => ({
    score: seg.score,
    sentiment: seg.sentiment,
    // Formata tempo mm:ss para o eixo
    time: `${Math.floor(seg.startTime / 60)}:${Math.floor(seg.startTime % 60).toString().padStart(2, '0')}`,
  })) || [];

  return (
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2, 
        height: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${dominant.color}40`,
        }
      }}
    >
      <CardHeader
        avatar={
          <Box>
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
        {/* Texto de Predominância */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: dominant.color, 
              fontWeight: 700,
              fontSize: '1.25rem',
              lineHeight: 1.2
            }}
          >
            {dominant.label}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, bgcolor: theme.palette.purple.light1 + '20' }} />

        {/* Gráfico de Timeline com Eixos */}
        <Box sx={{ width: '100%', height: 180 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke={theme.palette.purple.light1 + '20'} 
                />
                
                <XAxis 
                  dataKey="time" 
                  stroke={theme.palette.purple.light1} 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd" // Evita sobreposição se houver muitos segmentos
                />
                
                <YAxis 
                  stroke={theme.palette.purple.light1} 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  // Formata como porcentagem simples (0.8 -> 80%)
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <Box sx={{ 
                          bgcolor: theme.palette.purple.dark, 
                          border: `1px solid ${theme.palette.purple.light1}`,
                          p: 1, 
                          borderRadius: 1,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                          <Typography variant="caption" sx={{ color: '#fff', display: 'block', fontWeight: 'bold' }}>
                            {data.time}
                          </Typography>
                          <Typography variant="caption" sx={{ color: sentimentColors[data.sentiment] }}>
                            {data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1)}: {(data.score * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={sentimentColors[entry.sentiment] || sentimentColors.neutro} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                Sem dados disponíveis
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Legenda Simples */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.65rem' }}>Positivo</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.grey[400] }} />
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.65rem' }}>Neutro</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.65rem' }}>Negativo</Typography>
            </Box>
        </Box>
      </CardContent>
    </Card>
  );
}