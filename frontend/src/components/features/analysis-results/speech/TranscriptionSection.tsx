'use client';

import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Box, 
  Typography, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { FileText, Copy, Check, Highlighter } from 'lucide-react';
import theme from '@/styles/theme';
import { FillerwordAnalysis } from '@/domain/analysis/types/analysis';

interface TranscriptionSectionProps {
  transcription: string;
  fillerWords: FillerwordAnalysis;
}

export function TranscriptionSection({ transcription, fillerWords }: TranscriptionSectionProps) {
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
        <mark key={`filler-${index}`} style={{
          backgroundColor: theme.palette.purple.main,
          color: 'white',
          padding: '0.2em',
          borderRadius: '0.2em',
          animation: `highlight 0.5s ease-out ${index * 0.1}s both`,
        }}>
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
    <Card 
      sx={{ 
        bgcolor: theme.palette.purple.light2,
        animation: 'fadeInUp 0.6s ease-out 0.5s both',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${theme.palette.purple.main}30`,
          '& .icon-container': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .trend-chip': {
            transform: 'translateX(0)',
            opacity: 1,
          }
        }
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: theme.palette.purple.contrastText }}>
            Transcrição Completa
          </Typography>
        }
        avatar={
          <Box
            sx={{
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 }
              }
            }}
          >
            <FileText size={24} color={theme.palette.purple.light1} />
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasFillerWords && (
              <Tooltip title={highlight ? 'Remover Destaque' : 'Destacar Vícios de Linguagem'} placement="top">
                <IconButton 
                  onClick={toggleHighlight} 
                  size="small"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(15deg)',
                      bgcolor: theme.palette.purple.main + '20'
                    }
                  }}
                >
                  <Highlighter 
                    size={20} 
                    color={highlight ? theme.palette.purple.main : theme.palette.purple.light1} 
                  />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={copied ? 'Copiado!' : 'Copiar'} placement="top">
              <IconButton 
                onClick={handleCopy} 
                size="small"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: theme.palette.purple.main + '20'
                  }
                }}
              >
                {copied ? (
                  <Check size={20} color={theme.palette.success.main} />
                ) : (
                  <Copy size={20} color={theme.palette.purple.light1} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <Box
          sx={{
            bgcolor: theme.palette.purple.dark,
            borderRadius: 2,
            p: 3,
            maxHeight: 400,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.8,
            fontSize: '1rem',
            color: theme.palette.purple.contrastText,
            animation: 'fadeIn 0.8s ease-out 0.7s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
              '&::-webkit-scrollbar': {
                width: '8px',
              }},
            '&::-webkit-scrollbar-track': {
              bgcolor: theme.palette.purple.light2,
              borderRadius: '4px',
              },
            '&::-webkit-scrollbar-thumb': {
                bgcolor: theme.palette.purple.main,
                borderRadius: '4px',
                '&:hover': {
                bgcolor: theme.palette.purple.main + 'CC',
                },
              },
          }}>
            {getHighlightedText()}
        </Box>
        {hasFillerWords && (
          <Box 
            sx={{ 
              mt: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              animation: 'fadeIn 0.8s ease-out 0.9s both'
            }}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                bgcolor: theme.palette.purple.main,
                borderRadius: 0.5,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 }
                }
              }} 
            />
            <Typography variant="caption" sx={{ color: theme.palette.purple.light1 }}>
              Vícios de linguagem destacados ({fillerWords.total} encontrados)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
              