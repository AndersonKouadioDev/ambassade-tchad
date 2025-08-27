"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useSidebarConfig } from "./SidebarConfigContext";
import { isRouteActive } from "@/utils/routeUtils";

interface SidebarMenuItemProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  collapsed: boolean;
  hovered: boolean;
  exact?: boolean; // Pour un matching exact de la route
}

export default function SidebarMenuItem({
  label,
  href,
  icon: Icon,
  collapsed,
  hovered,
  exact = false,
}: SidebarMenuItemProps) {
  const pathname = usePathname();
  const { setOpen } = useSidebarConfig();

  const isActive = isRouteActive(pathname, href, exact);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center ${
        collapsed ? "gap-0 px-2" : "gap-4 px-6"
      } py-3 text-base font-medium transition-all duration-200 rounded-[16px] ${
        isActive
          ? "bg-orange-500 text-white shadow-md"
          : "text-white hover:bg-white/10 hover:shadow-sm"
      }`}
      style={{
        justifyContent: collapsed ? "center" : "flex-start",
        minHeight: "48px",
      }}
      title={collapsed && !hovered ? label : undefined}
    >
      {/* Icône */}
      {Icon ? (
        <Icon
          size={20}
          className="flex-shrink-0 transition-all duration-200 text-white"
        />
      ) : (
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
            isActive
              ? "border-white bg-orange-500"
              : "border-white bg-transparent"
          }`}
        >
          {isActive && (
            <span className="w-2.5 h-2.5 rounded-full bg-white block" />
          )}
        </span>
      )}

      {/* Label */}
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
