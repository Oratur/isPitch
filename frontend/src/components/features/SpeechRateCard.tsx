import { Card, CardContent, CardHeader, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { Gauge, Info } from 'lucide-react';
import theme from '@/styles/theme';


interface SpeechRateCardProps {
    speechRate: number;
}

export default function SpeechRateCard({ speechRate }: SpeechRateCardProps) {
    const MIN_RECOMMENDED_RATE = 100;
    const MAX_RECOMMENDED_RATE = 160;

    const getSpeechRateFeedback = (rate: number) => {
        if (rate <= MIN_RECOMMENDED_RATE) return 'Seu ritmo está abaixo do recomendado. Tente falar um pouco mais rápido.';
        if (rate > MAX_RECOMMENDED_RATE) return 'Seu ritmo está acima do recomendado. Tente falar um pouco mais devagar.';

        return 'Seu ritmo está dentro da faixa recomendada!';
    };


    return (
        <Card elevation={2} variant='card1'
            sx={{
                height: '98%'
            }}
        >
            <CardHeader
                title={<Typography variant="h1">
                    Ritmo da Fala
                </Typography>}
                avatar={<Gauge size={24} color={theme.palette.purple.light1} />}
                
                action={
                    <Tooltip title="O ritmo ideal de fala para apresentações é entre 100 e 160 palavras por minuto (PPM).">
                        <Info size={20} style={{marginRight: '0.5rem', color: theme.palette.purple.light1}} />
                    </Tooltip>
                }
                sx={{ bgcolor: theme.palette.purple.light2 }}
            />

            <CardContent>
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h3" fontWeight="bold" color={theme.palette.purple.main}>
                        {Math.round(speechRate)}
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
    );

}