import { Typography, TypographyProps } from '@mui/material';
import Link from 'next/link';
import { memo, ElementType } from 'react'; 


interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  asLink?: boolean;
  sx?: TypographyProps['sx'];
}

type ConditionalProps = {
  component?: ElementType;
  href?: string;
};

export const Logo = memo(function Logo({
  size = 'medium',
  asLink = false,
  sx = {},
}: LogoProps) {
  
  const variants = {
    small: 'body1',
    medium: 'h6',
    large: 'h5',
  } as const;

  const baseSx: TypographyProps['sx'] = {
    fontFamily: 'var(--font-bruno-ace)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };
  
  const conditionalProps: ConditionalProps = {};
  let conditionalSx: TypographyProps['sx'] = {};

  if (asLink) {
    conditionalProps.component = Link;
    conditionalProps.href = '/';
    conditionalSx = {
      color: 'text.primary',
      '&:hover': { color: 'var(--color-button-1)' },
    };
  } else {
    conditionalSx = {
      color: 'primary.contrastText',
      fontWeight: 700,
    };
  }
  return (
    <Typography
      variant={variants[size]}
      {...conditionalProps}
      sx={{
        ...baseSx,         
        ...conditionalSx,  
        ...sx,             
      }}
    >
      isPitch
    </Typography>
  );
});
