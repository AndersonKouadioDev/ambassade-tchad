'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarMenuItemProps {
  label: string;
  href: string;
  collapsed: boolean;
  hovered: boolean;
}

export default function SidebarMenuItem({ label, href, collapsed, hovered }: SidebarMenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href.replace('./', ''));
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-6 py-3 text-base font-medium transition-all duration-200 rounded-[16px] ${
        isActive
          ? 'bg-[#F44C27] text-white shadow-md'
          : 'text-[#3B4754] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm'
      }`}
      style={{ justifyContent: collapsed ? 'center' : 'flex-start', minHeight: '48px' }}
      title={collapsed && !hovered ? label : undefined}
    >
      {/* Cercle icône */}
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
          isActive
            ? 'border-white bg-[#F44C27]'
            : 'border-[#3B4754] dark:border-gray-400 bg-transparent'
        }`}
      >
        {isActive && <span className="w-2.5 h-2.5 rounded-full bg-white block" />}
      </span>
      {!collapsed && label}
    </Link>
  );
} 