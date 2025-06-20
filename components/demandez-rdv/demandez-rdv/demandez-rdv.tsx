"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import App from "../calendar/calendar";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import InertFixWrapper from "@/components/gestion_erreur_inert/InertFixWrapper";

export default function RDV() {
  const t = useTranslations("demandez-rdv");

  return (
    <div className="relative flex items-center justify-center w-full p-10 min-h-[calc(100vh-70px)] font-mulish">
      {/* Image d'arrière-plan */}
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/images/backgrounds/background_2.png"
        alt="Background image"
        fill
      />
      <div className="absolute inset-0 bg-blue-800/50" />

      {/* Formulaire */}
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <Link href="/" className="absolute right-4 top-4">
          <button className="text-gray-500 hover:text-gray-700">✕</button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-600 mb-4">{t("title")}</h1>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/assets/images/illustrations/formulaire/logo.png"
              alt="Chad Embassy Logo"
              width={300}
              height={150}
              className="mx-2"
            />
          </div>
        </div>

        {/* Infos personnelles */}
        <div className="mx-auto mb-8 text-primary font-semibold flex items-start justify-start relative">
          <div>{t("section.personalInfo")}</div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder={t("fields.fullName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="email"
            placeholder={t("fields.email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="number"
            placeholder={t("fields.phone")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
        </div>

        {/* Réservation */}
        <div className="flex flex-col justify-start items-start gap-6 py-6">
          <div className="text-primary font-semibold">
            {t("section.booking")}
          </div>
          
            <App />
          
        </div>

        {/* Buttons */}
        <div className="flex justify-start gap-3">
          <Link href="/">
            <Button color="default" className="text-white">
              {t("buttons.cancel")}
            </Button>
          </Link>
          <Link href="#">
            <Button className="bg-secondary text-white">
              {t("buttons.submit")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
