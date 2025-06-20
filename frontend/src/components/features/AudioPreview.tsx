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
} from '@mui/material';
import { FileAudio, Send, Trash2 } from 'lucide-react';

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
    <audio controls src={audioUrl} style={{ width: '100%' }}>
      O seu navegador não suporta o elemento de áudio.
    </audio>
  );
});
AudioPlayer.displayName = 'AudioPlayer';

export default function AudioPreview({
  audioFile,
  onSend,
  onCancel,
  isLoading,
}: AudioPreviewProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" component="h2">
        Pré-visualização do Áudio
      </Typography>

      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FileAudio size={24} className="text-gray-600 flex-shrink-0" />
            <Box sx={{ flexGrow: 1, textAlign: 'left', overflow: 'hidden' }}>
              <Typography variant="body1" fontWeight="medium" noWrap>
                {audioFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
            <IconButton size="small" onClick={onCancel} disabled={isLoading}>
              <Trash2 size={18} />
            </IconButton>
          </Stack>
          <AudioPlayer audioFile={audioFile} />
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
        onClick={onSend}
        disabled={isLoading}
        sx={{ minWidth: '200px' }}
      >
        {isLoading ? 'Analisando...' : 'Analisar Áudio'}
      </Button>
    </Box>
  );
}