import { AppBar, Toolbar } from '@mui/material';
import { Logo } from './Logo';
import theme from '@/styles/theme';


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
      <Toolbar variant="toolbar1" sx={{ bgcolor: theme.palette.purple.dark}}>
        <Logo />
      </Toolbar>
    </AppBar>
  );
}