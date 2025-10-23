'use client';

import { useState } from 'react';
import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material';
import { Check, Copy, Highlighter } from 'lucide-react';
import { FillerwordAnalysis } from '@/types/analysis';
import theme from '@/styles/theme';
import React from 'react';
import { FileText } from 'lucide-react';

interface TranscriptionCardProps {
  transcription: string;
  fillerWords?: FillerwordAnalysis;
}

export function TranscriptionCard({ transcription, fillerWords }: TranscriptionCardProps) {
  const [copied, setCopied] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHighlight = () => {
    setHighlight(!highlight);
  };

  const getHighlightedText = () => {
    if (!highlight || !fillerWords?.occurrences || fillerWords.occurrences.length === 0) {
      return transcription;
    }
    
    const sortedWords = [...fillerWords.occurrences].sort((a, b) => a.start - b.start);
  
    const parts = [];
    let lastIndex = 0;

    sortedWords.forEach((word, index) => {
      if (word.start > lastIndex) {
        parts.push(transcription.substring(lastIndex, word.start));
      }
      
      parts.push(
        <mark key={`filler-${index}`}>
          {transcription.substring(word.start, word.end)}
        </mark>
      );
      lastIndex = word.end;
    });

    if (lastIndex < transcription.length) {
      parts.push(transcription.substring(lastIndex));
    }

    return parts;
  };

  const hasFillerWords = fillerWords && fillerWords.total > 0;

  return (
    <Card elevation={2} variant="card1"
    sx={{
      borderColor: theme.palette.purple.light2
    }}
    >
      <CardHeader
        title={<
          Typography variant="h1">
            Transcrição
          </Typography>}
          avatar={<FileText size={24} color={theme.palette.purple.light1}/>}
       
        action={
          <Box >
            {hasFillerWords && (
              <Tooltip title={highlight ? 'Remover Destaque' : 'Destacar Vícios de Linguagem'} placement="top">
                <IconButton onClick={toggleHighlight} size="small" sx={{ mr: 1}}>
                  <Highlighter size={25} color={highlight ? '#7F13EC' : 'gray'} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={copied ? 'Copiado!' : 'Copiar'} placement="top">
              <IconButton onClick={handleCopy} size="small">
                {copied ? <Check size={25} className="text-green-500" /> : <Copy size={25} />}
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        {<Box
          sx={{
            bgcolor: theme.palette.purple.light2,
            borderRadius: 2,
            p: 2,
            maxHeight: 400, 
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            typography: 'body1',
            color: theme.palette.background.paper,
            '& mark': {
              backgroundColor: theme.palette.purple.main,
              color: 'white',
              padding: '0.2em',
              borderRadius: '0.2em',
            },
          }}
        >
          {getHighlightedText()}
        </Box>
        }
      </CardContent>
    </Card>
  );
}