// src/components/layouts/Header.tsx
import { AppBar, Toolbar } from '@mui/material';
import { Logo } from './Logo';

export function Header() {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Logo/>
      </Toolbar>
    </AppBar>
  );
}