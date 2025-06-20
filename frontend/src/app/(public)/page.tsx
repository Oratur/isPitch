'use client';

import { Container, Box, Alert } from '@mui/material';
import { AudioDropzone } from '@/components/features/AudioDropzone';
import  AudioPreview  from '@/components/features/AudioPreview';
import { useAudioUpload } from '@/hooks/useAudioUpload';

export default function HomePage() {
  const {
    audioFile,
    isLoading,
    error,
    handleFileAccepted,
    handleUpload,
    handleCancel,
    setError,
  } = useAudioUpload();

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            onError={setError}
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