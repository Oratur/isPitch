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
import { FillerWordAnalysis } from '@/types/analysis';
import { BarChart3 } from 'lucide-react';
import React, { useState } from 'react';

interface FillerWordAnalysisCardProps {
  analysis: FillerWordAnalysis;
}

export function FillerWordAnalysisCard({ analysis }: FillerWordAnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedFillerWords = Object.entries(analysis.fillerWordsCount).sort(
    (a, b) => b[1] - a[1],
  );

  const itemsToShow = isExpanded ? sortedFillerWords : sortedFillerWords.slice(0, 3);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">Vícios de Linguagem</Typography>}
        avatar={<BarChart3 size={24} className="text-gray-500" />}
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" fontWeight="bold" color="primary">
            {analysis.totalFillerWords}
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
                {itemsToShow.map(([word, count]) => (
                  <ListItem
                    key={word}
                    disableGutters
                    secondaryAction={<Chip label={count} size="small" />}
                  >
                    <ListItemText primary={word} />
                  </ListItem>
                ))}
              </List>
              
              {sortedFillerWords.length > 3 && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                  <Button size="small" onClick={toggleExpansion}>
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