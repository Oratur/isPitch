'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Button, Typography, Paper } from '@mui/material';
import { UploadCloud } from 'lucide-react';

interface AudioDropzoneProps {
  onFileAccepted: (file: File) => void;
  onValidationError: (message: string) => void;
}

const audioValidator = (file: File) => {
  if (!file || typeof file.name !== 'string' || typeof file.type !== 'string') {
    return null;
  }

  const validTypes = ['audio/mpeg', 'audio/wav'];
  const fileName = file.name.toLowerCase();
  
  if (!validTypes.includes(file.type) && !fileName.endsWith('.mp3') && !fileName.endsWith('.wav')) {
    return {
      code: 'invalid-audio-type',
      message: 'Tipo de arquivo inválido. Apenas MP3 ou WAV são permitidos.',
    };
  }

  return null;
};

export function AudioDropzone({ onFileAccepted, onValidationError }: AudioDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      onValidationError(''); 

      if (fileRejections.length > 0) {
        const errorMessage = fileRejections[0].errors[0].message;
        onValidationError(errorMessage);
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted, onValidationError],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
    },
    maxFiles: 1,
    validator: audioValidator,
  });

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Análise de Áudio
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Faça upload de um arquivo de áudio nos formatos{' '}
        <Typography component="span" fontWeight={600} color="text.primary">
          .mp3
        </Typography>
        {' '}ou{' '}
        <Typography component="span" fontWeight={600} color="text.primary">
          .wav
        </Typography>
        {' '}para análise. Você pode selecionar um arquivo do seu computador ou arrastar e soltar aqui.
      </Typography>

      <Paper
        {...getRootProps()}
        variant="dropzone"
        data-active={isDragActive}
        data-reject={isDragReject}
      >
        <input {...getInputProps({ name: 'file' })} />
        
        <UploadCloud
          size={48}
          style={{
            marginBottom: '1rem',
            color: isDragActive ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-secondary)',
            transition: 'color 0.3s ease',
          }}
        />
        
        <Button
          variant="button1"
          size="large"
          component="span"
        >
          Selecionar Arquivo de Áudio
        </Button>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ou arraste e solte aqui
        </Typography>
      </Paper>
    </Box>
  );
}