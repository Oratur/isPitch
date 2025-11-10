// frontend/src/app/(private)/analyses/page.tsx
// Versão simplificada para testar se a rota funciona

'use client';

import { Box, Typography } from '@mui/material';

export default function AnalysesPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: 'white' }}>
        Página de Análises Funcionando! ✅
      </Typography>
      <Typography sx={{ color: 'white', mt: 2 }}>
        Se você está vendo isso, a rota está funcionando corretamente.
      </Typography>
    </Box>
  );
}