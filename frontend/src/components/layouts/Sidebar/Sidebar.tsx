import { useSidebar } from '@/contexts/SidebarContext';
import { useNavigation } from '@/hooks/useNavigation';
import { SidebarProps } from './sidebar.types';
import { getSidebarContainerStyles } from './sidebar.styles';
import { UserProfile } from './SidebarUser';
import { NAV_ITEMS, SETTINGS_NAV } from './sidebar.constants';
import { NavItem } from './SidebarNav';
import { Box, List } from '@mui/material';
import { SidebarToggle } from './SidebarToggle';

export function Sidebar({ user, onCollapse }: SidebarProps) {
  const { isCollapsed, toggle } = useSidebar();
  const { isActive } = useNavigation();

  const handleToggle = () => {
    toggle();
    onCollapse?.(isCollapsed);
  };

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
          <NavItem
            item={SETTINGS_NAV}
            isActive={isActive(SETTINGS_NAV.href)}
            isCollapsed={isCollapsed}
          />
        </List>

        <SidebarToggle isCollapsed={isCollapsed} onToggle={handleToggle} />
      </Box>
    </Box>
  );
}
