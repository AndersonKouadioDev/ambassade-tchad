import Image from 'next/image';
import { useSidebarConfig } from './SidebarConfigContext';

export default function SidebarHeader() {
  const { collapsed, setCollapsed, hovered } = useSidebarConfig();
  return (
    <div className="h-14 flex items-center w-full justify-center border-b border-gray-200 dark:border-gray-700 px-4 bg-[#003399]">
      <div className="flex justify-center mt-2 items-center gap-6 w-full">
        <Image src="/assets/images/logo.png" alt="Logo Ambassade de Tchad" width={36} height={36} />
        {(!collapsed || hovered) && <span className="font-bold text-white text-sm">Ambassade de Tchad</span>}
        <button
          className={`ml-2 transition-transform duration-300 hover:bg-white/10 rounded p-1 ${collapsed ? 'rotate-180' : ''}`}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Agrandir la sidebar' : 'Réduire la sidebar'}
        >
          <Image src="/assets/icons/sidebar-trigger.png" alt="Sidebar Trigger" width={16} height={16} />
        </button>
      </div>
    </div>
  );
} 