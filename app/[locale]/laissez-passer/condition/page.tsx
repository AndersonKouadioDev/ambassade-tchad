import React from 'react';
import Image from 'next/image';
import { Button } from "@heroui/react";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Condition() {
  const t = useTranslations("condition.laissez-passer")
  return (
    <div className="relative flex items-center justify-center w-full p-10 min-h-[calc(100vh-70px)] font-mulish">
   
      <div className="absolute inset-0 bg-blue-800/50" /> {/* Superposition bleu semi-transparente */}

      {/* Formulaire */}
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 z-10">
        {/* Close button */}
        <Link href="/" className="absolute right-4 top-4">
        <button className=" text-gray-500 hover:text-gray-700">
          ✕
        </button>
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

        {/* Photo upload area */}
        <div className=" mx-auto mb-8 text-primary font-semibold flex items-start justify-start relative">
          <div>
            {t("documents")} : 
          </div>
        </div>

        

        {/* Form fields */}
        <div className="flex flex-row items-center justify-between px-10 py-6">
                {/* Liste numérotée à gauche */}
                <div className="w-auto md:w-1/2">
                    <ol className="list-decimal list-outside space-y-2 text-sm text-gray-700">
                    <li>{t("list.first_condition")}</li>
                    <li>{t("list.second_condition")}</li>
                    <li>{t("list.third_condition")}</li>
                    </ol>
                </div>

                {/* Image réduite au centre à droite */}
                <div className="w-1/2 hidden md:flex justify-center">
                    <Image
                    src="/assets/images/illustrations/formulaire/visa.png" // Remplace par ton chemin d'image
                    alt="Visa"
                    width={100} // Ajuste la taille selon ton besoin
                    height={100}
                    className="object-contain"
                    />
                </div>
                </div>

        {/* Buttons */}
        <div className="flex justify-between">
            <Link href="/laissez-passer">
              <Button className="bg-transparent text-secondary border border-secondary">
                {t("see_form")}
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
