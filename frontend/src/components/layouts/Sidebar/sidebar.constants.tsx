import { Home, BarChart2, History, Settings } from 'lucide-react';
import { NavItem } from './sidebar.types';

export const NAV_ITEMS: NavItem[] = [
  {
    text: 'Início',
    href: '/dashboard',
    icon: <Home size={20} />,
  },
  {
    text: 'Análises',
    href: '/analyses',
    icon: <BarChart2 size={20} />,
  },
  {
    text: 'Submissões',
    href: '/submissions',
    icon: <History size={20} />,
  },
];

export const SETTINGS_NAV: NavItem = {
    text: 'Configurações',
    href: '/settings',
    icon: <Settings size={ 20} />,
};

export const SIDEBAR_WIDTH = {
    expanded: 280,
    collapsed: 88,
};

export const ANIMATION_DURATION = '0.3s';