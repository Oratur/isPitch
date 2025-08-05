'use client';

import { SilenceAnalysis } from '@/types/analysis';
import { Card, CardContent, Divider, Stack, Typography, Box, CardHeader } from '@mui/material';
import { BarChart3, Hourglass, Timer } from 'lucide-react';

interface SilenceAnalysisCardProps {
  silences: SilenceAnalysis;
}

export default function SilenceAnalysisCard({ silences }: SilenceAnalysisCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">Análise de Pausas e Silêncios</Typography>}
        avatar={<BarChart3 size={24} className="text-gray-500" />}
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent>
        <Stack direction="row" spacing={4} sx={{ mb: 2, justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Hourglass size={28} className="text-blue-500" />
            <Typography variant="h3" component="p" fontWeight="bold">
              {silences.pauses}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pausas Longas
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Timer size={28} className="text-green-500" />
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