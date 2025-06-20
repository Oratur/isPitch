'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Button, Typography, Paper } from '@mui/material';
import { UploadCloud } from 'lucide-react';

interface AudioDropzoneProps {
  onFileAccepted: (file: File) => void;
  onError: (message: string) => void;
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


export function AudioDropzone({ onFileAccepted, onError }: AudioDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      onError(''); 

      if (fileRejections.length > 0) {
        const errorMessage = fileRejections[0].errors[0].message;
        onError(errorMessage);
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted, onError],
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

  const getBorderColor = () => {
    if (isDragReject) return 'error.main';
    if (isDragActive) return 'primary.main';
    return 'grey.400';
  };

  return (
    <Box className="text-center">
      <Typography variant="h4" component="h1" gutterBottom>
        Análise de Áudio
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Faça upload de um arquivo de áudio nos formatos <b>.mp3</b> ou <b>.wav</b> para análise. 
        Você pode selecionar um arquivo do seu computador ou arrastar e soltar aqui.
      </Typography>

      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: getBorderColor(),
          backgroundColor: isDragActive ? 'action.hover' : 'transparent',
          cursor: 'pointer',
          p: { xs: 4, sm: 6 },
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s, background-color 0.2s',
        }}
      >
        <input {...getInputProps({ name: 'file' })} />
        <UploadCloud
          size={48}
          className={`mb-4 transition-colors ${
            isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`}
        />
        <Button variant="contained" size="large" component="span">
          Selecionar Arquivo de Áudio
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ou arraste e solte aqui
        </Typography>
      </Paper>
    </Box>
  );
}