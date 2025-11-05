import { Grid, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Mic, Clock, BarChart3 } from 'lucide-react';
import theme from '@/styles/theme';
import { DashboardStats } from '@/domain/dashboard/types';

interface StatsCardsProps {
  stats?: DashboardStats;
}

interface StatCardData {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: string;
  bgGradient: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  const statsData: StatCardData[] = [
    {
      icon: <BarChart3 size={32} />,
      value: stats.totalAnalyses || 0,
      label: 'Total de Análises',
      trend: {
        value: '+3 esta semana',
        isPositive: true
      },
      color: theme.palette.purple.main,
      bgGradient: 'linear-gradient(135deg, #7F13EC 0%, #9333EA 100%)'
    },
    {
      icon: <Mic size={32} />,
      value: stats.totalFillerWords || 0,
      label: 'Vícios Detectados',
      trend: {
        value: '-12 vs mês anterior',
        isPositive: true
      },
      color: theme.palette.warning.main,
      bgGradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
    },
    {
      icon: <Clock size={32} />,
      value: `${stats.totalDuration || 0}min`,
      label: 'Tempo Total',
      trend: {
        value: '+15min esta semana',
        isPositive: false
      },
      color: theme.palette.info.main,
      bgGradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card 
            variant="card1"
            sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 24px ${stat.color}40`,
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
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: stat.bgGradient,
                opacity: 0.1,
                borderRadius: '0 0 0 100%',
                transition: 'all 0.3s ease',
              }}
            />

            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box
                  className="icon-container"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: stat.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {stat.icon}
                </Box>

                {stat.trend && (
                  <Chip
                    className="trend-chip"
                    icon={stat.trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    label={stat.trend.value}
                    size="small"
                    sx={{
                      bgcolor: stat.trend.isPositive 
                        ? theme.palette.success.main + '20' 
                        : theme.palette.error.main + '20',
                      color: stat.trend.isPositive 
                        ? theme.palette.success.main 
                        : theme.palette.error.main,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: '24px',
                      transform: 'translateX(10px)',
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      '& .MuiChip-icon': {
                        color: 'inherit'
                      }
                    }}
                  />
                )}
              </Box>

              <Typography 
                variant="h3" 
                sx={{ 
                  color: stat.color,
                  fontWeight: 'bold',
                  mb: 0.5,
                  fontSize: '2.5rem',
                  lineHeight: 1
                }}
              >
                {stat.value}
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.purple.light1,
                  fontWeight: 500
                }}
              >
                {stat.label}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  height: 4,
                  bgcolor: theme.palette.purple.light2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: '70%',
                    background: stat.bgGradient,
                    borderRadius: 2,
                    transition: 'width 1s ease',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}