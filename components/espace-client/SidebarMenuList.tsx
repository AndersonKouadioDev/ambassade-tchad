import SidebarMenuLabel from './SidebarMenuLabel';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuItemExpandable from './SidebarMenuItemExpandable';
import { useSidebarConfig } from './SidebarConfigContext';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderOpen, User, LogOut } from 'lucide-react';
import { MenuItem, extractDynamicSubRoutes } from '@/utils/routeUtils';

export default function SidebarMenuList() {
  const { collapsed, hovered } = useSidebarConfig();
  const t = useTranslations('espaceClient.sidebar');
  const tServices = useTranslations('espaceClient.services');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;

  // Extraire les sous-routes dynamiques
  const { mesDemandesSubRoutes, nouvelleDemandeSub } = extractDynamicSubRoutes(
    pathname, 
    locale, 
    tServices
  );

  // Configuration des menus
  const menuConfig: MenuItem[] = [
    {
      label: t('dashboard'),
      href: `/${locale}/espace-client/dashboard`,
      icon: LayoutDashboard,
      id: 'dashboard'
    },
    {
      label: t('nouvelleDemandeLabel'),
      href: `/${locale}/espace-client/nouvelle-demande`,
      icon: FileText,
      id: 'nouvelle-demande',
      expandable: true,
      subRoutes: nouvelleDemandeSub
    },
    {
      label: t('mesDemandes'),
      href: `/${locale}/espace-client/mes-demandes`,
      icon: FolderOpen,
      id: 'mes-demandes',
      expandable: true,
      subRoutes: mesDemandesSubRoutes
    },
    {
      label: t('monProfil'),
      href: `/${locale}/espace-client/profil`,
      icon: User,
      id: 'profil'
    }
  ];

  const logoutItem: MenuItem = {
    label: t('deconnexion'),
    href: '/',
    icon: LogOut,
    id: 'logout'
  };

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
          {menuConfig.map((item) => (
            <li key={item.id} className="w-full">
              {item.expandable && item.subRoutes ? (
                <SidebarMenuItemExpandable
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  collapsed={collapsed}
                  hovered={hovered}
                  subRoutes={item.subRoutes}
                />
              ) : (
                <SidebarMenuItem
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  collapsed={collapsed}
                  hovered={hovered}
                />
              )}
            </li>
          ))}
          
          {/* Item de déconnexion */}
          <li className="w-full">
            <SidebarMenuItem
              label={logoutItem.label}
              href={logoutItem.href}
              icon={logoutItem.icon}
              collapsed={collapsed}
              hovered={hovered}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}