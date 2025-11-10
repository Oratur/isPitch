'use client';

import { AudioDropzone, AudioPreview, AudioDropzoneSkeleton } from '@/components/features/audio';
import { useAudioUpload } from '@/domain/audio/hook';
import { Box, Typography, Alert, Skeleton, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import theme from '@/styles/theme';

export default function UploadPage() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const {
    audioFile,
    isLoading,
    error,
    handleFileAccepted,
    handleUpload,
    handleCancel,
    handleValidationError,
  } = useAudioUpload();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, lg: 4 }, minHeight: 'calc(100vh - 100px)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Skeleton 
              variant="text" 
              width="40%" 
              height={48}
              sx={{ mb: 2, borderRadius: 1, mx: 'auto' }}
            />
            
            <Skeleton 
              variant="text" 
              width="70%" 
              height={24}
              sx={{ mb: 6, borderRadius: 1, mx: 'auto' }}
            />
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            <AudioDropzoneSkeleton />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3, lg: 4 },
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section - CENTRALIZADO */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 2 
          }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.purple.main} 0%, #9333EA 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload size={24} color="white" />
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
              Nova Análise de Áudio
            </Typography>
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.purple.light1,
              maxWidth: 700,
              lineHeight: 1.6,
              mx: 'auto'
            }}
          >
            {audioFile 
              ? 'Revise o arquivo selecionado e clique em "Analisar Áudio" para iniciar o processamento'
              : 'Faça upload de um arquivo de áudio nos formatos MP3 ou WAV para análise detalhada de oratória'
            }
          </Typography>
        </Box>

        {/* Content Section */}
        <Box 
          sx={{ 
            maxWidth: 900, 
            mx: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: audioFile ? 'flex-start' : 'center',
            minHeight: audioFile ? 'auto' : '400px',
          }}
        >
          {audioFile ? (
            <AudioPreview
              audioFile={audioFile}
              onSend={handleUpload}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          ) : (
            <AudioDropzone 
              onFileAccepted={handleFileAccepted} 
              onValidationError={handleValidationError}
            />
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                backgroundColor: theme.palette.error.main + '15',
                color: theme.palette.error.light,
                border: `1px solid ${theme.palette.error.main}40`,
                '& .MuiAlert-icon': {
                  color: theme.palette.error.main
                }
              }}
            >
              {error}
            </Alert>
          )}
        </Box>

        {/* Info Cards Section */}
        {!audioFile && (
          <Box 
            sx={{ 
              mt: 6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            {[
              {
                icon: '🎤',
                title: 'Análise de Vícios',
                description: 'Detecte palavras de preenchimento e hesitações'
              },
              {
                icon: '⏱️',
                title: 'Ritmo da Fala',
                description: 'Avalie sua velocidade e pausas durante a apresentação'
              },
              {
                icon: '📊',
                title: 'Métricas Detalhadas',
                description: 'Receba relatórios completos sobre sua performance'
              }
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.purple.light2,
                  border: `1px solid ${theme.palette.purple.light1}20`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.purple.main + '40',
                    boxShadow: `0 8px 24px ${theme.palette.purple.main}20`,
                  }
                }}
              >
                <Typography variant="h3" sx={{ mb: 1.5, fontSize: '2rem' }}>
                  {item.icon}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: theme.palette.purple.contrastText,
                    mb: 1,
                    fontWeight: 600
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.purple.light1,
                    fontSize: '0.875rem'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}