'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  useTheme, 
  Chip, 
  Grid, 
  Stack, 
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
  Activity, 
  Volume2, 
  Mic2, 
  TrendingUp, 
  Minus, 
  AlertCircle, 
  LucideIcon, 
  HelpCircle,
  AudioWaveform,
  Zap
} from 'lucide-react';
import { ProsodyAnalysis, VocalQualityAnalysis } from '@/domain/analysis/types/analysis';

// --- Interfaces & Types ---

interface ChartPoint {
  time: number;
  value: number | null;
}

interface ProsodyAnalysisCardProps {
  prosodyData?: ProsodyAnalysis;
}

type FeedbackColor = 'success' | 'warning' | 'info' | 'error' | 'primary' | 'secondary' | 'purple';

interface FeedbackConfig {
  label: string;
  color: FeedbackColor;
  icon: LucideIcon;
  description?: string;
  unit?: string;
}

// Interface para as props injetadas pelo Recharts no Label da ReferenceLine
interface CustomReferenceLabelProps {
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  value: string;
  color: string;
}

// --- Interface Estrita para o Payload do Recharts ---
interface RechartsTooltipPayload {
  value: number | null;
  name?: string;
  dataKey?: string | number;
  payload: ChartPoint;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: number;
  unit: string;
}

// --- Componente de Aviso Reutilizável ---
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
    * Valores de referência aproximados. A avaliação ideal depende do contexto e do orador.
  </Typography>
);

// --- Conteúdo dos Tooltips (Legendas) ---
const PitchTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 220 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Variação de Entonação
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: '#ff9800' }}>• <strong>Monótona:</strong> &lt; 2.0 semitons</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#4caf50' }}>• <strong>Natural:</strong> 2.0 - 5.5 semitons</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#03a9f4' }}>• <strong>Muito Expressiva:</strong> &gt; 5.5 semitons</Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

const IntensityTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 220 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
      Dinâmica de Volume
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: '#fbff00ff' }}>• <strong>Estática:</strong> &lt; 3.0 dB</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#4caf50' }}>• <strong>Dinâmica:</strong> 3.0 - 8.0 dB</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#ff6600ff' }}>• <strong>Instável:</strong> &gt; 8.0 dB</Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

const JitterTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 240 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>Jitter (Estabilidade de Frequência)</Typography>
    <Typography variant="caption" paragraph sx={{ lineHeight: 1.3, opacity: 0.9 }}>
      Mede micro-flutuações na frequência da voz. Valores altos indicam aspereza ou falta de controle vibratório.
    </Typography>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
      Parâmetros
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: '#03a9f4' }}>• <strong>Excelente:</strong> &lt; 0.8%</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#4caf50' }}>• <strong>Normal:</strong> 0.8% - 1.5%</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#ff9800' }}>• <strong>Alterado:</strong> &gt; 1.5%</Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

const ShimmerTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 240 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>Shimmer (Estabilidade de Amplitude)</Typography>
    <Typography variant="caption" paragraph sx={{ lineHeight: 1.3, opacity: 0.9 }}>
      Mede micro-flutuações no volume da voz ciclo-a-ciclo. Valores altos podem indicar rouquidão ou soprosidade.
    </Typography>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
      Parâmetros
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: '#03a9f4' }}>• <strong>Excelente:</strong> &lt; 4%</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#4caf50' }}>• <strong>Normal:</strong> 4% - 7%</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#ff9800' }}>• <strong>Alterado:</strong> &gt; 7%</Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);

const HNRTooltipContent = () => (
  <Box sx={{ p: 0.5, maxWidth: 240 }}>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>HNR (Harmonic-to-Noise Ratio)</Typography>
    <Typography variant="caption" paragraph sx={{ lineHeight: 1.3, opacity: 0.9 }}>
      Relação entre o som harmônico (voz limpa) e ruído (ar/soprosidade). Quanto maior, mais limpa e definida é a voz.
    </Typography>
    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, pb: 0.5, borderBottom: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
      Parâmetros
    </Typography>
    <Stack spacing={0.5}>
      <Typography variant="caption" display="block" sx={{ color: '#ff9800' }}>• <strong>Ruidosa/Soprosa:</strong> &lt; 10 dB</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#4caf50' }}>• <strong>Normal:</strong> 10 - 18 dB</Typography>
      <Typography variant="caption" display="block" sx={{ color: '#03a9f4' }}>• <strong>Muito Límpida:</strong> &gt; 18 dB</Typography>
    </Stack>
    <DisclaimerText />
  </Box>
);


// --- Lógica de Feedback ---

const getPitchFeedback = (stdev: number): FeedbackConfig => {
  if (stdev < 2.0) return { label: 'Monótona', color: 'warning', icon: Minus, description: 'Variação abaixo de 2.0 semitons.' };
  if (stdev > 5.5) return { label: 'Muito Expressiva', color: 'info', icon: Activity, description: 'Variação acima de 5.5 semitons.' };
  return { label: 'Natural', color: 'success', icon: TrendingUp, description: 'Variação ideal (2.0 - 5.5 st).' };
};

const getIntensityFeedback = (stdev: number): FeedbackConfig => {
  if (stdev < 3.0) return { label: 'Estática', color: 'warning', icon: Minus, description: 'Variação abaixo de 3.0 dB.' };
  if (stdev > 8.0) return { label: 'Instável', color: 'warning', icon: AlertCircle, description: 'Variação excessiva (> 8.0 dB).' };
  return { label: 'Dinâmica', color: 'success', icon: TrendingUp, description: 'Boa modulação (3.0 - 8.0 dB).' };
};

const getJitterFeedback = (val: number): FeedbackConfig => {
  if (val < 0.8) return { label: 'Estável', color: 'success', icon: TrendingUp };
  if (val <= 1.5) return { label: 'Normal', color: 'success', icon: TrendingUp };
  return { label: 'Instável', color: 'warning', icon: AlertCircle };
};

const getShimmerFeedback = (val: number): FeedbackConfig => {
  if (val < 4.0) return { label: 'Estável', color: 'success', icon: TrendingUp };
  if (val <= 7.0) return { label: 'Normal', color: 'success', icon: TrendingUp };
  return { label: 'Instável', color: 'warning', icon: AlertCircle };
};

const getHNRFeedback = (val: number): FeedbackConfig => {
  if (val < 10.0) return { label: 'Ruidosa', color: 'warning', icon: AlertCircle };
  if (val <= 18.0) return { label: 'Normal', color: 'success', icon: TrendingUp };
  return { label: 'Límpida', color: 'info', icon: Zap };
};

// Label Customizado para a Linha de Média 
const CustomReferenceLabel = ({ viewBox, value, color }: CustomReferenceLabelProps) => {
  if (!viewBox) return null;

  const { x, y, width } = viewBox;
  const labelY = y - 10;
  const labelX = x + width;

  return (
    <g>
      <rect 
        x={labelX - 45} 
        y={labelY - 10} 
        width="50" 
        height="18" 
        rx="4" 
        fill="#120C18" 
        fillOpacity="0.8" 
      />
      <text 
        x={labelX - 20} 
        y={labelY + 2} 
        textAnchor="middle" 
        fill={color} 
        fontSize="10" 
        fontWeight="bold"
      >
        {value}
      </text>
    </g>
  );
};

// --- Tooltip do Gráfico ---

const CustomChartTooltip = ({ active, payload, label, unit }: CustomTooltipProps) => {
  const theme = useTheme();
  
  // Verificação segura de tipos e existência de dados
  if (active && payload && payload.length > 0) {
    const dataPoint = payload[0];
    
    if (dataPoint.value !== null && dataPoint.value !== undefined) {
      return (
        <Box
          sx={{
            bgcolor: '#120C18',
            p: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.5 }}>
            Tempo: {Number(label).toFixed(1)}s
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {Number(dataPoint.value).toFixed(1)} {unit}
          </Typography>
        </Box>
      );
    }
  }
  return null;
};

// --- Componentes de UI ---

const StatBox = ({ label, value, unit }: { label: string, value: string | number, unit: string }) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
      {value} <Typography component="span" variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{unit}</Typography>
    </Typography>
  </Box>
);

// CARD DE MÉTRICA SIMPLES (Jitter, Shimmer, HNR)
const MiniMetricItem = ({ 
  label, 
  value, 
  unit, 
  feedback, 
  tooltipContent 
}: { 
  label: string, 
  value: number, 
  unit: string, 
  feedback: FeedbackConfig,
  tooltipContent: React.ReactNode
}) => {
  const theme = useTheme();
  const feedbackColor = theme.palette[feedback.color].main;

  return (
    <Box sx={{ flex: 1, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, position: 'relative' }}>
       <Stack direction="row" alignItems="center" gap={0.5} mb={1}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.8rem' }}>
            {label}
          </Typography>
          <MuiTooltip 
            title={tooltipContent} 
            arrow 
            placement="top"
            componentsProps={{ tooltip: { sx: { bgcolor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' } } }}
          >
            <HelpCircle size={14} color="rgba(255,255,255,0.4)" style={{ cursor: 'help' }} />
          </MuiTooltip>
       </Stack>
       
       <Stack direction="row" alignItems="baseline" gap={0.5} mb={1}>
         <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
           {value.toFixed(2)}
         </Typography>
         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
           {unit}
         </Typography>
       </Stack>

       <Chip 
          label={feedback.label} 
          size="small" 
          sx={{ 
            bgcolor: `${feedbackColor}15`, 
            color: feedbackColor,
            fontWeight: 600,
            borderColor: `${feedbackColor}30`,
            border: 1,
            height: 20,
            fontSize: '0.65rem'
          }} 
        />
    </Box>
  );
};

// CARD DE QUALIDADE VOCAL
const VocalQualityCard = ({ data }: { data: VocalQualityAnalysis }) => {
  const theme = useTheme();
  
  const jitterFeedback = getJitterFeedback(data.jitter);
  const shimmerFeedback = getShimmerFeedback(data.shimmer);
  const hnrFeedback = getHNRFeedback(data.hnr);

  return (
    <Card sx={{ 
        height: '100%', 
        bgcolor: theme.palette.purple.light2, 
        borderRadius: 3, 
        border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
           <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${theme.palette.info.main}15`, color: theme.palette.info.main }}>
             <AudioWaveform size={20} />
           </Box>
           <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
             Qualidade Vocal
           </Typography>
        </Stack>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
           <MiniMetricItem 
              label="Jitter" 
              value={data.jitter} 
              unit="%" 
              feedback={jitterFeedback} 
              tooltipContent={<JitterTooltipContent />}
           />
           <MiniMetricItem 
              label="Shimmer" 
              value={data.shimmer} 
              unit="%" 
              feedback={shimmerFeedback} 
              tooltipContent={<ShimmerTooltipContent />}
           />
           <MiniMetricItem 
              label="HNR" 
              value={data.hnr} 
              unit="dB" 
              feedback={hnrFeedback} 
              tooltipContent={<HNRTooltipContent />}
           />
        </Stack>
      </CardContent>
    </Card>
  );
};

// CARD DE MÉTRICAS PRINCIPAL (PITCH/INTENSITY)
interface MetricInfoCardProps {
  title: string;
  icon: LucideIcon;
  colorKey: FeedbackColor;
  stats: { min: number; max: number; mean: number; stdev: number };
  feedback: FeedbackConfig;
  tooltipContent: React.ReactNode;
}

const MetricInfoCard = ({ title, icon: Icon, colorKey, stats, feedback, tooltipContent }: MetricInfoCardProps) => {
  const theme = useTheme();
  const baseColor = theme.palette[colorKey].main;
  const feedbackColor = theme.palette[feedback.color].main;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        bgcolor: theme.palette.purple.light2, 
        borderRadius: 3, 
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${baseColor}15`, color: baseColor }}>
              <Icon size={20} />
            </Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{title}</Typography>
          </Box>
          
          <MuiTooltip 
            title={tooltipContent} 
            arrow 
            placement="top"
            componentsProps={{ tooltip: { sx: { bgcolor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', maxWidth: 300 } } }}
          >
            <Chip 
              icon={<feedback.icon size={14} />} 
              label={feedback.label} 
              size="small" 
              sx={{ 
                bgcolor: `${feedbackColor}15`, 
                color: feedbackColor,
                fontWeight: 600,
                borderColor: `${feedbackColor}30`,
                border: 1,
                cursor: 'help',
                '& .MuiChip-label': { px: 1.5 },
                '& .MuiChip-icon': { color: 'inherit' }
              }} 
            />
          </MuiTooltip>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
             <Box sx={{ 
               p: 2, 
               bgcolor: 'rgba(0,0,0,0.2)', 
               borderRadius: 2, 
               height: '100%',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center'
             }}>
                <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Variação (Desvio)</Typography>
                    
                    <MuiTooltip 
                      title={tooltipContent} 
                      arrow 
                      placement="top"
                      componentsProps={{ tooltip: { sx: { bgcolor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' } } }}
                    >
                      <HelpCircle size={14} color="rgba(255,255,255,0.4)" style={{ cursor: 'help' }} />
                    </MuiTooltip>
                </Stack>
                <Typography variant="h4" sx={{ color: feedbackColor, fontWeight: 700 }}>
                   {stats.stdev.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{feedback.unit}</Typography>
             </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Stack spacing={2} justifyContent="center" height="100%">
               <StatBox label="Média" value={Math.round(stats.mean)} unit={title.includes('Pitch') ? 'Hz' : 'dB'} />
               <Stack direction="row" spacing={3}>
                  <StatBox label="Min" value={Math.round(stats.min)} unit={title.includes('Pitch') ? 'Hz' : 'dB'} />
                  <StatBox label="Max" value={Math.round(stats.max)} unit={title.includes('Pitch') ? 'Hz' : 'dB'} />
               </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// CARD DO GRÁFICO
interface ChartCardProps {
  data: ChartPoint[];
  color: string;
  title: string;
  unit: string;
  mean: number;
}

export const ChartCard = ({ 
  data, 
  color, 
  title, 
  unit, 
  mean 
}: ChartCardProps) => {
  const theme = useTheme();

  if (!data || !data.length) return null;

  const validValues = data
    .map(d => d.value)
    .filter((v): v is number => v !== null);
    
  const minVal = validValues.length ? Math.min(...validValues) : 0;
  const maxVal = validValues.length ? Math.max(...validValues) : 100;
  
  const padding = (maxVal - minVal) * 0.1;
  const minDomain = Math.max(0, minVal - padding);
  const maxDomain = maxVal + padding;

  // ID único para o gradiente evitar conflitos se houver múltiplos gráficos na tela
  const gradientId = `gradient-${title.replace(/\s+/g, '-')}`;

  return (
    <Card sx={{ 
      width: '100%', 
      bgcolor: theme.palette.background?.paper || '#1e1e1e',
      borderRadius: 3,
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ 
          color: 'rgba(255,255,255,0.5)', 
          mb: 2, 
          fontWeight: 600, 
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: 0.5
        }}>
          {title} - Evolução Temporal
        </Typography>
        
        <Box sx={{ height: 200, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              
              <XAxis 
                dataKey="time" 
                tickFormatter={(val: number) => `${Math.floor(val)}s`}
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                minTickGap={30}
                axisLine={false}
                tickLine={false}
              />
              
              <YAxis 
                domain={[minDomain, maxDomain]} 
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                width={55} 
                tickFormatter={(val: number) => val.toFixed(0)}
                axisLine={false}
                tickLine={false}
              />
              
              <RechartsTooltip 
                content={<CustomChartTooltip unit={unit} />}
                cursor={{ stroke: color, strokeWidth: 1.5, opacity: 0.5 }} 
                isAnimationActive={false} 
              />

              <ReferenceLine 
                y={mean} 
                stroke={color} 
                strokeDasharray="4 4" 
                strokeOpacity={0.8}
                label={<CustomReferenceLabel value="Média" color={color} />}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                fillOpacity={0.2}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

// --- Componente Principal ---

export function ProsodyAnalysisCard({ prosodyData }: ProsodyAnalysisCardProps) {
  const theme = useTheme();

  if (!prosodyData) return null;

  const { pitchAnalysis, intensityAnalysis, vocalQuality } = prosodyData;

  const pitchChartData = pitchAnalysis?.pitchContour 
    ? pitchAnalysis.pitchContour.map(p => ({ time: p.time, value: p.pitch }))
    : [];

  const intensityChartData = intensityAnalysis?.intensityContour 
    ? intensityAnalysis.intensityContour.map(i => ({ time: i.time, value: i.volume }))
    : [];

  const pitchFeedback = pitchAnalysis ? getPitchFeedback(pitchAnalysis.stdevPitchSemitones) : null;
  const intensityFeedback = intensityAnalysis ? getIntensityFeedback(intensityAnalysis.stdevIntensity) : null;

  return (
    <Grid container spacing={3}>
      
      {/* 1. METRICAS MACRO (PITCH E INTENSIDADE) */}
      {pitchAnalysis && pitchFeedback && (
        <Grid size={{ xs: 12, md: intensityAnalysis ? 6 : 12 }}>
          <MetricInfoCard 
            title="Entonação (Pitch)"
            icon={Mic2}
            colorKey="primary"
            stats={{
              min: pitchAnalysis.minPitch,
              max: pitchAnalysis.maxPitch,
              mean: pitchAnalysis.meanPitch,
              stdev: pitchAnalysis.stdevPitchSemitones
            }}
            feedback={{ ...pitchFeedback, unit: 'semitons' }}
            tooltipContent={<PitchTooltipContent />}
          />
        </Grid>
      )}

      {intensityAnalysis && intensityFeedback && (
        <Grid size={{ xs: 12, md: pitchAnalysis ? 6 : 12 }}>
          <MetricInfoCard 
             title="Volume (Intensidade)"
             icon={Volume2}
             colorKey="warning"
             stats={{
               min: intensityAnalysis.minIntensity,
               max: intensityAnalysis.maxIntensity,
               mean: intensityAnalysis.meanIntensity,
               stdev: intensityAnalysis.stdevIntensity
             }}
             feedback={{ ...intensityFeedback, unit: 'dB' }}
             tooltipContent={<IntensityTooltipContent />}
           />
        </Grid>
      )}

      {/* 2. NOVO CARD: QUALIDADE VOCAL (JITTER, SHIMMER, HNR) */}
      {vocalQuality && (
        <Grid size={{ xs: 12 }}>
          <VocalQualityCard data={vocalQuality} />
        </Grid>
      )}

      {/* 3. GRÁFICOS */}
      {pitchAnalysis && pitchChartData.length > 0 && (
        <Grid size={{ xs: 12 }}>
           <ChartCard 
             data={pitchChartData}
             color={theme.palette.primary.main}
             title="Curva de Entonação (Frequência)"
             unit="Hz"
             mean={pitchAnalysis.meanPitch}
           />
        </Grid>
      )}

      {intensityAnalysis && intensityChartData.length > 0 && (
        <Grid size={{ xs: 12 }}>
           <ChartCard 
             data={intensityChartData}
             color={theme.palette.warning.main}
             title="Curva de Intensidade (Volume)"
             unit="dB"
             mean={intensityAnalysis.meanIntensity}
           />
        </Grid>
      )}

    </Grid>
  );
}