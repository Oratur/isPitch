// frontend/src/components/features/SentimentTimelineChart.tsx
'use client';

import { Box, Card, CardContent, CardHeader, Typography, Tooltip } from '@mui/material';
import { Smile, Frown, Meh, BarChart2, Info } from 'lucide-react';
import { SentimentAnalysis, SentimentSegment } from '@/types/analysis';
import theme from '@/styles/theme'; // Importa o tema atualizado com a paleta purple

interface SentimentTimelineChartProps {
  sentimentAnalysis?: SentimentAnalysis;
}

// Mapeamento de sentimentos para cores e ícones (usando cores do tema)
// Mantém cores semânticas para a barra, mas usa tons definidos no tema
const sentimentStyles = {
  positivo: { color: theme.palette.success.light, icon: <Smile size={18} />, label: 'Positivo' },
  negativo: { color: theme.palette.error.light, icon: <Frown size={18} />, label: 'Negativo' },
  neutro: { color: theme.palette.grey[400], icon: <Meh size={18} />, label: 'Neutro' }, // Um cinza do tema
};

export function SentimentTimelineChart({ sentimentAnalysis }: SentimentTimelineChartProps) {
  if (!sentimentAnalysis || !sentimentAnalysis.timeline || sentimentAnalysis.timeline.length === 0) {
    return (
      // Usando variant='card1' para consistência, se aplicável ao Card em si
      <Card elevation={2} variant="card1" sx={{ height: '100%' }}>
        <CardHeader
          // Título usa a variante h1 customizada do tema
          title={<Typography variant="h1">Linha do Tempo de Sentimento</Typography>}
          avatar={<BarChart2 size={24} color={theme.palette.purple.light1} />} // Ícone usa purple.light1
          sx={{ bgcolor: theme.palette.purple.light2 }} // Fundo usa purple.light2
        />
        <CardContent>
          <Typography color="text.secondary" variant="body2">
            Dados de sentimento não disponíveis para esta análise.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const timeline = sentimentAnalysis.timeline;
  const totalDuration = timeline.reduce((max, seg) => Math.max(max, seg.endTime), 0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    // Usando variant='card1' para consistência, se aplicável ao Card em si
    <Card elevation={2} variant="card1">
      <CardHeader
        // Título usa a variante h1 customizada do tema
        title={<Typography variant="h1">Linha do Tempo de Sentimento</Typography>}
        avatar={<BarChart2 size={24} color={theme.palette.purple.light1} />} // Ícone usa purple.light1
        action={
          <Tooltip title="Variação do sentimento (positivo, negativo, neutro) identificado na fala ao longo do tempo.">
             {/* Ícone de info usa purple.light1 */}
            <Info size={20} style={{ marginRight: '0.5rem', color: theme.palette.purple.light1 }} />
          </Tooltip>
        }
        sx={{ bgcolor: theme.palette.purple.light2 }} // Fundo usa purple.light2
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Passe o mouse sobre a barra para ver detalhes de cada segmento.
        </Typography>
        <Box sx={{
          display: 'flex',
          width: '100%',
          height: 40,
          bgcolor: 'grey.200', // Mantém um fundo neutro para a barra
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid',
          borderColor: 'divider' // Usa a cor de divisão do tema
         }}
        >
          {timeline.map((segment, index) => {
            const style = sentimentStyles[segment.sentiment];
            const startTime = Math.max(0, segment.startTime);
            const endTime = Math.max(startTime, segment.endTime);
            const segmentDuration = endTime - startTime;
            const widthPercentage = totalDuration > 0 ? (segmentDuration / totalDuration) * 100 : 0;

            if (widthPercentage <= 0) return null;

            return (
              <Tooltip
                key={index}
                title={
                  <>
                    <Typography variant="caption" component="div">
                      {formatTime(startTime)} - {formatTime(endTime)} ({segmentDuration.toFixed(1)}s)
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
                    bgcolor: style.color, // Cores da barra (success.light, error.light, grey[400])
                    transition: 'filter 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      filter: 'brightness(1.15)',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.2)',
                      zIndex: 1
                    },
                    borderRight: index < timeline.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                    position: 'relative'
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
        {/* Legenda */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          {Object.entries(sentimentStyles).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: value.color, borderRadius: '50%' }} />
              <Typography variant="caption">{value.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}