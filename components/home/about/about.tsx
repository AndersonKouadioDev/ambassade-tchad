"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, Facebook } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  return (
    <div className="w-full relative h-[400px]">
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#003d99]/40 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full h-full">
        <div className="container mx-auto px-4 py-20 h-full">
          <div className="flex flex-col absolute top-0 left-0 bg-primary text-white w-[360px] p-6 gap-6 shadow-xl rounded-br-3xl">
            <div className="flex items-start gap-3">
              <Phone size={24} className="text-secondary" />
              <div>
                <div className="text-sm font-semibold">{t("phoneLabel")}</div>
                <div className="text-sm">+225 27 22 39 49 13</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Facebook size={24} className="text-secondary" />
              <div>
                <div className="text-sm font-semibold">{t("facebookLabel")}</div>
                <Link
                  href="https://www.facebook.com/share/1Dx5XFzv8D/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-secondary underline"
                >
                  {t("facebookLink")}
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={24} className="text-secondary" />
              <div>
                <div className="text-sm font-semibold">{t("emailLabel")}</div>
                <div className="text-sm">{t("emailValue")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
