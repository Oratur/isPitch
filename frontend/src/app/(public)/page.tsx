'use client';

import { Container, Box, Alert } from '@mui/material';

import { useAudioUpload } from '@/hooks/useAudioUpload';
import { AudioDropzone, AudioPreview } from '@/components/features/audio';

export default function HomePage() {
  const {
    audioFile,
    isLoading,
    error,
    handleFileAccepted,
    handleUpload,
    handleCancel,
    handleValidationError,
  } = useAudioUpload();

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-text)' }}>
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
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
}