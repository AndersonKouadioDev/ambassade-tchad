"use client";

import React from "react";
import { Facebook } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface LinkProps {
  name: string;
  href: string;
  icon?: React.ReactNode;
}
const Footer = () => {
  const t = useTranslations("footer");

  const mainLinks: LinkProps[] = [
    { name: t("mainLinks.ambassade"), href: "/ambassade" },
    { name: t("mainLinks.consulaire"), href: "/consulaire" },
    {
      name: t("mainLinks.investir"),
      href: "https://anie.td/accueil/qui-sommes-nous/",
    },
    { name: t("mainLinks.tourisme"), href: "/tourisme" },
    // { name: t("mainLinks.menus"), href: "/menus" },
  ];

  const quickLinks: LinkProps[] = [
    { name: t("quickLinks.events"), href: "/event" },
    { name: t("quickLinks.actuality"), href: "/news" },
    { name: t("quickLinks.gallery"), href: "/gallery" },
    { name: t("quickLinks.videos"), href: "/videos" },
  ];

  const legalLinks: LinkProps[] = [
    // { name: t("legal.a_propos"), href: "/a-propos" },
    // { name: t("legal.criteres"), href: "/criteres" },
    // { name: t("legal.confidentialite"), href: "/confidentialite" },
    // { name: t("legal.conditions"), href: "/conditions" },
    // { name: t("legal.clause"), href: "/clause" },
  ];

  const socialLinks: LinkProps[] = [
    {
      href: "https://www.facebook.com/share/1Dx5XFzv8D/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: t("socials.tchad_diplomatie"),
    },
    {
      href: "https://www.facebook.com/share/1B6ViF7jTe/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: t("socials.sgg"),
    },
    {
      href: "https://www.facebook.com/share/1Dx5XFzv8D/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: t("socials.ambassade_ci"),
    },
  ];
  return (
    <footer className="w-full bg-primary text-white pt-8 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-row border-b border-white pb-3 justify-between">
          <div className="flex flex-row text-center items-center gap-2">
            <Image
              src="/assets/images/logo_2.png"
              alt="Embassy of Chad Logo"
              width={40}
              height={40}
              priority
              className="cursor-pointer"
            />
            <div className="text-[16px] font-semibold font-blinker md:text-2xl !sm:text-[12px] !sm:text-center">
              {t("embassy")}
              <p className="uppercase text-[16px] text-left">
                {t("ghana")} - {t("sierra_leone")} - {t("guinea")} -{" "}
                {t("liberia")}
              </p>
            </div>
          </div>

          <Image
            src="/assets/images/logo.png"
            alt="Embassy of Chad Logo"
            width={100}
            height={78}
            priority
            className="cursor-pointer"
          />
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Infos ambassade + Réseaux sociaux */}
          <div>
            <h2 className="text-sm font-semibold">{t("embassy")}</h2>

            <div className="flex flex-col gap-3 pt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                  rel="noopener noreferrer"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("navTitle")}</h3>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-300 transition"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-gray-300 transition"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("quickLinksTitle")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-300 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="border-t border-white/20 pt-4">
          <ul className="flex flex-wrap gap-4 justify-center text-sm">
            {legalLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <li>
                  <Link href={link.href} className="hover:text-gray-300">
                    {link.name}
                  </Link>
                </li>
                {index < legalLinks.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
        <div className="text-center text-xs text-gray-300 mt-4">
          {t("copyright")} {" "}
          <Link href="https://lunion-lab.com" className="text-white">
            Lunion-LAB
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
