'use client';

import { Box } from '@mui/material';
import theme from '@/styles/theme';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/layouts/Sidebar';


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: 'Nome Sobrenome',
    initials: 'NS',
    email: 'usuario@exemplo.com',
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
          user={user}
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