"use client";
import { Link } from "@/i18n/navigation";
import { Search, ChevronDown, Mail, Phone } from "lucide-react";
import AuthButtons from "./AuthButtons";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

const DesktopNav = ({
  menuItems,
}: {
  menuItems: {
    name: string;
    link?: string;
    children?: {
      name: string;
      link: string;
    }[];
  }[];
}) => {
  const pathname = usePathname();
  const t = useTranslations("header");
  const locale = useLocale();
  const [, startTransition] = useTransition();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    [key: string]: "left" | "right";
  }>({});
  const router = useRouter();

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    startTransition(() => {
      router.push(newPathname);
    });
  };

  const handleMouseEnter = (menuName: string) => {
    setActiveDropdown(menuName);
    const dropdownElement = dropdownRefs.current[menuName];
    if (dropdownElement) {
      const rect = dropdownElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const dropdownWidth = 280;
      const shouldPositionLeft = rect.left + dropdownWidth > windowWidth - 20;
      setDropdownPosition((prev) => ({
        ...prev,
        [menuName]: shouldPositionLeft ? "right" : "left",
      }));
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="hidden lg:flex flex-col text-white w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-xl font-bold uppercase">{t("titre")}</span>
          <span className="text-base text-white/80 uppercase">
            Ghana - Sierra Leone - Guinée Conakry - Liberia
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            {["fr", "en", "ar"].map((lang) => (
              <button
                key={lang}
                onClick={() => switchLocale(lang)}
                className={`text-sm ${
                  locale === lang
                    ? "text-red-500"
                    : "text-white hover:underline"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-[#123682] rounded-full px-6 py-1">
            <Search className="text-white" size={24} />
            <input
              type="text"
              placeholder={t("recherche")}
              className="bg-transparent text-white placeholder-white/70 focus:outline-none ml-2 w-52 text-sm"
            />
          </div>
          <AuthButtons />
        </div>
      </div>
      <div className="border-t border-white flex justify-between items-center gap-4 mt-4 pt-2">
        <div className="flex flex-col text-white">
          <span className="flex items-center gap-2">
            <Phone size={16} />
            <span className="text-sm">{t("tel")}</span>
          </span>
          <span className="flex items-center gap-2">
            <Mail size={16} />
            <span className="text-sm">{t("email")}</span>
          </span>
        </div>
        <nav className="flex items-center gap-1 relative">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => menu.children && handleMouseEnter(menu.name)}
              onMouseLeave={handleMouseLeave}
              ref={(el) => {
                if (menu.children) {
                  dropdownRefs.current[menu.name] = el;
                }
              }}
            >
              {menu.children ? (
                <>
                  <button className="flex items-center gap-1 text-sm px-4 py-2 text-white hover:bg-white hover:text-primary rounded-full transition-colors font-medium">
                    {menu.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        activeDropdown === menu.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute top-full mt-2 min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all duration-200 ${
                      activeDropdown === menu.name
                        ? "opacity-100 visible transform translate-y-0"
                        : "opacity-0 invisible transform -translate-y-2"
                    } ${
                      dropdownPosition[menu.name] === "right"
                        ? "right-0"
                        : "left-0"
                    }`}
                  >
                    <div className="py-2">
                      {menu.children.map((child, i) => (
                        <Link
                          key={i}
                          href={child.link}
                          className="block px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <span className="font-medium">{child.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div
                      className={`absolute -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 ${
                        dropdownPosition[menu.name] === "right"
                          ? "right-6"
                          : "left-6"
                      }`}
                    ></div>
                  </div>
                </>
              ) : menu.link?.startsWith("http") ? (
                <a
                  href={menu.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm px-4 py-2 rounded-full transition-colors font-medium ${
                    pathname === menu.link
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white hover:text-primary"
                  }`}
                >
                  {menu.name}
                </a>
              ) : (
                <Link
                  href={menu.link ?? ""}
                  className={`text-sm px-4 py-2 rounded-full transition-colors font-medium ${
                    pathname === `/${locale}${menu.link}`
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white hover:text-primary"
                  }`}
                >
                  {menu.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DesktopNav;
