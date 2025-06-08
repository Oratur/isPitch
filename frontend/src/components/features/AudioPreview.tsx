'use client';

import {
  Box, Button, Card, CardContent, IconButton, Stack, Typography, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileAudio, Send, Trash2 } from 'lucide-react';
import { createAudioAnalysis } from '@/services/analysisService';

interface AudioPreviewProps {
  file: File;
  onClear: () => void;
}

export function AudioPreview({ file, onClear }: AudioPreviewProps) {
  const router = useRouter();
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setAudioSrc(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // const handleSendAudio = () => {
  //   setIsUploading(true);
  //   console.log('Enviando áudio:', file.name);

  //   // Simula uma chamada de API de 2 segundos
  //   setTimeout(() => {
  //     const analysisId = 'exemplo-12345';
  //     router.push(`/analysis/${analysisId}`);
  //     // setIsUploading(false); // Não é necessário se a página vai mudar
  //   }, 2000);
  // };

  const handleSendAudio = async () => {
    setIsUploading(true);

    try {
      const response = await createAudioAnalysis(file);
      const analysisId = response.id;
      
      router.push(`/analysis/${analysisId}`);
    } catch (error) {
      console.error('Erro ao enviar o áudio:', error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Box className="flex flex-col items-center gap-6 w-full max-w-2xl text-center">
       <Typography variant="h5" component="h2" gutterBottom>
        Pré-visualização do Áudio
      </Typography>
      <Card variant="outlined" className="w-full">
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" className="mb-4">
            <FileAudio size={24} className="text-gray-600 flex-shrink-0" />
            <Box flexGrow={1} className="text-left overflow-hidden">
              <Typography variant="body1" fontWeight="medium" noWrap>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClear} disabled={isUploading}>
              <Trash2 size={18} />
            </IconButton>
          </Stack>

          {audioSrc && (
            <audio controls src={audioSrc} className="w-full"></audio>
          )}
        </CardContent>
      </Card>
      <Button
        variant="contained"
        size="large"
        endIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <Send />}
        onClick={handleSendAudio}
        disabled={isUploading}
      >
        {isUploading ? 'Analisando...' : 'Analisar Áudio'}
      </Button>
    </Box>
  );
}