'use client';

import { Box, CircularProgress } from '@mui/material';
import theme from '@/styles/theme';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/layouts/Sidebar';
import { useCurrentUser } from '@/domain/auth/hooks/useCurrentUser'; // Importe o hook criado
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { data: user, isLoading, isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          bgcolor: theme.palette.purple.dark 
        }}
      >
        <CircularProgress sx={{ color: theme.palette.purple.light1 }} />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null; 
  }

  const sidebarUser = {
    name: user.name,
    initials: user.initials,
    avatarUrl: undefined
  };

  return (
    <SidebarProvider>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: theme.palette.purple.dark,
        }}
      >
        <Sidebar 
          user={sidebarUser}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, lg: 4 },
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </SidebarProvider>
  );
}