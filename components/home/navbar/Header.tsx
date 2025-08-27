"use client";

import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Header() {
  const t = useTranslations("header");

  const [menuOpen, setMenuOpen] = useState(false);

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
        { name: t("tchad"), link: "/tourisme/tchad" },
      ],
    },
  ];

  return (
    <div className="w-full bg-primary p-4">
      <div className="flex justify-between md:justify-center gap-0 md:gap-6 items-center max-w-screen-2xl mx-auto px-4w">
        <Link href="/">
          <Image
            src="/assets/images/logo.png"
            alt="Embassy of Chad Logo"
            width={80}
            height={62}
            priority
            className="cursor-pointer"
          />
        </Link>
        <DesktopNav menuItems={menuItems} />
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>
      {menuOpen && (
        <MobileNav menuItems={menuItems} setMenuOpen={setMenuOpen} />
      )}
    </div>
  );
}
