import { Card, CardContent, Typography, Box, IconButton, Stack, LinearProgress, Button } from '@mui/material';
import { FileAudio, Calendar, MoreVertical, Clock, Eye } from 'lucide-react';
import theme from '@/styles/theme';
import { RecentAnalysis } from '@/domain/dashboard/types';
import Link from 'next/link';

interface RecentAnalysisCardProps {
  analysis: RecentAnalysis;
  statusMessage?: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Aguardando',
  transcribing: 'Transcrevendo',
  analyzing_speech: 'Analisando Fala',
  analyzing_audio: 'Analisando Áudio',
  completed: 'Concluída',
  failed: 'Erro'
};

const statusColors: Record<string, string> = {
  pending: theme.palette.warning.main,
  transcribing: theme.palette.info.main,
  analyzing_speech: theme.palette.info.main,
  analyzing_audio: theme.palette.info.main,
  completed: theme.palette.success.main,
  failed: theme.palette.error.main
};

export function RecentAnalysisCard({ analysis, statusMessage }: RecentAnalysisCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Há alguns minutos';
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isProcessing = ['pending', 'transcribing', 'analyzing_speech', 'analyzing_audio'].includes(analysis.status);

  const qualityScore = analysis.score ?? 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <Card 
      variant="card1" 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette.purple.main}40`,
          '& .action-buttons': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }
      }}
    >
      {/* Badge de Status ou Qualidade */}
      <Box
        sx={{
          position: 'absolute',
          top: -12,
          right: 16,
          bgcolor: isProcessing ? statusColors[analysis.status] : getScoreColor(qualityScore),
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: 700,
          boxShadow: `0 4px 12px ${isProcessing ? statusColors[analysis.status] : getScoreColor(qualityScore)}40`,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {isProcessing && <Clock size={16} className="animate-spin" />}
        {isProcessing 
          ? statusLabels[analysis.status]
          : `${qualityScore}% • ${getScoreLabel(qualityScore)}`
        }
      </Box>

      <CardContent sx={{ pb: 2 }}>
        {/* Header with File Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.purple.main} 0%, ${theme.palette.purple.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileAudio size={24} color="white" />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {analysis.filename}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Calendar size={14} color={theme.palette.purple.light1} />
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
                  {formatDate(analysis.createdAt)}
                </Typography>
              </Box>
            </Box>

            <IconButton size="small" sx={{ color: theme.palette.purple.light1 }}>
              <MoreVertical size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Barra de progresso para análises em processamento */}
        {isProcessing ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1, mb: 1, display: 'block' }}>
              {statusMessage || 'Processando análise...'}
            </Typography>
            <LinearProgress 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: theme.palette.purple.light2,
                '& .MuiLinearProgress-bar': {
                  bgcolor: statusColors[analysis.status],
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        ) : (
          <>
            {/* Metrics Grid - apenas para análises completas */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1.5,
                mb: 2,
                p: 1.5,
                bgcolor: theme.palette.purple.dark + '80',
                borderRadius: 2
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.warning.main,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    mb: 0.25
                  }}
                >
                  {analysis.fillerWordsCount}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.7rem' }}>
                  Vícios
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.info.main,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    mb: 0.25
                  }}
                >
                  {analysis.speechRate}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.7rem' }}>
                  PPM
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.purple.main,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    mb: 0.25
                  }}
                >
                  {analysis.pausesCount}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.7rem' }}>
                  Pausas
                </Typography>
              </Box>
            </Box>

            {/* Quality Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: theme.palette.purple.light1, fontSize: '0.75rem' }}>
                  Qualidade Geral
                </Typography>
                <Typography variant="caption" sx={{ color: getScoreColor(qualityScore), fontWeight: 600 }}>
                  {qualityScore}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={qualityScore} 
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: theme.palette.purple.light2,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getScoreColor(qualityScore),
                    borderRadius: 3,
                  }
                }}
              />
            </Box>
          </>
        )}

        {/* Action Buttons - apenas para análises completas */}
        {!isProcessing && (
          <Stack 
            direction="row" 
            spacing={1}
            className="action-buttons"
            sx={{
              opacity: 0.7,
              transform: 'translateY(5px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Button
              component={Link}
              href={`/analyses/${analysis.id}`}
              variant="contained"
              startIcon={<Eye size={18} />}
              fullWidth
              sx={{
                bgcolor: theme.palette.purple.main,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                py: 1,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${theme.palette.purple.main}40`,
                '&:hover': { 
                  bgcolor: theme.palette.purple.main + 'CC',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 16px ${theme.palette.purple.main}60`,
                },
                transition: 'all 0.2s ease'
              }}
            >
              Ver Detalhes
            </Button>
            {/* <IconButton 
              component={Link}
              href={`/analyses/${analysis.id}`}
              size="small"
              sx={{ 
                bgcolor: theme.palette.purple.main + '20',
                '&:hover': { bgcolor: theme.palette.purple.main + '40' },
                flex: 1
              }}
            >
              <Play size={18} color={theme.palette.purple.main} />
            </IconButton> */}

            {/* <IconButton 
              size="small"
              sx={{ 
                bgcolor: theme.palette.info.main + '20',
                '&:hover': { bgcolor: theme.palette.info.main + '40' }
              }}
            >
              <Share2 size={18} color={theme.palette.info.main} />
            </IconButton>

            <IconButton 
              size="small"
              sx={{ 
                bgcolor: theme.palette.success.main + '20',
                '&:hover': { bgcolor: theme.palette.success.main + '40' }
              }}
            >
              <Download size={18} color={theme.palette.success.main} />
            </IconButton> */}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}