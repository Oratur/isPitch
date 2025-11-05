export interface NavItem {
    text: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
}

export interface UserInfo {
    name: string;
    initials: string;
    email?: string;
    avatarUrl?: string;
}

export interface SidebarContextValue {
    isCollapsed: boolean;
    toggle: () => void;
    setCollapsed: (value: boolean) => void;
}

export interface SidebarProps {
    user: UserInfo;
    onCollapse?: (collapsed: boolean) => void;
}