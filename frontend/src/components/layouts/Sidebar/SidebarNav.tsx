import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
} from '@mui/material';
import Link from 'next/link';
import { memo } from 'react';
import { getNavItemStyles } from './sidebar.styles';
import type { NavItem as NavItemType } from './sidebar.types';

interface SidebarNavItemProps {
  item: NavItemType;
  isActive: boolean;
  isCollapsed: boolean;
}

export const NavItem = memo(function NavItem({
  item,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) {
  const content = (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        href={item.href}
        selected={isActive}
        sx={getNavItemStyles(isActive, isCollapsed)}
        aria-label={item.text}
        aria-current={isActive ? 'page' : undefined}
      >
        <ListItemIcon>
          {item.badge && item.badge > 0 ? (
            <Badge badgeContent={item.badge} color="error">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={item.text} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
});