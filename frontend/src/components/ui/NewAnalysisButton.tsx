'use client';

import { Button, Fab, Tooltip, useMediaQuery } from '@mui/material';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import theme from '@/styles/theme';
import { useTheme } from '@mui/material/styles';

type Props = {
  anchored?: boolean;
};

export function NewAnalysisButton({ anchored = false }: Props) {
  const router = useRouter();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleClick = () => {
    router.push('/upload');
  };

  const positionStyles = anchored
    ? {
        position: 'absolute' as const,
        top: { xs: 'auto', md: 24 },
        bottom: { xs: 32, md: 'auto' },
        right: { xs: 24, md: 48 },
      }
    : {
        position: 'fixed' as const,
        top: { xs: 'auto', md: 24 },
        bottom: { xs: 32, md: 'auto' },
        right: { xs: 24, md: 48 },
      };

  return (
    <Tooltip title="Iniciar nova análise" placement="left">
      {isMobile ? (
        <Fab
          color="primary"
          aria-label="nova análise"
          onClick={handleClick}
          sx={{
            ...positionStyles,
            bgcolor: theme.palette.purple.main,
            '&:hover': { bgcolor: theme.palette.purple.main + 'CC' },
            zIndex: 1400,
            width: 64,  
            height: 64, 
            boxShadow: theme.shadows[4],
          }}
        >
          <Plus size={32} />
        </Fab>
      ) : (
        <Button
          onClick={handleClick}
          variant="contained"
          startIcon={<Plus size={22} />}
          sx={{
            ...positionStyles,
            bgcolor: theme.palette.purple.main,
            '&:hover': { bgcolor: theme.palette.purple.main + 'CC' },
            zIndex: 1400,
            borderRadius: 2,
            height: 56,    
            px: 4,         
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: theme.shadows[4],
          }}
        >
          Nova análise
        </Button>
      )}
    </Tooltip>
  );
}
