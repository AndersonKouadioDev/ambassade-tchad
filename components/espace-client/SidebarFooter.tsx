'use client';

import { useSidebarConfig } from './SidebarConfigContext';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import SessionTimer from './SessionTimer';

export default function SidebarFooter() {
  const { collapsed, hovered } = useSidebarConfig();

  const handleLogout = () => {
    signOut({ callbackUrl: '/fr/auth' });
  };

  return (
    <div className="mt-auto p-4 border-t border-blue-800">
      {/* Timer de session */}
      <div className="mb-3">
        <SessionTimer />
      </div>
      
      {/* Bouton de déconnexion */}
      <button
        onClick={handleLogout}
        className={`w-full flex items-center gap-3 px-3 py-2 text-white hover:bg-blue-800 rounded-lg transition-colors ${
          collapsed && !hovered ? 'justify-center' : 'justify-start'
        }`}
      >
        <LogOut className="w-5 h-5" />
        {(!collapsed || hovered) && <span>Déconnexion</span>}
      </button>
    </div>
  );
} 