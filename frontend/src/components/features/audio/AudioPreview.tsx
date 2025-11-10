'use client';

import { useEffect, useState, memo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
  CardHeader,
} from '@mui/material';
import { FileAudio, Send, Trash2 } from 'lucide-react';
import theme from '@/styles/theme';

interface AudioPreviewProps {
  audioFile: File;
  onSend: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AudioPlayer = memo(({ audioFile }: { audioFile: File }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!audioFile) return;
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  if (!audioUrl) return null;

  return (
    <audio 
      controls 
      src={audioUrl} 
      style={{ 
        width: '100%',
        filter: 'hue-rotate(260deg) saturate(1.2)',
      }}
    >
      O seu navegador não suporta o elemento de áudio.
    </audio>
  );
});
AudioPlayer.displayName = 'AudioPlayer';

export function AudioPreview({
  audioFile,
  onSend,
  onCancel,
  isLoading,
}: AudioPreviewProps) {
  return (
    <Card 
      variant="card1"
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette.purple.main}40`,
        }
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.light1 }}>
            Arquivo Selecionado
          </Typography>
        }
        avatar={<FileAudio size={24} color={theme.palette.purple.light1} />}
        sx={{ bgcolor: theme.palette.purple.dark }}
      />

      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Info do arquivo */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.purple.dark + '80',
            }}
          >
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography 
                variant="body1" 
                fontWeight="medium" 
                noWrap
                sx={{ color: theme.palette.purple.contrastText }}
              >
                {audioFile.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: theme.palette.purple.light1 }}
              >
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={onCancel} 
              disabled={isLoading}
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main + '20',
                }
              }}
            >
              <Trash2 size={20} />
            </IconButton>
          </Box>

          {/* Player de áudio */}
          <Box sx={{ 
            p: 2, 
            borderRadius: 2,
            backgroundColor: theme.palette.purple.dark + '40',
          }}>
            <AudioPlayer audioFile={audioFile} />
          </Box>

          {/* Botão de ação */}
          <Button
            variant="button1"
            size="large"
            fullWidth
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={onSend}
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            {isLoading ? 'Analisando...' : 'Analisar Áudio'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}