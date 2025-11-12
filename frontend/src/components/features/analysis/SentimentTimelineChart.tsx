'use client';

import { Box, Card, CardContent, CardHeader, Typography, Tooltip, Paper } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Smile, Frown, Meh, BarChart2, Info } from 'lucide-react';
import { SentimentAnalysis, SentimentSegment } from '@/domain/analysis/types/analysis';
import theme from '@/styles/theme'; 

interface SentimentTimelineChartProps {
  sentimentAnalysis?: SentimentAnalysis;
}

const sentimentStyles: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  positivo: { color: theme.palette.success.light, icon: <Smile size={18} />, label: 'Positivo' },
  negativo: { color: theme.palette.error.light, icon: <Frown size={18} />, label: 'Negativo' },
  neutro: { color: theme.palette.grey[400], icon: <Meh size={18} />, label: 'Neutro' },
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; 
    const style = sentimentStyles[data.sentiment];

    return (
      <Paper elevation={3} sx={{ padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.95)', color: '#000' }}>
        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
          {}
          Início: {label}
        </Typography>
        <Typography variant="caption" component="div">
          Duração: {(data.endTime - data.startTime).toFixed(1)}s
        </Typography>
        <Typography variant="caption" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: style.color }}>
          {style.icon}
          {style.label} (Score: {data.score.toFixed(2)})
        </Typography>
      </Paper>
    );
  }
  return null;
};


export function SentimentTimelineChart({ sentimentAnalysis }: SentimentTimelineChartProps) {
  if (!sentimentAnalysis || !sentimentAnalysis.timeline || sentimentAnalysis.timeline.length === 0) {
    return (
      <Card elevation={2} variant="card1" sx={{ height: '100%' }}>
        <CardHeader
          title={<Typography variant="h1">Linha do Tempo de Sentimento</Typography>}
          avatar={<BarChart2 size={24} color={theme.palette.purple.light1} />}
          sx={{ bgcolor: theme.palette.purple.light2 }}
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

  const chartData = timeline.map(segment => ({
    name: formatTime(segment.startTime), 
    score: segment.score,
    sentiment: segment.sentiment,
    startTime: segment.startTime,
    endTime: segment.endTime,
  }));

  return (
    <Card elevation={2} variant="card1">
      <CardHeader
        title={<Typography variant="h1">Linha do Tempo de Sentimento</Typography>}
        avatar={<BarChart2 size={24} color={theme.palette.purple.light1} />}
        action={
          <Tooltip title="Gráfico de barras do score (altura) de sentimento ao longo do tempo (eixo x).">
            <Info size={20} style={{ marginRight: '0.5rem', color: theme.palette.purple.light1 }} />
          </Tooltip>
        }
        sx={{ bgcolor: theme.palette.purple.light2 }}
      />
      <CardContent>
        {}
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 5, 
                left: -25, 
                bottom: 5,
              }}
            >
              {}
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke={theme.palette.grey[700]} />
              
              {}
              <XAxis 
                dataKey="name" 
                stroke={theme.palette.text.secondary} 
                fontSize="0.75rem" 
              />
              
              {}
              <YAxis 
                domain={[0, 1]} 
                stroke={theme.palette.text.secondary} 
                fontSize="0.75rem" 
              />
              
              {}
              <RechartsTooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: 'rgba(186, 155, 218, 0.1)' }} 
              />
              
              {}
              <Bar dataKey="score">
                {}
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={sentimentStyles[entry.sentiment].color} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        
        {}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
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