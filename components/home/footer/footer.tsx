import React from "react";
import Link from "next/link";
import { Facebook } from "lucide-react";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";

const Footer = () => {
  const mainLinks = [
    { name: "L'Ambassade", href: "/ambassade" },
    { name: "Services consulaires", href: "/consulaire" },
    {
      name: "Investir Au Tchad",
      href: "https://anie.td/accueil/qui-sommes-nous/",
    },
    { name: "Tourisme", href: "/tourisme" },
    { name: "Menus", href: "/menus" },
  ];

  const quickLinks = [
    { name: "Le Tchad", href: "/tourisme/tchad-s" },
    { name: "Events", href: "/events" },
    { name: "Sites touristiques", href: "/tourisme/" },
  ];

  const legalLinks = [
    { name: "À propos", href: "/a-propos" },
    { name: "Critères", href: "/criteres" },
    { name: "Confidentialité", href: "/confidentialite" },
    { name: "Conditions", href: "/conditions" },
    { name: "Clause de non-responsabilité", href: "/clause" },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/share/1Dx5XFzv8D/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: "TCHAD DIPLOMATIE",
    },
    {
      href: "https://www.facebook.com/share/1B6ViF7jTe/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: "Secrétariat général du gouvernement",
    },
    {
      href: "https://www.facebook.com/share/1Dx5XFzv8D/",
      icon: <Facebook className="w-6 h-6 text-[#002B7F]" />,
      name: "Ambassade du Tchad en Côte d'Ivoire",
    },
  ];

  return (
    <footer className="w-full bg-primary text-white pt-8 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-row border-b-1 pb-3 justify-between">
          <div className="flex flex-row text-center items-center gap-2">
            <Image
              src="/assets/images/logo_2.png"
              alt="Embassy of Chad Logo"
              width={40}
              height={40}
              priority
              className="cursor-pointer"
            />
            <div className="text-2xl font-semibold font-blinker">
              AMBASSADE DU TCHAD
            </div>
          </div>
          <Image
            src="/assets/images/logo.png"
            alt="Embassy of Chad Logo"
            width={60}
            height={60}
            priority
            className="cursor-pointer"
          />
        </div>

        {/* Section principale en grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          {/* Info Ambassade & Réseaux Sociaux */}
          <div>
            <h2 className="text-sm font-semibold">
              Ambassade du Tchad en Côte d&apos;Ivoire
            </h2>
            {/* <p className="text-sm text-gray-300 mt-2">
              Représentation permanente auprès des Organisations des Nations Unies à Abidjan.
            </p> */}

            {/* Social Media Links */}
            <div className="flex flex-col gap-3 pt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 hover:bg-gray-100 transition"
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
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              {mainLinks.map((link) => (
                <li key={link.name}>
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

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
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
              <React.Fragment key={link.name}>
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
      </div>
    </footer>
  );
};

export default Footer;
