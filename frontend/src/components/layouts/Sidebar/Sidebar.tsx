import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/hooks/useNavigation';
import { SidebarProps } from './sidebar.types';
import { getSidebarContainerStyles, getNavItemStyles } from './sidebar.styles';
import { UserProfile } from './SidebarUser';
import { NAV_ITEMS } from './sidebar.constants';
import { NavItem } from './SidebarNav';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { SidebarToggle } from './SidebarToggle';
import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { removeClientSideToken } from '@/domain/auth/services/tokenService';

export function Sidebar({ user, onCollapse }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();
  const { isActive } = useNavigation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleToggle = () => {
    toggle();
    onCollapse?.(isCollapsed);
  };

  const handleLogout = () => {
    removeClientSideToken();
    queryClient.clear();
    router.push('/login');
  };

  const logoutButton = (
    <ListItemButton
      onClick={handleLogout}
      sx={getNavItemStyles(false, isCollapsed)}
      aria-label="Sair"
    >
      <ListItemIcon sx={{ 
        minWidth: 0, 
        mr: isCollapsed ? 0 : 2, 
        justifyContent: 'center', 
        color: 'purple.light1' 
      }}>
        <LogOut size={20} />
      </ListItemIcon>
      <ListItemText primary="Sair" sx={{ opacity: isCollapsed ? 0 : 1 }} />
    </ListItemButton>
  );

  return (
    <Box
      component="aside"
      sx={getSidebarContainerStyles(isCollapsed)}
      role="navigation"
      aria-label="Menu principal"
    >
      <UserProfile user={user} isCollapsed={isCollapsed} />

      <List component="nav" sx={{ width: '100%', flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
          />
        ))}
      </List>

      <Box sx={{ mt: 'auto' }}>
        <List component="nav" sx={{ width: '100%' }}>
          {isCollapsed ? (
            <Tooltip title="Sair" placement="right" arrow>
              {logoutButton}
            </Tooltip>
          ) : (
            logoutButton
          )}
        </List>

        <SidebarToggle isCollapsed={isCollapsed} onToggle={handleToggle} />
      </Box>
    </Box>
  );
}