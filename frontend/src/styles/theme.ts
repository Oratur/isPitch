'use client';
import { createTheme, Theme } from '@mui/material/styles';
import './utils';

declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary'] & {
      light1?: string;
      light2?: string;
      select1?: string;
      hover1?: string;
    };
    brand: Palette['primary'];
  }

  interface PaletteOptions {
    purple?: PaletteOptions['primary'] & {
      light1?: string;
      light2?: string;
      select1?: string;
      hover1?: string;
    };
    brand?: PaletteOptions['primary'];
  }
}

export function getAppTheme(mode: 'light' | 'dark'): Theme {
  return createTheme({
    palette: {
      mode, // Usa o modo passado como parâmetro

      // Cores Principais
      primary: {
        main: '#7F13EC',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },

      purple: {
        main: '#7F13EC',      // Roxo principal
        light1: '#BA9BDA',     // background Roxo Acinzentado
        light2: '#1F132C',     // background Roxo Claro
        dark: '#120C18',      // background Roxo Escuro
        select1: '#362348',   // cor de fundo de botões selecionados
        hover1:'rgba(127, 19, 236, 0.25)',
        contrastText: '#fff',
      },

      secondary: {
        main: '#dc004e',
        light: '#f73378',
        dark: '#9a0036',
        contrastText: '#fff',
      },

      // Cores Semânticas
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff',
      },

      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff',
      },

      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff',
      },

      success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#fff',
      },

      // Cores de Fundo e Superfície (variam com o modo)
      ...(mode === 'light'
        ? {

          background: {
            default: '#120C18',
            paper: '#dbdbdbff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
          action: {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
            focus: 'rgba(0, 0, 0, 0.12)',
          },
        }
        : {
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.6)',
            disabled: 'rgba(255, 255, 255, 0.38)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
          action: {
            active: 'rgba(255, 255, 255, 0.54)',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.26)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            focus: 'rgba(255, 255, 255, 0.12)',
          },
        }),
    },

    typography: {
      fontFamily: ['var(--font-geist-sans)', 'Arial', 'sans-serif'].join(','),
    },

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: () => ({
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 24px',
          }),

          sizeSmall: {
            padding: '6px 16px',
            fontSize: '0.875rem',
          },

          sizeLarge: {
            padding: '12px 32px',
            fontSize: '1rem',
          },
        },

        variants: [
          {
            props: { variant: 'button1' },
            style: ({ theme }) => {
              const button1Color = theme.palette.purple.main;

              return {
                backgroundColor: button1Color,
                color: theme.palette.getContrastText(button1Color),
                border: 'none',

                '&:hover': {
                  backgroundColor: `${button1Color}B3`, // 70% opacity
                },

                '&:active': {
                  backgroundColor: `${button1Color}29`, // 16% opacity
                },

                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              };
            },
          },
        ],
      },

      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: () => ({
            borderRadius: 12,
            transition: 'all 0.3s ease',
          }),

          outlined: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
          }),

          elevation1: ({ theme }) => ({
            boxShadow: theme.shadows[1],
          }),

          elevation2: ({ theme }) => ({
            boxShadow: theme.shadows[2],
          }),
        },

        variants: [
          {
            props: { variant: 'dashed' },
            style: ({ theme }) => ({
              border: `2px dashed ${theme.palette.divider}`,
              backgroundColor: 'transparent',

              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },
            }),
          },
          {
            props: { variant: 'gradient' },
            style: ({ theme }) => ({
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: theme.palette.primary.contrastText,
            }),
          },

          {
            props: { variant: 'dropzone' },
            style: ({ theme }) => ({
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: theme.palette.divider,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              padding: theme.spacing(4),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',

              [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(6),
              },

              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },

              '&[data-active="true"]': {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              },

              '&[data-reject="true"]': {
                borderColor: theme.palette.error.main,
                backgroundColor: theme.palette.error.light + '08', // 8% de opacidade
              },
            }),
          },

        ],
      },

      MuiCard: {
        variants: [
          {
            props: { variant: 'card1' },
            style: ({ theme }) => ({
              width: '100%',
              backgroundColor: '#1F132C', // #1F132C
              borderColor: theme.palette.purple.light2, // #FFF
              borderWidth: 1,
              borderStyle: 'solid',
              color: theme.palette.text.primary,
            }),
          },
        ],
      },

      MuiToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: '64px',
            padding: theme.spacing(0, 2),
            transition: 'all 0.3s ease',
            backgroundColor: theme.palette.background.default,
          }),
        },

        variants: [
          {
            props: { variant: 'toolbar1' },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.purple.dark,
              color: theme.palette.primary.contrastText,
              borderRadius: theme.shape.borderRadius,
              padding: theme.spacing(1.5, 3),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }),
          },
        ],
      },

      MuiTypography: {
        styleOverrides: {
          root: {
            
          },

          h4: {
            fontWeight: 700,
            marginBottom: '0.5rem',
          },

          body1: {
            lineHeight: 1.6,
          },

          body2: {
            lineHeight: 1.5,
          },
        },

        variants: [
          {
            props: { variant: 'caption' },
            style: ({ theme }) => ({
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
            }),
          },

          {
            props: { variant: 'subtitle1' },
            style: () => ({
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 'bold',
            }),
          },

          {
            props: { variant: 'h5' },
            style: () => ({
              color: '#fff',
              fontWeight: 500,
            }),
          },

          {
            props: { variant: 'h1' }, //tipografia dos títulos dos cards 
            style: ({ theme }) => ({
              color: theme.palette.purple.light1,
              fontWeight: 500,
              fontSize: '1.7rem',
            }),
          },

        ],
      },
    },
  });
}

const theme = getAppTheme('light');
export default theme;