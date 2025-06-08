import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bruno_Ace_SC } from 'next/font/google';
import './globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/styles/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';

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

export const metadata: Metadata = {
  title: 'isPitch',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${brunoAce.variable}`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className='flex flex-col min-h-screen'>
              <Header/>
              <main className='flex-grow flex flex-col'>
                {children}
              </main>
              <Footer/>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
