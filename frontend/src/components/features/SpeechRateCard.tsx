import { Card, CardContent, CardHeader, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { Gauge, Info } from 'lucide-react';


interface SpeechRateCardProps {
    speechRate: number;
}

export default function SpeechRateCard({ speechRate }: SpeechRateCardProps) {

    const getSpeechRateFeedback = (rate?: number) => {
        if (rate === undefined) return 'Ritmo não calculado.';
        if (rate <= 100) return 'Seu ritmo está abaixo do recomendado. Tente falar um pouco mais rápido.';
        if (rate > 160) return 'Seu ritmo está acima do recomendado. Tente falar um pouco mais devagar.';
        
        return 'Seu ritmo está dentro da faixa recomendada!';
    };


    return (
        <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
                title={<Typography variant="h6">Ritmo da Fala</Typography>}
                avatar={<Gauge size={24} className="text-blue-500" />}
                action={
                <Tooltip title="O ritmo ideal de fala para apresentações é entre 100 e 160 palavras por minuto (PPM).">
                    <Info size={20} className="text-gray-500" />
                </Tooltip>
                }
                sx={{ bgcolor: 'grey.100' }}
            />

            <CardContent>
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h3" fontWeight="bold" color="primary">
                        {speechRate !== undefined ? Math.round(speechRate) : '--'}
                        <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 1 }}>
                        PPM
                        </Typography>
                    </Typography>
                    <Divider flexItem />
                    <Typography variant="body1" color="text.secondary" align="center">
                        {getSpeechRateFeedback(speechRate)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    )

}