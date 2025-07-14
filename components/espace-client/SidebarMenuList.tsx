import SidebarMenuLabel from './SidebarMenuLabel';
import SidebarMenuItem from './SidebarMenuItem';
import { useSidebarConfig } from './SidebarConfigContext';

const menuMock = [
  {
    groupLabel: '',
    menus: [
      { label: 'Mon Tableau De Bord', href: './dashboard', icon: null, active: false, id: 'dashboard', submenus: [] },
      { label: 'Faire Une Nouvelle Demande', href: './nouvelle-demande', icon: null, active: false, id: 'demande', submenus: [] },
      { label: 'Mes Demandes', href: './mes-demandes', icon: null, active: false, id: 'mes-demandes', submenus: [] },
      { label: 'Mon Profil', href: './profil', icon: null, active: false, id: 'profil', submenus: [] },
    ]
  }
];

const logoutItem = { label: 'Déconnexion', href: '/', icon: null, active: false, id: 'logout', submenus: [] };

export default function SidebarMenuList() {
  const { collapsed, hovered } = useSidebarConfig();
  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-4">
          {menuMock.map((group, idx) => (
            <li key={idx} className="w-full">
              {group.groupLabel && <SidebarMenuLabel label={group.groupLabel} />}
              {group.menus.map((item) => (
                <SidebarMenuItem key={item.id} {...item} collapsed={collapsed} hovered={hovered} />
              ))}
            </li>
          ))}
          <SidebarMenuItem {...logoutItem} collapsed={collapsed} hovered={hovered} />
        </ul>
      </div>
    </nav>
  );
} 