"use client";
import { Link } from "@/i18n/navigation";
import { ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const MobileNav = ({
  menuItems,
  setMenuOpen,
}: {
  menuItems: {
    name: string;
    link?: string;
    children?: {
      name: string;
      link: string;
    }[];
  }[];
  setMenuOpen: (open: boolean) => void;
}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const t = useTranslations("header");
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    startTransition(() => {
      router.push(newPathname);
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };
  return (
    <div className="lg:hidden mt-4 bg-primary/95 backdrop-blur-sm rounded-lg border border-white/20 mx-2">
      <div className="flex flex-col">
        {menuItems.map((item) =>
          item.children ? (
            <div
              key={item.name}
              className="border-b border-white/20 last:border-b-0"
            >
              <button
                onClick={() => toggleSubmenu(item.name)}
                className="w-full py-4 px-4 text-white flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <span className="text-base font-medium">{item.name}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    openSubmenu === item.name ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSubmenu === item.name
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-sm">
                  {item.children.map((child) =>
                    child.link?.startsWith("http") ? (
                      <a
                        key={child.name}
                        href={child.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block py-3 px-8 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm border-l-2 border-white/30 ml-4"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                          {child.name}
                        </span>
                      </a>
                    ) : (
                      <Link
                        key={child.name}
                        href={child.link}
                        className="block py-3 px-8 text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm border-l-2 border-white/30 ml-4"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                          {child.name}
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : item.link?.startsWith("http") ? (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-4 text-base font-medium text-white hover:bg-white/10 transition-colors border-b border-white/20 last:border-b-0"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ) : (
            <Link
              key={item.name}
              href={item.link ?? ""}
              className="py-4 px-4 text-base font-medium text-white hover:bg-white/10 transition-colors border-b border-white/20 last:border-b-0"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          )
        )}
      </div>
      <div className="p-4 space-y-4 border-t border-white/20">
        <div className="flex justify-center gap-1 bg-white/10 rounded-full p-1">
          {["fr", "en", "ar"].map((lang) => (
            <button
              key={lang}
              onClick={() => switchLocale(lang)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                locale === lang
                  ? "bg-white text-primary shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        {status === "loading" ? (
          <div className="flex items-center justify-center gap-2 bg-white/20 text-white px-4 py-3 rounded-full">
            <User size={18} />
            <span className="text-sm font-medium">{t("loading")}</span>
          </div>
        ) : session ? (
          <div className="space-y-2">
            <Link href="/espace-client/dashboard" className="block">
              <button
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full transition-colors w-full shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                <Settings size={18} />
                <span className="font-medium">{t("myAccount")}</span>
              </button>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full transition-colors w-full shadow-lg"
            >
              <LogOut size={18} />
              <span className="font-medium">{t("disconnect")}</span>
            </button>
          </div>
        ) : (
          <Link href="/auth" className="block">
            <button
              className="flex items-center justify-center gap-2 bg-secondary hover:bg-red-600 text-white px-4 py-3 rounded-full transition-colors w-full shadow-lg"
              onClick={() => setMenuOpen(false)}
            >
              <User size={18} />
              <span className="font-medium">{t("connexion")}</span>
            </button>
          </Link>
        )}
        <div className="flex items-center bg-white/10 rounded-full px-4 py-3 backdrop-blur-sm">
          <Search className="text-white" size={20} />
          <input
            type="text"
            placeholder={t("recherche")}
            className="bg-transparent text-white placeholder-white/70 focus:outline-none ml-3 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
