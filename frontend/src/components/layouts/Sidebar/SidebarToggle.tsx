import { Box, IconButton, Divider } from '@mui/material';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { memo } from 'react';

import { ANIMATION_DURATION } from './sidebar.constants';
import { Logo } from '@/components/ui/Logo';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle = memo(function SidebarToggle({
  isCollapsed,
  onToggle,
}: SidebarToggleProps) {
  return (
    <>
      <Divider sx={{ my: 2, bgcolor: 'purple.light1', opacity: 0.2 }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isCollapsed ? 0 : 1,
          transition: `gap ${ANIMATION_DURATION} ease`,
        }}
      >
        <Box
          sx={{
            opacity: isCollapsed ? 0 : 1,
            transition: `opacity ${ANIMATION_DURATION} ease`,
            display: isCollapsed ? 'none' : 'block',
          }}
        >
          <Logo size="medium" />
        </Box>
        <IconButton
          onClick={onToggle}
          sx={{
            color: 'purple.light1',
            ml: isCollapsed ? 0 : 'auto',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(127, 19, 236, 0.08)',
              color: 'primary.main',
            },
          }}
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </IconButton>
      </Box>
    </>
  );
});