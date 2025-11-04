import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { ElementType } from 'react';

//props customizadas
type MyBoxCustomProps = {
  variant?: 'card' | 'gradient' | 'sideBar' | 'cardTranscription';
};

const MyBoxRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<MyBoxCustomProps>(({ theme, variant }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
  maxWidth: '600px',
  textAlign: 'center',

  ...(variant === 'card' && {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
  }),

  ...(variant === 'cardTranscription' && {
    backgroundColor: theme.palette.background.paper,
    border: 1,
    borderRadius: 2,
    p: 2,
    maxHeight: 1000,
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    typography: 'body2',
    color: theme.palette.purple.dark,
    padding: theme.spacing(4),
  }),

  ...(variant === 'gradient' && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: theme.palette.primary.contrastText,
  }),

  ...(variant === 'sideBar' && {
    color: theme.palette.primary.contrastText,
    width: 280,
    borderRight: '1px solid',
    borderColor: 'divider',
    p: 2,
    backgroundColor: theme.palette.purple.light2,
    flexDirection: 'column',
    padding: theme.spacing(3),
  }),
}));

// props "público"
export type MyBoxProps<T extends ElementType> = BoxProps<T, { component?: T } & MyBoxCustomProps>;

//componente wrapper genérico
const MyBox = <T extends ElementType = 'div'>(props: MyBoxProps<T>) => {
  return <MyBoxRoot {...props} />;
};

export default MyBox;