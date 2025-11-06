import { Card, CardHeader, CardContent, Typography, Box, Chip, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BarChart2, TrendingUp, Calendar, Download } from 'lucide-react';
import theme from '@/styles/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from 'react';
import { ChartData } from '@/domain/dashboard/types';


interface AnalysisChartProps {
  data?: ChartData[];
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: ChartData;
    }>;
}

export function AnalysisChart({ data }: AnalysisChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  // Dados de exemplo caso não haja dados
  const defaultData: ChartData[] = [
    { name: 'Jan', analyses: 0 },
    { name: 'Fev', analyses: 0 },
    { name: 'Mar', analyses: 0 },
    { name: 'Abr', analyses: 0 },
    { name: 'Mai', analyses: 0 },
    { name: 'Jun', analyses: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const totalAnalyses = chartData.reduce((sum, item) => sum + item.analyses, 0);
  const avgAnalyses = totalAnalyses / chartData.length;
  const maxMonth = chartData.reduce((max, item) => item.analyses > max.analyses ? item : max, chartData[0]);
  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growth = previousMonth && previousMonth.analyses !== 0
  ? ((currentMonth.analyses - previousMonth.analyses) / previousMonth.analyses * 100)
  : 0;

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: theme.palette.purple.dark,
            border: `2px solid ${theme.palette.purple.main}`,
            borderRadius: 2,
            p: 1.5,
            boxShadow: `0 8px 24px ${theme.palette.purple.main}40`,
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.purple.light1, mb: 0.5, fontWeight: 600 }}>
            {payload[0].payload.name}
          </Typography>
          <Typography variant="h6" sx={{ color: theme.palette.purple.main, fontWeight: 700 }}>
            {payload[0].value} análises
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: 'line' | 'area' | null) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  return (
    <Card 
      variant="card1" 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${theme.palette.purple.main}30`,
          '& .chart-controls': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${theme.palette.purple.main}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.purple.main} 0%, #9333EA 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart2 size={20} color="white" />
              </Box>
              <Typography variant="h1">
                Gráfico de Atividade
              </Typography>
            </Box>

            <ToggleButtonGroup
              className="chart-controls"
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              sx={{
                opacity: 0.6,
                transform: 'translateY(-5px)',
                transition: 'all 0.3s ease',
                '& .MuiToggleButton-root': {
                  color: theme.palette.purple.light1,
                  borderColor: theme.palette.purple.light1 + '40',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.75rem',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.purple.main + '30',
                    color: theme.palette.purple.main,
                    borderColor: theme.palette.purple.main,
                  }
                }
              }}
            >
              <ToggleButton value="line">Linha</ToggleButton>
              <ToggleButton value="area">Área</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        }
        sx={{ bgcolor: theme.palette.purple.light2, pb: 1 }}
      />
      
      <CardContent>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mb: 3,
            p: 2,
            bgcolor: theme.palette.purple.dark + '60',
            borderRadius: 2,
            border: `1px solid ${theme.palette.purple.light1}20`,
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1, display: 'block', mb: 0.5 }}>
              Total no Período
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.purple.main, fontWeight: 700 }}>
              {totalAnalyses}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              width: 1, 
              bgcolor: theme.palette.purple.light1 + '20',
              alignSelf: 'stretch'
            }} 
          />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1, display: 'block', mb: 0.5 }}>
              Média Mensal
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.info.main, fontWeight: 700 }}>
              {avgAnalyses.toFixed(1)}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              width: 1, 
              bgcolor: theme.palette.purple.light1 + '20',
              alignSelf: 'stretch'
            }} 
          />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1, display: 'block', mb: 0.5 }}>
              Mês com Mais
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
              {maxMonth.name}
            </Typography>
          </Box>

          <Box 
            sx={{ 
              width: 1, 
              bgcolor: theme.palette.purple.light1 + '20',
              alignSelf: 'stretch'
            }} 
          />

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
                Crescimento
              </Typography>
              <TrendingUp 
                size={14} 
                color={growth >= 0 ? theme.palette.success.main : theme.palette.error.main} 
              />
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: growth >= 0 ? theme.palette.success.main : theme.palette.error.main,
                fontWeight: 700 
              }}
            >
              {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
            </Typography>
          </Box>
        </Stack>

        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAnalises" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.purple.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.purple.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.purple.light1 + '20'} 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke={theme.palette.purple.light1}
                style={{ fontSize: '0.875rem' }}
                tick={{ fill: theme.palette.purple.light1 }}
              />
              <YAxis 
                stroke={theme.palette.purple.light1}
                style={{ fontSize: '0.875rem' }}
                tick={{ fill: theme.palette.purple.light1 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="analyses" 
                stroke={theme.palette.purple.main}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAnalises)"
                dot={{ 
                  fill: theme.palette.purple.main, 
                  r: 5,
                  strokeWidth: 2,
                  stroke: theme.palette.purple.dark
                }}
                activeDot={{ 
                  r: 8,
                  fill: theme.palette.purple.main,
                  stroke: 'white',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.purple.light1 + '20'}
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke={theme.palette.purple.light1}
                style={{ fontSize: '0.875rem' }}
                tick={{ fill: theme.palette.purple.light1 }}
              />
              <YAxis 
                stroke={theme.palette.purple.light1}
                style={{ fontSize: '0.875rem' }}
                tick={{ fill: theme.palette.purple.light1 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="analyses" 
                stroke={theme.palette.purple.main}
                strokeWidth={3}
                dot={{ 
                  fill: theme.palette.purple.main, 
                  r: 5,
                  strokeWidth: 2,
                  stroke: theme.palette.purple.dark
                }}
                activeDot={{ 
                  r: 8,
                  fill: theme.palette.purple.main,
                  stroke: 'white',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        <Box 
          sx={{ 
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${theme.palette.purple.light1}20`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} color={theme.palette.purple.light1} />
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
              Últimos 12 meses
            </Typography>
          </Box>

          <Chip
            icon={<Download size={14} />}
            label="Exportar"
            size="small"
            sx={{
              bgcolor: theme.palette.purple.main + '20',
              color: theme.palette.purple.main,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: theme.palette.purple.main + '40',
                transform: 'translateY(-2px)',
              },
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}