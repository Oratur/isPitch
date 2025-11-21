import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { FileAudio, Share2, Download } from 'lucide-react';
import theme from '@/styles/theme';
import { Analysis } from '@/domain/analysis/types/analysis';

interface ResultsHeaderProps {
  analysis: Analysis;
}

export function ResultsHeader({ analysis }: ResultsHeaderProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}min ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 2, 
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.purple.main} 0%, #9333EA 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileAudio size={28} color="white" />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: theme.palette.purple.contrastText, fontWeight: 700 }}>
              Resultados da Análise
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.purple.light1 }}>
              {analysis.filename} • {formatDuration(analysis.audioAnalysis.duration)} • {formatDate(analysis.createdAt)}
            </Typography>
          </Box>
        </Box>
        
        {/* <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Compartilhar">
            <IconButton 
              sx={{ 
                bgcolor: theme.palette.purple.light2,
                '&:hover': { bgcolor: theme.palette.purple.main + '40' }
              }}
            >
              <Share2 size={20} color={theme.palette.purple.light1} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Baixar Relatório">
            <IconButton 
              sx={{ 
                bgcolor: theme.palette.purple.light2,
                '&:hover': { bgcolor: theme.palette.purple.main + '40' }
              }}
            >
              <Download size={20} color={theme.palette.purple.light1} />
            </IconButton>
          </Tooltip>
        </Box> */}
      </Box>
    </Box>
  );
}