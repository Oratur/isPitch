import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  CardHeader,
  Button,
  Divider,
} from '@mui/material';
import { FillerwordAnalysis } from '@/domain/analysis/types/analysis';
import { Mic } from 'lucide-react';
import React, { useState } from 'react';
import theme from '@/styles/theme';

interface FillerWordAnalysisCardProps {
  analysis: FillerwordAnalysis;
}

export function FillerWordAnalysisCard({ analysis }: FillerWordAnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedFillerWords = Object.entries(analysis.distribution).sort(
    (a, b) => b[1] - a[1],
  );

  const itemsToShow = isExpanded ? sortedFillerWords : sortedFillerWords.slice(0, 3);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card elevation={2} variant='card1' >
      <CardHeader
        sx={{ bgcolor: theme.palette.purple.light2 }}

        title={<Typography variant="h1">
          Vícios de Linguagem
        </Typography>}
        avatar={<Mic size={24} color={theme.palette.purple.light1}/>}
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" fontWeight="bold" color={theme.palette.purple.main}>
            {analysis.total}
            <Typography variant="h6" component='span' color="text.secondary" sx={{ ml: 1 }}>
              Total Encontrado
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ maxWidth: 280, mx: 'auto' }}>
          {sortedFillerWords.length > 0 ? (
            <>
              <List dense sx={{ width: '100%', p: 0 }}> 
                {itemsToShow.map(([word, count]) => (   //verificar para aumentar fonte dos fillerwords
                  <ListItem
                    key={word}
                    disableGutters
                    secondaryAction={<Chip label={count} size="medium" />}
                  >
                    <ListItemText primary={word} />
                  </ListItem>
                ))}
              </List>

              {sortedFillerWords.length > 3 && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Button variant="button1" onClick={toggleExpansion}>
                    {isExpanded ? 'Ver menos' : 'Ver todos'}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Nenhum vício de linguagem comum foi detectado. Bom trabalho!
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}