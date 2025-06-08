'use client';

import { Box, Button, Typography, Paper } from '@mui/material';
import { UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';

interface AudioDropzoneProps {
  onFileAccepted: (file: File) => void;
}

export function AudioDropzone({ onFileAccepted }: AudioDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidAudioFile = (file: File) => {
    const validTypes = ['audio/mpeg', 'audio/wav'];
    const validExtensions = ['.mp3', '.wav'];
    const fileName = file.name.toLowerCase();
    return validTypes.includes(file.type) 
        && validExtensions.some(ext => fileName.endsWith(ext));
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        if (!isValidAudioFile(file)) {
          setError('Apenas arquivos .mp3 ou .wav são permitidos.');
          return;
        }
        onFileAccepted(event.dataTransfer.files[0]);
      }
    },
    [onFileAccepted]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!isValidAudioFile(file)) {
        setError('Apenas arquivos .mp3 ou .wav são permitidos.');
        return;
      }

      onFileAccepted(event.target.files[0]);
    }
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="text-center"
    >
      <input
        type="file"
        id="audio-upload-input"
        accept="audio/*"
        onChange={handleFileSelect}
        hidden
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Análise de Áudio
      </Typography>
      <Typography variant="body1" color="text.secondary">
          Faça upload de um arquivo de áudio nos formatos <b>.mp3</b> ou <b>.wav</b> para análise. 
          Você pode selecionar um arquivo do seu computador ou arrastar e soltar aqui.
      </Typography>

      <Paper
        variant="outlined"
        component="label"
        htmlFor="audio-upload-input"
        sx={{
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: isDragOver ? 'primary.main' : 'grey.400',
          backgroundColor: isDragOver ? 'action.hover' : 'transparent',
          cursor: 'pointer',
          p: { xs: 4, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        <UploadCloud
          size={48}
          className={`mb-4 transition-colors ${
            isDragOver ? 'text-blue-500' : 'text-gray-400'
          }`}
        />
        <Button
          variant="contained"
          size="large"
          component="span"
        >
          Selecionar Arquivo de Áudio
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ou arraste e solte aqui
        </Typography>
        {
          error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )
        }
      </Paper>
    </Box>
  );
}