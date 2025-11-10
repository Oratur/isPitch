import { Box, Skeleton } from '@mui/material';

export function AudioDropzoneSkeleton() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: '2px dashed',
        borderColor: 'purple.light1',
        borderRadius: 2,
        backgroundColor: 'purple.light2',
        p: { xs: 4, sm: 6, md: 8 },
        textAlign: 'center',
      }}
    >
      {/* Skeleton do ícone */}
      <Skeleton 
        variant="circular" 
        width={64} 
        height={64}
        sx={{ mx: 'auto', mb: 3 }}
        animation="wave"
      />
      
      {/* Skeleton do botão */}
      <Skeleton 
        variant="rounded" 
        width={240} 
        height={42}
        sx={{ mx: 'auto', mb: 2, borderRadius: 1 }}
        animation="wave"
      />
      
      {/* Skeleton do texto "ou arraste" */}
      <Skeleton 
        variant="text" 
        width="60%" 
        height={20}
        sx={{ mx: 'auto', mb: 2, borderRadius: 1 }}
        animation="wave"
      />

      {/* Skeleton do texto "Formatos suportados" */}
      <Skeleton 
        variant="text" 
        width="50%" 
        height={16}
        sx={{ mx: 'auto', borderRadius: 1 }}
        animation="wave"
      />
    </Box>
  );
}