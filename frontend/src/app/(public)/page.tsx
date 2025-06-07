'use client';

import { useState } from 'react';
import { Container } from '@mui/material';
import { AudioDropzone } from '@/components/features/AudioDropzone';
import { AudioPreview } from '@/components/features/AudioPreview';

export default function HomePage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <Container
      maxWidth="md"
      className="flex-grow flex items-center justify-center py-8"
    >
      {!audioFile ? (
        <AudioDropzone onFileAccepted={setAudioFile} />
      ) : (
        <AudioPreview file={audioFile} onClear={() => setAudioFile(null)} />
      )}
    </Container>
  );
}