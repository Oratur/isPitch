// src/components/layouts/Header.tsx
import { AppBar, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

export function Header() {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6" // O tema agora aplica a fonte "Bruno Ace SC" aqui
          component={Link}
          href="/"
          sx={{
            color: 'text.primary',
            textDecoration: 'none',
            transition: 'color 0.2s',
            '&:hover': { color: 'primary.main' },
          }}
        >
          isPitch
        </Typography>
      </Toolbar>
    </AppBar>
  );
}