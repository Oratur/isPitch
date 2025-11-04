'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import theme from '@/styles/theme';
import { toast } from 'react-hot-toast';
import { useRegister } from '@/domain/auth/hooks';
import MyBox from '@/components/ui/MyBox';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    register({ name, email, password });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        bgcolor: theme.palette.purple.dark,
        p: 2,
      }}
    >
      <MyBox
        variant="card"
        component="form"
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
          Crie sua conta
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.purple.light1, mb: 3 }}>
          Já tem uma conta?{' '}
          <MuiLink
            component={Link}
            href="/login"
            sx={{
              color: theme.palette.purple.main,
              fontWeight: 600,
              '&:hover': { color: theme.palette.purple.light1 },
            }}
          >
            Log in
          </MuiLink>
        </Typography>

        <TextField
          fullWidth
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <TextField
          fullWidth
          label="Confirme a senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isPending}
          sx={{ mb: 3 }}
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
        >
          {isPending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </MyBox>
    </Box>
  );
}