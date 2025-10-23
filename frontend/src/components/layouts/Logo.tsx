import { Typography } from '@mui/material';
import Link from 'next/link';

export function Logo() {
  return (
    <Typography
      variant="h5"
      component={Link}
      href="/"
      sx={{
        color: 'text.primary',
        textDecoration: 'none',
        transition: 'color 0.2s',
        '&:hover': { color: 'var(--color-button-1)' },
        fontFamily: 'var(--font-bruno-ace)',
      }}
    >
      isPitch
    </Typography>
  );
}