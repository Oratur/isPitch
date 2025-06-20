'use client';

import { useState } from 'react';
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { Check, Copy } from 'lucide-react';

interface TranscriptionCardProps {
  transcription: string;
}

export function TranscriptionCard({ transcription }: TranscriptionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardHeader
        title={<Typography variant="h6">Transcrição</Typography>}
       
        action={
          <Tooltip title={copied ? 'Copiado!' : 'Copiar'} placement="top">
            <IconButton onClick={handleCopy} size="small">
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </IconButton>
          </Tooltip>
        }
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent>
        <Box
          sx={{
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'grey.200',
            borderRadius: 2,
            p: 2,
            maxHeight: 400, 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          {transcription}
        </Box>
      </CardContent>
    </Card>
  );
}