import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import theme from '@/styles/theme';

export function ActionButtons() {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
      <Button
        variant="contained"
        size="large"
        onClick={() => router.push('/upload')}
        sx={{
          bgcolor: theme.palette.purple.main,
          '&:hover': { bgcolor: theme.palette.purple.main + 'CC' },
          px: 4,
          py: 1.5
        }}
      >
        Nova Análise
      </Button>
      <Button
        variant="outlined"
        size="large"
        onClick={() => router.push('/analyses')}
        sx={{
          borderColor: theme.palette.purple.light1,
          color: theme.palette.purple.contrastText,
          '&:hover': { 
            borderColor: theme.palette.purple.main,
            bgcolor: theme.palette.purple.main + '20'
          },
          px: 4,
          py: 1.5
        }}
      >
        Ver Histórico
      </Button>
    </Box>
  );
}