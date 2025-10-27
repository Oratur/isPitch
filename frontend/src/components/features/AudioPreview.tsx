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
import MyBox from '../layouts/MyBox';

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
    <MyBox
    >
      <Typography variant="subtitle1" component="h2">
        Pré-visualização do Áudio
      </Typography>

      <Card variant="card1">
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FileAudio size={25} className="text-gray-600 flex-shrink-0" style={{ color: 'var(--color-text)'}}/>
            <Box sx={{ flexGrow: 1, textAlign: 'left', overflow: 'hidden', color: 'var(--color-text)' }}>
              <Typography variant="body1" fontWeight="medium" noWrap>
                {audioFile.name}
              </Typography>
              <Typography variant="body2" color='var(--color-text)'>
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
            <IconButton size="small" onClick={onCancel} disabled={isLoading}>
              <Trash2 size={25} color='var(--color-text)' />
            </IconButton>
          </Stack>
          <AudioPlayer audioFile={audioFile} />
        </CardContent>
      </Card>

      <Button
        variant="button1"
        size="large"
        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
        onClick={onSend}
        disabled={isLoading}
      >
        {isLoading ? 'Analisando...' : 'Analisar Áudio'}
      </Button>
    </MyBox>
  );
}