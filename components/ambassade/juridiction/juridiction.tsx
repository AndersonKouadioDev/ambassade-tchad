"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

export default function Juridictions() {
  const t = useTranslations("ambassade.juridiction");
  return (
    <div className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Titre et description */}
        <div className="text-center md:text-left mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-700">{t("description")}</p>
        </div>

        {/* Boutons de navigation */}
        <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4 mb-12">
          <Button
            color="primary"
            className="w-full md:w-auto px-12"
            variant="solid"
          >
            Ambassades et représentations permanentes
          </Button>
          <Button
            color="primary"
            className="w-full md:w-auto px-12"
            variant="bordered"
          >
            Postes consulaires
          </Button>
        </div>

        {/* Conteneur de la carte et du fond */}
        <div className="relative w-full rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center">
          {/* Fond d'écran */}
          <div className="absolute inset-0 z-0">
            <Image
              className="object-cover"
              src="/assets/images/backgrounds/background.png"
              alt="Background"
              fill
              priority
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>

          {/* Liste des juridictions */}
          <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row justify-between gap-8 md:gap-16">
            <div className="flex-1">
              <ol className="space-y-3 text-gray-700 list-decimal pl-5">
                <li>{t("algerie")}</li>
                <li>{t("afrique_du_sud")}</li>
                <li>{t("cote_d_ivoire")}</li>
                <li>{t("emirats_arabe_unis")}</li>
                <li>{t("belgique")}</li>
                <li>{t("bresil")}</li>
                <li>{t("burkina_faso")}</li>
                <li>{t("cameroun")}</li>
                <li>{t("canada")}</li>
                <li>{t("suisse")}</li>
                <li>{t("congo")}</li>
                <li>{t("egypte")}</li>
                <li>{t("etats_unis")}</li>
                <li>{t("ethiopie")}</li>
                <li>{t("federation_de_russie")}</li>
                <li>{t("gabon")}</li>
                <li>{t("guinee_equatoriale")}</li>
              </ol>
            </div>
            <div className="flex-1">
              <ol
                className="space-y-3 text-gray-700 list-decimal pl-5"
                start={18}
              >
                <li>{t("inde")}</li>
                <li>{t("japon")}</li>
                <li>{t("koweit")}</li>
                <li>{t("libye")}</li>
                <li>{t("mali")}</li>
                <li>{t("niger")}</li>
                <li>{t("nigeria")}</li>
                <li>{t("qatar")}</li>
                <li>{t("new_york")}</li>
                <li>{t("republique_centrafricaine")}</li>
                <li>{t("republique_democratique_du_congo")}</li>
                <li>{t("republique_populaire_de_chine")}</li>
                <li>{t("royaume_maroc")}</li>
                <li>{t("norvege")}</li>
                <li>{t("soudan")}</li>
                <li>{t("turquie")}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
