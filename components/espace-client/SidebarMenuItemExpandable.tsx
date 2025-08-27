"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LucideIcon, ChevronRight, ChevronDown } from "lucide-react";
import { useSidebarConfig } from "./SidebarConfigContext";
import { SubRoute, isRouteActive, hasActiveSubRoute } from "@/utils/routeUtils";

interface SidebarMenuItemExpandableProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  collapsed: boolean;
  hovered: boolean;
  subRoutes?: SubRoute[];
}

export default function SidebarMenuItemExpandable({
  label,
  href,
  icon: Icon,
  collapsed,
  hovered,
  subRoutes = [],
}: SidebarMenuItemExpandableProps) {
  const pathname = usePathname();
  const { setOpen } = useSidebarConfig();
  const [isExpanded, setIsExpanded] = useState(false);

  // États pour les routes principales et sous-routes
  const isMainActive = isRouteActive(pathname, href, true); // Exact match pour la route principale
  const hasActiveSubRouteState = hasActiveSubRoute(pathname, subRoutes);
  const isAnyActive = isMainActive || hasActiveSubRouteState;

  // Auto-expand si une sous-route est active
  useEffect(() => {
    if (hasActiveSubRouteState) {
      setIsExpanded(true);
    }
  }, [hasActiveSubRouteState]);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (subRoutes.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="w-full">
      {/* Route principale */}
      <div className="flex items-center">
        <Link
          href={href}
          onClick={handleClick}
          className={`flex items-center flex-1 ${
            collapsed ? "gap-0 px-2" : "gap-4 px-6"
          } py-3 text-base font-medium transition-all duration-200 rounded-[16px] ${
            isAnyActive
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
                isAnyActive
                  ? "border-white bg-orange-500"
                  : "border-white bg-transparent"
              }`}
            >
              {isAnyActive && (
                <span className="w-2.5 h-2.5 rounded-full bg-white block" />
              )}
            </span>
          )}

          {/* Label */}
          {!collapsed && <span className="ml-3">{label}</span>}
        </Link>

        {/* Bouton d'expansion */}
        {!collapsed && subRoutes.length > 0 && (
          <button
            onClick={handleToggleExpand}
            className="p-2 text-white hover:bg-white/10 rounded transition-all duration-200"
            aria-label={isExpanded ? "Réduire" : "Étendre"}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
      </div>

      {/* Sous-routes */}
      {!collapsed && isExpanded && subRoutes.length > 0 && (
        <div className="ml-8 mt-1 space-y-1">
          {subRoutes.map((subRoute) => {
            const isSubActive = isRouteActive(pathname, subRoute.href);
            return (
              <Link
                key={subRoute.id}
                href={subRoute.href}
                onClick={handleClick}
                className={`block py-2 px-4 text-sm rounded-lg transition-all duration-200 ${
                  isSubActive
                    ? "bg-orange-400 text-white font-medium"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {subRoute.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
