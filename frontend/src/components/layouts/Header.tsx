import { AppBar, Toolbar } from '@mui/material';

import theme from '@/styles/theme';
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
      <Toolbar variant="toolbar1">
        <Logo />
      </Toolbar>
    </AppBar>
  );
}