import SidebarMenuLabel from './SidebarMenuLabel';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarMenuItemExpandable from './SidebarMenuItemExpandable';
import { useSidebarConfig } from './SidebarConfigContext';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderOpen, User, LogOut } from 'lucide-react';

export default function SidebarMenuList() {
  const { collapsed, hovered } = useSidebarConfig();
  const t = useTranslations('espaceClient.sidebar');
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;

  // Fonction pour obtenir les sous-routes dynamiques
  const getSubRoutes = (routeType: string) => {
    const cleanPathname = pathname.toLowerCase();
    
    if (routeType === 'mes-demandes') {
      // Détecter les demandes dynamiques comme /mes-demandes/T001
      const match = cleanPathname.match(/\/mes-demandes\/([^\/]+)/);
      if (match) {
        const demandeId = match[1].toUpperCase();
        return [{
          label: `Demande ${demandeId}`,
          href: `/${locale}/espace-client/mes-demandes/${match[1]}`,
          id: `demande-${match[1]}`
        }];
      }
    }
    
    if (routeType === 'nouvelle-demande') {
      // Détecter les types de demandes comme /nouvelle-demande/visa
      const match = cleanPathname.match(/\/nouvelle-demande\/([^\/]+)/);
      if (match) {
        const serviceType = match[1];
        const serviceLabels: Record<string, string> = {
          'visa': 'Demande de Visa',
          'carte-consulaire': 'Carte Consulaire',
          'passeport': 'Passeport',
          'laissez-passer': 'Laissez-passer',
          'procuration': 'Procuration',
          'certificat-nationalite': 'Certificat de Nationalité'
        };
        
        return [{
          label: serviceLabels[serviceType] || serviceType.charAt(0).toUpperCase() + serviceType.slice(1),
          href: `/${locale}/espace-client/nouvelle-demande/${serviceType}`,
          id: `service-${serviceType}`
        }];
      }
    }
    
    return [];
  };

  const menuMock = [
    {
      groupLabel: '',
      menus: [
        { label: t('dashboard'), href: `/${locale}/espace-client/dashboard`, icon: LayoutDashboard, active: false, id: 'dashboard', submenus: [] },
        { label: t('nouvelleDemandeLabel'), href: `/${locale}/espace-client/nouvelle-demande`, icon: FileText, active: false, id: 'demande', submenus: [] },
        { label: t('mesDemandes'), href: `/${locale}/espace-client/mes-demandes`, icon: FolderOpen, active: false, id: 'mes-demandes', submenus: [] },
        { label: t('monProfil'), href: `/${locale}/espace-client/profil`, icon: User, active: false, id: 'profil', submenus: [] },
      ]
    }
  ];

  const logoutItem = { label: t('deconnexion'), href: '/', icon: LogOut, active: false, id: 'logout', submenus: [] };
  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 py-6">
        <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
          {menuMock.map((group, idx) => (
            <li key={idx} className="w-full">
              {group.groupLabel && <SidebarMenuLabel label={group.groupLabel} />}
              {group.menus.map((item) => {
                // Dashboard et Profil restent simples
                if (item.id === 'dashboard' || item.id === 'profil') {
                  return (
                    <SidebarMenuItem key={item.id} {...item} collapsed={collapsed} hovered={hovered} />
                  );
                }
                
                // Mes Demandes et Nouvelle Demande deviennent expandables
                if (item.id === 'mes-demandes' || item.id === 'demande') {
                  const routeType = item.id === 'mes-demandes' ? 'mes-demandes' : 'nouvelle-demande';
                  const subRoutes = getSubRoutes(routeType);
                  
                  return (
                    <SidebarMenuItemExpandable 
                      key={item.id} 
                      label={item.label}
                      href={item.href}
                      icon={item.icon}
                      collapsed={collapsed}
                      hovered={hovered}
                      subRoutes={subRoutes}
                    />
                  );
                }
                
                return (
                  <SidebarMenuItem key={item.id} {...item} collapsed={collapsed} hovered={hovered} />
                );
              })}
            </li>
          ))}
          <SidebarMenuItem {...logoutItem} collapsed={collapsed} hovered={hovered} />
        </ul>
      </div>
    </nav>
  );
} 