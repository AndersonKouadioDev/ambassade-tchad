'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LucideIcon } from 'lucide-react';
import { useSidebarConfig } from './SidebarConfigContext';

interface SidebarMenuItemProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  collapsed: boolean;
  hovered: boolean;
}

export default function SidebarMenuItem({ label, href, icon: Icon, collapsed, hovered }: SidebarMenuItemProps) {
  const pathname = usePathname();
  const { setOpen } = useSidebarConfig();
  
  // Fonction pour vérifier si la route est active
  const checkIsActive = () => {
    // Normaliser le pathname pour la comparaison (gérer les locales comme /fr/espace-client)
    const cleanPathname = pathname.toLowerCase();
    const cleanHref = href.toLowerCase();
    
    // Route dashboard
    if (cleanHref.includes('/espace-client/dashboard')) {
      return cleanPathname.includes('/espace-client/dashboard') || 
             (cleanPathname.includes('/espace-client') && 
              (cleanPathname.endsWith('/espace-client') || cleanPathname.endsWith('/espace-client/')));
    }
    
    // Route nouvelle-demande et ses sous-pages (/nouvelle-demande/visa, etc.)
    if (cleanHref.includes('/espace-client/nouvelle-demande')) {
      return cleanPathname.includes('/espace-client/nouvelle-demande');
    }
    
    // Route mes-demandes et ses sous-pages (/mes-demandes/T001, etc.)
    if (cleanHref.includes('/espace-client/mes-demandes')) {
      return cleanPathname.includes('/espace-client/mes-demandes');
    }
    
    // Route profil
    if (cleanHref.includes('/espace-client/profil')) {
      return cleanPathname.includes('/espace-client/profil');
    }
    
    // Route exacte ou préfixe
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + '/');
  };
  
  const isActive = checkIsActive();
  
  // Debug: log pour vérifier la détection des routes (à supprimer en production)
  // console.log(`Route ${normalizedHref}:`, { pathname, isActive });

  // Fermer la sidebar sur mobile après navigation
  const handleClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center ${collapsed ? 'gap-0 px-2' : 'gap-4 px-6'} py-3 text-base font-medium transition-all duration-200 rounded-[16px] ${
        isActive
          ? 'bg-orange-500 text-white shadow-md'
          : 'text-white hover:bg-white/10 hover:shadow-sm'
      }`}
      style={{ justifyContent: collapsed ? 'center' : 'flex-start', minHeight: '48px' }}
      title={collapsed && !hovered ? label : undefined}
    >
      {/* Icône Lucide ou cercle */}
      {Icon ? (
        <Icon 
          size={20} 
          className={`flex-shrink-0 transition-all duration-200 ${
            isActive ? 'text-white' : 'text-white'
          }`}
        />
      ) : (
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
            isActive
              ? 'border-white bg-orange-500'
              : 'border-white bg-transparent'
          }`}
        >
          {isActive && <span className="w-2.5 h-2.5 rounded-full bg-white block" />}
        </span>
      )}
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
} 