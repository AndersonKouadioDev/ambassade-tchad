'use client';
import { SidebarConfigProvider, useSidebarConfig } from './SidebarConfigContext';
import SidebarHeader from './SidebarHeader';
import SidebarMenuList from './SidebarMenuList';
import SidebarFooter from './SidebarFooter';

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) {
  return (
    <SidebarConfigProvider>
      {/* Backdrop mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <SidebarInner open={open} />
    </SidebarConfigProvider>
  );
}

function SidebarInner({ open }: { open: boolean }) {
  const { setHovered } = useSidebarConfig();
  return (
    <aside
      className={
        `bg-white dark:bg-blue-900 border-r   dark:border-blue-900 flex flex-col min-h-screen transition-all duration-300 relative
        ${open ? 'fixed top-0 left-0 z-50 w-80 max-w-full h-full translate-x-0 pointer-events-auto opacity-100 md:static md:w-72 md:z-auto md:h-auto md:max-w-none md:pointer-events-auto md:opacity-100 md:block' : 'hidden md:block md:static md:w-72 md:z-auto md:h-auto md:max-w-none md:pointer-events-auto md:opacity-100'}
        `
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: open ? '0 0 0 9999px rgba(0,0,0,0.0)' : undefined }}
    >
      <SidebarHeader />
      <SidebarMenuList />
      <SidebarFooter />
    </aside>
  );
} 