"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Ambassadeur() {
  const t = useTranslations("ambassadeur");

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-secondary">
          {t("title")}
        </h2>
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-12 lg:gap-20">
          {/* Left Column: Image with Subtle Details */}
          <div className="relative w-full max-w-sm h-[550px] md:h-[600px] lg:h-[700px] mx-auto lg:mx-0 flex-shrink-0">
            <Image
              src="/assets/images/illustrations/ambassade/ambassadeur_tchad.jpg"
              alt="ambassadeur"
              fill
              className="object-cover rounded-2xl shadow-xl border-4 border-white"
              priority
            />
            {/* Title Overlay */}
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl shadow-lg bg-primary/80 backdrop-blur-sm text-white text-center">
                <div className="text-xl font-bold tracking-wide">
                  {t("nom")}
                </div>
                <div className="text-sm font-light uppercase">{t("poste")}</div>
              </div>
            </div>
          </div>
          {/* Right Column: Welcome Message and Text */}
          <div className="flex flex-col justify-center flex-1">
            <h3 className="text-2xl md:text-4xl font-extrabold mb-4 text-primary">
              {t("bienvenue")}
            </h3>
            <p className="font-mulish text-base md:text-lg text-justify text-gray-800 space-y-4">
              <span className="leading-relaxed block mb-4">{t("texte")}</span>
              <span className="font-bold block">{t("vision")}</span>
            </p>
            <div className="mt-8 text-center lg:text-right font-mulish">
              <p className="text-xl md:text-2xl font-extrabold text-gray-800">
                {t("salutation")}
              </p>
              <p className="text-lg md:text-xl font-semibold italic text-gray-600">
                {t("signature")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
