import React, { createContext, useContext, useState } from 'react';

interface SidebarConfigContextProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  hovered: boolean;
  setHovered: (v: boolean) => void;
}

const SidebarConfigContext = createContext<SidebarConfigContextProps | undefined>(undefined);

export function SidebarConfigProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <SidebarConfigContext.Provider value={{ collapsed, setCollapsed, hovered, setHovered }}>
      {children}
    </SidebarConfigContext.Provider>
  );
}

export function useSidebarConfig() {
  const ctx = useContext(SidebarConfigContext);
  if (!ctx) throw new Error('useSidebarConfig must be used within SidebarConfigProvider');
  return ctx;
} 