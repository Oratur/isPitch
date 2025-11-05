import { createContext, useContext, PropsWithChildren } from 'react';
import { useSidebarCollapse } from '../hooks/useSidebarCollapse';
import { SidebarContextValue } from '@/components/layouts/Sidebar';


const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: PropsWithChildren) {
  const sidebarState = useSidebarCollapse();

  return (
    <SidebarContext.Provider value={sidebarState}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}