import { AppBar, Toolbar, Button, Box } from '@mui/material';
import theme from '@/styles/theme';
import Link from 'next/link';
import { Logo } from '../ui';

export function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: '#BA9BDA',
      }}
    >
      <Toolbar variant="toolbar1"
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // separa o logo e o grupo de botões
          alignItems: 'center',
        }}
      >
        <Logo />
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="button1"
            component={Link}
            href='/login'
            sx={{
              bgcolor: theme.palette.purple.select1
            }}
            size="small"
            
          >
            Entrar
          </Button>

          <Button
            variant="button1"
            component={Link}
            href='/register'
            size="small"
          >
            Criar conta
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}