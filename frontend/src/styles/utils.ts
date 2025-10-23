import { Theme } from '@mui/material/styles';

// Declarar variantes customizadas para Button
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    button1: true;
  }
}

// Declarar variantes customizadas para Paper
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    dashed: true;
    gradient: true;
    dropzone: true;
    card1: true;
  }
}

// Declarar variantes customizadas para Card
declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    card1: true;
  }
}

// Declarar variantes customizadas para CardHeader
declare module '@mui/material/CardHeader' {
  interface CardHeaderPropsVariantOverrides {
    cardHeader1: true;
  }
}

// Declarar variantes customizadas para Toolbar
declare module '@mui/material/Toolbar' {
  interface ToolbarPropsVariantOverrides {
    toolbar1: true;
  }
}

// Cores válidas da paleta
export const PALETTE_COLORS = [
    'primary', 
    'secondary', 
    'error', 
    'warning', 
    'info', 
    'success',
    'purple',
] as const;

export type PaletteColor = typeof PALETTE_COLORS[number];
/**
 * Obtém uma cor válida da paleta ou retorna o fallback
 */
export function getValidPaletteColor(
  color: string | undefined,
  fallback: PaletteColor = 'primary'
): PaletteColor {
  if (color && PALETTE_COLORS.includes(color as PaletteColor)) {
    return color as PaletteColor;
  }
  return fallback;
}

/**
 * Obtém a cor principal de uma cor da paleta
 */
export function getPaletteColorMain(theme: Theme, color: string | undefined): string {
  const validColor = getValidPaletteColor(color);
  return theme.palette[validColor].main;
}

/**
 * Adiciona opacidade a uma cor em formato hexadecimal
 */
export function addAlpha(hexColor: string, opacity: number): string {
  // Remove o # se existir
  const hex = hexColor.replace('#', '');
  
  // Converte opacidade (0-1) para hexadecimal (00-FF)
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  
  return `#${hex}${alpha}`;
}