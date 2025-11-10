'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Button, Typography, Chip } from '@mui/material';
import { UploadCloud, FileAudio } from 'lucide-react';
import theme from '@/styles/theme';

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
    <Box
      {...getRootProps()}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: '2px dashed',
        borderColor: isDragReject 
          ? theme.palette.error.main 
          : isDragActive 
            ? theme.palette.purple.main 
            : theme.palette.purple.light1 + '40',
        borderRadius: 3,
        backgroundColor: theme.palette.purple.light2,
        p: { xs: 4, sm: 6, md: 8 },
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        
        '&:hover': {
          borderColor: theme.palette.purple.main,
          backgroundColor: theme.palette.purple.dark + 'E6',
          transform: 'translateY(-2px)',
          boxShadow: `0 12px 32px ${theme.palette.purple.main}30`,
        },

        ...(isDragActive && {
          borderColor: theme.palette.purple.main,
          backgroundColor: theme.palette.purple.dark + 'E6',
          boxShadow: `0 12px 32px ${theme.palette.purple.main}40`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, ${theme.palette.purple.main}20 0%, transparent 70%)`,
            animation: 'pulse 1.5s ease-in-out infinite',
          },
        }),

        ...(isDragReject && {
          borderColor: theme.palette.error.main,
          backgroundColor: theme.palette.error.main + '10',
        }),

        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      }}
    >
      <input {...getInputProps({ name: 'file' })} />
      
      {/* Ícone com animação */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: '50%',
          backgroundColor: theme.palette.purple.main + '15',
          transition: 'all 0.3s ease',
          ...(isDragActive && {
            transform: 'scale(1.1)',
            backgroundColor: theme.palette.purple.main + '25',
          }),
        }}
      >
        <UploadCloud
          size={56}
          style={{
            color: isDragActive 
              ? theme.palette.purple.main 
              : theme.palette.purple.light1,
            transition: 'color 0.3s ease',
          }}
        />
      </Box>
      
      {/* Título principal */}
      <Typography 
        variant="h5" 
        sx={{ 
          color: theme.palette.purple.contrastText,
          mb: 2,
          fontWeight: 600
        }}
      >
        {isDragActive ? 'Solte o arquivo aqui' : 'Upload de Áudio'}
      </Typography>

      {/* Botão */}
      <Button
        variant="button1"
        size="large"
        component="span"
        sx={{ 
          mb: 2,
          px: 4,
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        Selecionar Arquivo
      </Button>
      
      {/* Texto secundário */}
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme.palette.purple.light1,
          mb: 3,
          fontSize: '0.95rem'
        }}
      >
        ou arraste e solte aqui
      </Typography>

      {/* Chips de formatos */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip 
          icon={<FileAudio size={16} />}
          label="MP3" 
          size="small"
          sx={{
            backgroundColor: theme.palette.purple.main + '20',
            color: theme.palette.purple.main,
            fontWeight: 600,
            border: `1px solid ${theme.palette.purple.main}40`,
          }}
        />
        <Chip 
          icon={<FileAudio size={16} />}
          label="WAV" 
          size="small"
          sx={{
            backgroundColor: theme.palette.purple.main + '20',
            color: theme.palette.purple.main,
            fontWeight: 600,
            border: `1px solid ${theme.palette.purple.main}40`,
          }}
        />
      </Box>
    </Box>
  );
}