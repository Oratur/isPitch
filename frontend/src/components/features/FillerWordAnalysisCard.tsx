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
  Divider
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
        (a, b) => b[1] - a[1]
    );

    const itemsToShow = isExpanded ? sortedFillerWords : sortedFillerWords.slice(0, 3);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    }

    return (
        <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
                title={<Typography variant="h6">{'Vícios de Linguagem'}</Typography>}
                avatar={<BarChart3 size={24} className="text-gray-500" />}
                sx={{ bgcolor: 'grey.100' }}
            />
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'column', mb: 2 }}>
                    <Typography variant='h4' component='p' sx={{ mr: 2 }}>
                        {analysis.totalFillerWords}
                    </Typography>
                    <Typography variant='subtitle1' color='text.secondary'>
                        Total Encontrado
                    </Typography> 
                </Box>
               <Divider />
        {sortedFillerWords.length > 0 ? (
          <>
            <List dense>
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
            {sortedFillerWords.length > 4 && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button size="small" onClick={toggleExpansion}>
                  {isExpanded ? 'Ver menos' : 'Ver todos'}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum vício de linguagem comum foi detetado. Bom trabalho!
          </Typography>
        )}
      </CardContent>
        </Card>
    )
}