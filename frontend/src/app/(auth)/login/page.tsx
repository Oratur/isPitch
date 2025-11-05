'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import theme from '@/styles/theme';
import { useLogin } from '@/domain/auth/hooks';
import MyBox from '@/components/ui/MyBox';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        bgcolor: theme.palette.purple.dark,
        p: 2,
      }}
    >
      <MyBox
        variant="card"
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 450,
          bgcolor: theme.palette.purple.light2,
          border: `1px solid ${theme.palette.purple.light1}`,
          p: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ color: theme.palette.purple.contrastText, mb: 1 }}>
          Bem-vindo de volta!
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.purple.light1, mb: 3 }}>
          Faça login para ter acesso a todas as funcionalidades do <strong>isPitch</strong>!
        </Typography>

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: theme.palette.purple.contrastText,
            },
          }}
          InputLabelProps={{
            sx: { color: theme.palette.purple.light1 },
          }}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: theme.palette.purple.contrastText,
            },
          }}
          InputLabelProps={{
            sx: { color: theme.palette.purple.light1 },
          }}
        />

        <Button
          type="submit"
          variant="button1"
          fullWidth
          size="large"
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mb: 2 }}
        >
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>

        <Typography variant="body2" sx={{ color: theme.palette.purple.light1, textAlign: 'center' }}>
          Não tem uma conta?{' '}
          <MuiLink
            component={Link}
            href="/register"
            sx={{
              color: theme.palette.purple.main,
              fontWeight: 600,
              '&:hover': { color: theme.palette.purple.light1 },
            }}
          >
            Cadastre-se
          </MuiLink>
        </Typography>
      </MyBox>
    </Box>
  );
}