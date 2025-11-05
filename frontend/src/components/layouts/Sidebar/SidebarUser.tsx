import { Box, Typography, Avatar } from '@mui/material';
import { memo } from 'react';
import { UserInfo } from './sidebar.types';

interface UserProfileProps {
  user: UserInfo;
  isCollapsed: boolean;
}

export const UserProfile = memo(function UserProfile({
  user,
  isCollapsed,
}: UserProfileProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed ? 0 : 2,
        p: 1,
        mb: 2,
        justifyContent: 'center',
        transition: 'gap 0.3s ease',
      }}
      role="region"
      aria-label="Perfil do usuário"
    >
      <Avatar
        src={user.avatarUrl}
        alt={user.name}
        sx={{
          bgcolor: 'primary.main',
          width: 40,
          height: 40,
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        {user.initials}
      </Avatar>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          opacity: isCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease',
          display: isCollapsed ? 'none' : 'block',
        }}
      >
        <Typography variant="body1" color="white" fontWeight="bold" noWrap>
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          color="purple.light1"
          noWrap
          sx={{
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Ver perfil
        </Typography>
      </Box>
    </Box>
  );
});