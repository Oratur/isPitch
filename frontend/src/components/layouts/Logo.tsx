import { Typography } from '@mui/material';
import Link from 'next/link';

export function Logo() {
  return (
    <Typography
      variant="h6"
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
  );
}