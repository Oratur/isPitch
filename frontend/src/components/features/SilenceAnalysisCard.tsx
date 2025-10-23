'use client';

import { SilenceAnalysis } from '@/types/analysis';
import { Card, CardContent, Divider, Stack, Typography, Box, CardHeader } from '@mui/material';
import { BarChart3, Hourglass, Timer } from 'lucide-react';
import theme from '@/styles/theme';


interface SilenceAnalysisCardProps {
  silences: SilenceAnalysis;
}

export default function SilenceAnalysisCard({ silences }: SilenceAnalysisCardProps) {
  return (
    <Card elevation={2} variant='card1'>

      <CardHeader
        title={<Typography variant="h1">
          Análise de Pausas e Silêncios
        </Typography>}

        avatar={<BarChart3 size={24} color={theme.palette.purple.light1}/>}
      />
      <CardContent>
        <Stack direction="row" spacing={4} sx={{ mb: 2, justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Hourglass size={30} color={theme.palette.purple.main} />
            <Typography variant="h3" component="p" fontWeight="bold">
              {silences.pauses}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pausas Longas
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Timer size={30} color={theme.palette.purple.main} />
            <Typography variant="h3" component="p" fontWeight="bold">
              {silences.duration.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tempo Total em Pausa
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Pausas longas (maiores que 1 segundo) podem indicar hesitação ou falta de fluência na fala.
        </Typography>
      </CardContent>
    </Card>
  );
}