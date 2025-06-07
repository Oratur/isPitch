// src/components/layouts/Footer.tsx
import { Container, Link as MuiLink, Typography, Stack, Divider } from '@mui/material';
import Link from 'next/link';

const footerLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'API Docs', href: '/docs' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 py-4 mt-auto bg-gray-100">
      <Container
        maxWidth="lg"
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: 'var(--font-bruno-ace)' }}
        >
          © isPitch 2025
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
        >
          {footerLinks.map((item) => (
            <MuiLink
              key={item.label}
              component={Link}
              href={item.href}
              variant="body2"
              underline="none"
              className="hover:text-blue-500 transition-colors"
              sx={{ color: 'text.secondary' }}
            >
              {item.label}
            </MuiLink>
          ))}
        </Stack>
      </Container>
    </footer>
  );
}