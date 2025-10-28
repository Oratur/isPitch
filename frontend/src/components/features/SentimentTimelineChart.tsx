// frontend/src/components/features/SentimentTimelineChart.tsx
'use client';

import { Box, Card, CardContent, CardHeader, Typography, Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentAnalysis, SentimentSegment } from '@/types/analysis';

interface SentimentTimelineChartProps {
  sentimentAnalysis?: SentimentAnalysis;
}

// Mapeamento de sentimentos para cores e ícones
const sentimentStyles = {
  positivo: { color: 'success.main', icon: <TrendingUp size={18} />, label: 'Positivo' },
  negativo: { color: 'error.main', icon: <TrendingDown size={18} />, label: 'Negativo' },
  neutro: { color: 'grey.500', icon: <Minus size={18} />, label: 'Neutro' },
};

export function SentimentTimelineChart({ sentimentAnalysis }: SentimentTimelineChartProps) {
  if (!sentimentAnalysis || !sentimentAnalysis.timeline || sentimentAnalysis.timeline.length === 0) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
        <CardHeader title={<Typography variant="h6">Linha do Tempo de Sentimento</Typography>} sx={{ bgcolor: 'grey.100' }} />
        <CardContent>
          <Typography color="text.secondary">
            Dados de sentimento não disponíveis para esta análise.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const timeline = sentimentAnalysis.timeline;
  const totalDuration = timeline[timeline.length - 1].endTime; // Duração total baseada no último segmento

  // Função para formatar o tempo em MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardHeader title={<Typography variant="h6">Linha do Tempo de Sentimento</Typography>} sx={{ bgcolor: 'grey.100' }} />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Visualização da variação do sentimento (positivo, negativo, neutro) ao longo do áudio.
        </Typography>
        <Box sx={{ display: 'flex', width: '100%', height: 60, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
          {timeline.map((segment, index) => {
            const style = sentimentStyles[segment.sentiment];
            const segmentDuration = segment.endTime - segment.startTime;
            const widthPercentage = totalDuration > 0 ? (segmentDuration / totalDuration) * 100 : 0;

            return (
              <Tooltip
                key={index}
                title={
                  <>
                    <Typography variant="caption" component="div">
                      {formatTime(segment.startTime)} - {formatTime(segment.endTime)} ({segmentDuration.toFixed(1)}s)
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {style.icon} {style.label} (Score: {segment.score.toFixed(2)})
                    </Typography>
                  </>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    width: `${widthPercentage}%`,
                    height: '100%',
                    bgcolor: style.color,
                    transition: 'filter 0.2s',
                    '&:hover': {
                      filter: 'brightness(1.2)',
                      cursor: 'pointer'
                    },
                    // Adiciona uma pequena borda entre os segmentos
                    borderRight: index < timeline.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
        {/* Legenda simples */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {Object.entries(sentimentStyles).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 14, height: 14, bgcolor: value.color, borderRadius: '50%' }} />
              <Typography variant="caption">{value.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}