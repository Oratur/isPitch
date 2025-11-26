import { Card, CardContent, Box, Typography, LinearProgress, Alert } from '@mui/material';
import theme from '@/styles/theme';
import { Analysis } from '@/domain/analysis/types/analysis';
import { getScoreColor, getScoreLabel } from '@/domain/analysis/utils/scoreCalculator';


interface OverallScoreCardProps {
  analysis: Analysis;
}

export function OverallScoreCard({ analysis }: OverallScoreCardProps) {
  const overallScore = analysis.score ?? 0;
  const scoreColor = getScoreColor(overallScore);
  const scoreLabel = getScoreLabel(overallScore);

  // const scoreTooltipContent = (
  //   <Box sx={{ p: 1 }}>
  //     <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
  //       Como a pontuação é calculada:
  //     </Typography>
  //     <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
  //       <li><Typography variant="body2">Clareza da fala (30%)</Typography></li>
  //       <li><Typography variant="body2">Ritmo e pausas (25%)</Typography></li>
  //       <li><Typography variant="body2">Volume e entonação (20%)</Typography></li>
  //       <li><Typography variant="body2">Estrutura do discurso (15%)</Typography></li>
  //       <li><Typography variant="body2">Palavras de preenchimento (10%)</Typography></li>
  //     </Box>
  //     <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
  //       Classificação:
  //     </Typography>
  //     <Box sx={{ '& > div': { mb: 0.5 } }}>
  //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
  //         <Typography variant="body2">90-100%: Excelente</Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#8bc34a' }} />
  //         <Typography variant="body2">75-89%: Muito Bom</Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffc107' }} />
  //         <Typography variant="body2">60-74%: Bom</Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
  //         <Typography variant="body2">40-59%: Regular</Typography>
  //       </Box>
  //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //         <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
  //         <Typography variant="body2">0-39%: Precisa Melhorar</Typography>
  //       </Box>
  //     </Box>
  //   </Box>
  // );

  return (
    <Card 
      sx={{ 
        mb: 4,
        bgcolor: theme.palette.purple.light2,
        border: `2px solid ${scoreColor}40`,
        position: 'relative',
        overflow: 'visible',
        animation: 'fadeInUp 0.6s ease-out',
        '@keyframes fadeInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: scoreColor,
          color: 'white',
          px: 4,
          py: 1,
          borderRadius: 3,
          fontSize: '1.25rem',
          fontWeight: 700,
          boxShadow: `0 8px 24px ${scoreColor}60`,
          zIndex: 10,
          animation: 'scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s both',
          '@keyframes scaleIn': {
            '0%': {
              opacity: 0,
              transform: 'translateX(-50%) scale(0.5)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateX(-50%) scale(1)'
            }
          }
        }}
      >
        {overallScore}% • {scoreLabel}
      </Box>
      
      <CardContent sx={{ pt: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.palette.purple.light1,
                animation: 'fadeIn 0.8s ease-out 0.4s both',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }}
            >
              Pontuação Geral de Oratória
            </Typography>
            {/* <Tooltip 
              title={scoreTooltipContent} 
              arrow
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)' ,
                    color: 'text.primary',
                    boxShadow: 3,
                    maxWidth: 350,
                    // border: `1px solid ${theme.palette.purple.main}40`,
                    // '& .MuiTooltip-arrow': {
                    //   color: 'white',
                    //   '&::before': {
                    //     border: `1px solid ${theme.palette.purple.main}40`
                    //   }
                    // }
                  }
                }
              }}
            >
              <IconButton 
                size="small"
                sx={{ 
                  color: theme.palette.purple.main,
                  '&:hover': {
                    bgcolor: theme.palette.purple.main + '15'
                  }
                }}
              >
                <InfoIcon size={20} />
              </IconButton>
            </Tooltip> */}
          </Box>
          <Box
            sx={{
              position: 'relative',
              animation: 'fadeIn 1s ease-out 0.6s both'
            }}
          >
            <LinearProgress 
              variant="determinate" 
              value={overallScore}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: theme.palette.purple.dark,
                '& .MuiLinearProgress-bar': {
                  bgcolor: scoreColor,
                  borderRadius: 6,
                  transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s',
                  transformOrigin: 'left'
                }
              }}
            />
          </Box>
        </Box>

        <Alert 
          severity="info" 
          sx={{ 
            mt: 3,
            bgcolor: theme.palette.purple.main + '10',
            border: `1px solid ${theme.palette.purple.main}30`,
            '& .MuiAlert-icon': {
              color: theme.palette.purple.main
            },
            animation: 'fadeIn 1.2s ease-out 1s both'
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Esta análise pode apresentar variações dependendo da qualidade do áudio, 
            ruídos de fundo e outros fatores técnicos. Use-a como uma ferramenta de apoio para 
            aprimoramento contínuo.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}