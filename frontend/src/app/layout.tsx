'use client';
import { useState, useEffect, useMemo } from 'react';
import { Geist, Geist_Mono, Bruno_Ace_SC } from 'next/font/google';
import './globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getAppTheme } from '@/styles/theme'; // ✅ Agora importa a função
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import QueryProvider from '@/contexts/QueryProvider';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const brunoAce = Bruno_Ace_SC({
  variable: '--font-bruno-ace',
  subsets: ['latin'],
  weight: '400',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);

  // Detecta preferência do sistema ao montar
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Recria o tema quando darkMode mudar
  const muiTheme = useMemo(() => {
    return getAppTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <html lang="pt-BR">
      <head>
        <title>isPitch</title>
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${brunoAce.variable}`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={muiTheme}>
            <Toaster 
              position='bottom-left' 
              toastOptions={{
                duration: 5000
              }}
            />
            <QueryProvider>
              <CssBaseline />
              <div className='flex flex-col min-h-screen'>
                <Header/>
                <main className='flex-grow flex flex-col'>
                  {children}
                </main>
                <Footer/>
              </div>
            </QueryProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}