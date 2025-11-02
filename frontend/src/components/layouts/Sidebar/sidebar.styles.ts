import { SxProps, Theme } from '@mui/material';
import { ANIMATION_DURATION, SIDEBAR_WIDTH } from './sidebar.constants';


export const getSidebarContainerStyles = (isCollapsed: boolean): SxProps<Theme> => ({
    width: isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
    transition: `width ${ANIMATION_DURATION} ease-in-out`,
    height: '100vh',
    position: 'sticky',
    top: 0,
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    backgroundColor: 'purple.light2',
    borderRight: '1px solid',
    borderColor: 'divider',
    p: 2,
    color: 'primary.contrastText',
});

export const getUserSectionStyles = (isCollapsed: boolean): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? 0 : 2,
    p: 1,
    mb: 2,
    justifyContent: 'center',
    transition: `gap ${ANIMATION_DURATION} ease`,
});

export const getNavItemStyles = (isActive: boolean, isCollapsed: boolean): SxProps<Theme> => ({
    borderRadius: '8px',
    transition: `all ${ANIMATION_DURATION} ease`,
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    px: isCollapsed ? 2.5 : 2,
    mb: 1,

    '& .MuiListItemIcon-root': {
        minWidth: 0,
        mr: isCollapsed ? 0 : 2,
        justifyContent: 'center',
        color: isActive ? 'primary.main' : 'purple.light1',
        transition: `all ${ANIMATION_DURATION} ease`,
    },

    '& .MuiListItemText-primary': {
        fontSize: '0.95rem',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'primary.contrastText' : 'purple.light1',
        whiteSpace: 'nowrap',
        width: isCollapsed ? 0 : 'auto',
        overflow: 'hidden',
        opacity: isCollapsed ? 0 : 1,
        transition: `all ${ANIMATION_DURATION} ease`,
    },

    ...(isActive && !isCollapsed && {
        backgroundColor: 'rgba(127, 19, 236, 0.15)',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        paddingLeft: 'calc(16px - 4px)',
        '&:hover': {
            backgroundColor: 'rgba(127, 19, 236, 0.25)',
        },
    }),

    ...(!isActive && {
        '&:hover': {
            backgroundColor: 'rgba(127, 19, 236, 0.08)',
        },
    }),
});

export const getFooterStyles = (isCollapsed: boolean): SxProps<Theme> => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isCollapsed ? 0 : 1,
    transition: `gap ${ANIMATION_DURATION} ease`,
});