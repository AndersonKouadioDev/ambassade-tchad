"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Mail, Phone, Search, Menu, X, User, LogOut, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Head() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("header");
  const { data: session, status } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [openTourism, setOpenTourism] = useState(false);

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

  const menuItems = [
    { name: t("accueil"), link: "/" },
    { name: t("ambassade"), link: "/ambassade" },
    { name: t("consulaire"), link: "/consulaire" },
    {
      name: t("media"),
      children: [
        { name: t("event"), link: "/event" },
        { name: t("actualité"), link: "/news" },
        { name: t("photos"), link: "/galerie/galerie-photos" },
        { name: t("videos"), link: "/galerie/galerie-videos" },
      ],
    },
    {
      name: t("investir"),
      link: "https://anie.td/accueil/qui-sommes-nous/",
    },
    {
      name: t("tourisme"),
      children: [
        { name: t("site"), link: "/tourisme" },
        { name: t("tchad"), link: "/tourisme/tchad-s" },
        { name: t("peuples"), link: "/tourisme/peuples-et-cultures" },
      ],
    },
  ];

  // Composant pour les boutons d'authentification
  const AuthButtons = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full opacity-50">
          <User size={16} />
          <span className="text-sm font-medium">Chargement...</span>
        </div>
      );
    }

    if (session) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/espace-client/dashboard">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors">
              <Settings size={16} />
              <span className="text-sm font-medium">Mon Espace</span>
            </button>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      );
    }

    return (
      <Link href="/auth">
        <button className="flex items-center gap-2 bg-secondary hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors">
          <User size={16} />
          <span className="text-sm font-medium">{t("connexion")}</span>
        </button>
      </Link>
    );
  };

  return (
    <div className="w-full bg-primary p-4">
      <div className="flex justify-between md:justify-center gap-0 md:gap-6 items-center max-w-screen-2xl mx-auto px-4w">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            alt="Embassy of Chad Logo"
            width={80}
            height={80}
            priority
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-col text-white w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col">
              <span className="text-xl font-bold uppercase">{t("titre")}</span>
              <span className="text-base text-white/80 uppercase">Ghana - Sierra Leone - Guinée Conakry - Liberia</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => switchLocale("fr")}
                  className={`text-sm ${
                    locale === "fr"
                      ? "text-red-500"
                      : "text-white hover:underline"
                  }`}
                >
                  FR
                </button>
                <span className="text-sm text-white">|</span>
                <button
                  onClick={() => switchLocale("en")}
                  className={`text-sm ${
                    locale === "en"
                      ? "text-red-500"
                      : "text-white hover:underline"
                  }`}
                >
                  EN
                </button>
                <span className="text-sm text-white">|</span>
                <button
                  onClick={() => switchLocale("ar")}
                  className={`text-sm ${
                    locale === "ar"
                      ? "text-red-500"
                      : "text-white hover:underline"
                  }`}
                >
                  AR
                </button>
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

            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((menu, index) => (
                  <NavigationMenuItem key={index}>
                    {menu.children ? (
                      <>
                        <NavigationMenuTrigger className="bg-primary hover:bg-primary">
                          <span className="text-sm px-2 text-white hover:text-[#123682] transition-colors font-medium">
                            {menu.name}
                          </span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-10">
                          <ul className="grid w-[600px] bg-primary gap-3 p-4">
                            {menu.children.map((child, i) => (
                              <li key={i}>
                                <Link
                                  href={child.link}
                                  className="text-white hover:text-primary hover:bg-white p-2 rounded-lg"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : menu.link?.startsWith("http") ? (
                      <a
                        href={menu.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm px-2 ${
                          pathname === menu.link
                            ? "bg-white text-[#00205B] rounded-full"
                            : "text-white hover:bg-[#123682] rounded-full transition-colors"
                        }`}
                      >
                        {menu.name}
                      </a>
                    ) : (
                      <Link
                        href={menu.link ?? ""}
                        className={`text-sm px-2 ${
                          pathname === `/${locale}${menu.link}`
                            ? "bg-white text-[#00205B] rounded-full"
                            : "text-white hover:bg-[#123682] rounded-full transition-colors"
                        }`}
                      >
                        {menu.name}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col items-center text-white mt-4">
          {menuItems.map((item) =>
            item.children ? (
              <div
                key={item.name}
                className="w-full text-center border-b border-white"
              >
                <button
                  onClick={() => setOpenTourism(!openTourism)}
                  className="py-2 text-lg w-full"
                >
                  {item.name}
                </button>
                {openTourism && (
                  <div className="flex flex-col bg-primary px-4">
                    {item.children.map((child) =>
                      child.link?.startsWith("http") ? (
                        <a
                          key={child.name}
                          href={child.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 text-sm text-white text-left hover:underline"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.name}
                        </a>
                      ) : (
                        <Link
                          key={child.name}
                          href={child.link}
                          className="py-2 text-sm text-white text-left hover:underline"
                          onClick={() => setMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : item.link?.startsWith("http") ? (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 text-lg w-full text-center border-b border-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.link ?? ""}
                className="py-2 text-lg w-full text-center border-b border-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          )}

          <div className="flex flex-col gap-4 items-center py-3">
            <div className="flex gap-2">
              <button
                onClick={() => switchLocale("fr")}
                className={`text-sm ${
                  locale === "fr"
                    ? "text-red-500"
                    : "text-white hover:underline"
                }`}
              >
                FR
              </button>
              <span className="text-sm text-white">|</span>
              <button
                onClick={() => switchLocale("en")}
                className={`text-sm ${
                  locale === "en"
                    ? "text-red-500"
                    : "text-white hover:underline"
                }`}
              >
                EN
              </button>
              <span className="text-sm text-white">|</span>
              <button
                onClick={() => switchLocale("ar")}
                className={`text-sm ${
                  locale === "ar"
                    ? "text-red-500"
                    : "text-white hover:underline"
                }`}
              >
                AR
              </button>
            </div>
            
            {/* Boutons d'authentification pour mobile */}
            {status === "loading" ? (
              <div className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full opacity-50">
                <User size={16} />
                <span className="text-sm font-medium">Chargement...</span>
              </div>
                         ) : session ? (
               <div className="flex flex-col gap-2 w-full">
                 <Link href="/espace-client/dashboard" className="w-full">
                   <button 
                     className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors w-full"
                     onClick={() => setMenuOpen(false)}
                   >
                     <Settings size={16} />
                     <span className="text-sm font-medium">Mon Espace</span>
                   </button>
                 </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors w-full"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link href="/auth" className="w-full">
                <button 
                  className="flex items-center justify-center gap-2 bg-secondary hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  <span className="text-sm font-medium">{t("connexion")}</span>
                </button>
              </Link>
            )}
          </div>

          <div className="flex items-center bg-[#123682] rounded-full px-6 py-1">
            <Search className="text-white" size={24} />
            <input
              type="text"
              placeholder={t("recherche")}
              className="bg-transparent text-white placeholder-white/70 focus:outline-none ml-2 w-52 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
