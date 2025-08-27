import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSidebarConfig } from './SidebarConfigContext';

export default function SidebarHeader() {
  const t = useTranslations('espaceClient.sidebar');
  const { collapsed, setCollapsed, setOpen } = useSidebarConfig();
  
  const handleToggle = () => {
    // Sur mobile (< md), fermer la sidebar
    if (window.innerWidth < 768) {
      setOpen(false);
    } else {
      // Sur desktop, toggle collapsed
      setCollapsed(!collapsed);
    }
  };
  return (
    <div className="h-14 flex items-center w-full justify-center border-b border-gray-200  px-4 bg-blue-800">
      <div className="flex justify-center mt-2 items-center gap-6 w-full">
        {!collapsed && (
          <>
            <Image src="/assets/images/logo.png" alt="Logo Ambassade de Tchad" width={36} height={36} />
            <span className="font-bold text-white text-sm">{t('embassyName')}</span>
          </>
        )}
        <button
          className={`${collapsed ? 'w-8 h-8' : 'ml-2'} transition-transform duration-300 hover:bg-white/10 rounded p-1 ${collapsed ? 'rotate-180' : ''}`}
          onClick={handleToggle}
          aria-label={collapsed ? 'Agrandir la sidebar' : 'Réduire la sidebar'}
        >
          {collapsed ? (
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs">◐</span>
            </span>
          ) : (
            <Image src="/assets/icons/sidebar-trigger.png" alt="Sidebar Trigger" width={16} height={16} />
          )}
        </button>
      </div>
    </div>
  );
} 