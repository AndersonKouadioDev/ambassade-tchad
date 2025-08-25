"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, Facebook } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

export default function About() {
  const t = useTranslations("home.about");

  return (
    <div className="w-full relative min-h-[400px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/backgrounds/bg-ambassade-1.png"
          alt="Ambassade Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Overlay avec effet de lueur */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#003d99]/60 to-[#002B7F]/60" />

      {/* Contenu centré avec largeur max */}
      <div className="relative z-20 mx-auto max-w-screen-2xl h-full flex items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between p-4 md:p-8">
          {/* Bloc de texte à gauche */}
          <div className="w-full max-w-xl text-white text-center lg:text-left mb-12 lg:mb-0 lg:ml-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg font-light max-w-md mx-auto lg:mx-0">
              {t("description")}
            </p>
            <Button
              as={Link}
              href="/ambassade"
              className="mt-8 text-white"
              color="secondary"
              radius="full"
              size="lg"
            >
              {t("ctaButton")}
            </Button>
          </div>

          {/* Bloc de contact à droite */}
          <div className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 text-white p-8 md:p-10 shadow-xl rounded-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center">
              {t("contactTitle")}
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-blue-200/20 text-blue-200">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-sm font-light uppercase tracking-wide opacity-80">
                    {t("phoneLabel")}
                  </div>
                  <div className="text-lg font-semibold">+225 27 22 39 49 13</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-blue-200/20 text-blue-200">
                  <Facebook size={20} />
                </div>
                <div>
                  <div className="text-sm font-light uppercase tracking-wide opacity-80">
                    {t("facebookLabel")}
                  </div>
                  <Link
                    href="https://www.facebook.com/share/1Dx5XFzv8D/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-blue-200"
                  >
                    {t("facebookLink")}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-blue-200/20 text-blue-200">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-sm font-light uppercase tracking-wide opacity-80">
                    {t("emailLabel")}
                  </div>
                  <div className="text-lg font-semibold">{t("emailValue")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}