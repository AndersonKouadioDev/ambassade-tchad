import React, { createContext, useContext, useState } from 'react';

interface SidebarConfigContextProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  hovered: boolean;
  setHovered: (v: boolean) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SidebarConfigContext = createContext<SidebarConfigContextProps | undefined>(undefined);

export function SidebarConfigProvider({ children, setOpen, open }: { children: React.ReactNode; setOpen: (v: boolean) => void; open: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <SidebarConfigContext.Provider value={{ collapsed, setCollapsed, hovered, setHovered, open, setOpen }}>
      {children}
    </SidebarConfigContext.Provider>
  );
}

export function useSidebarConfig() {
  const ctx = useContext(SidebarConfigContext);
  if (!ctx) throw new Error('useSidebarConfig must be used within SidebarConfigProvider');
  return ctx;
} 