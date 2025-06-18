"use client";

import Image from "next/image";
import { Button } from "@nextui-org/react";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation"; // ← Assure-toi que c’est bien le bon alias vers createNavigation()

export default function Hero() {
  const t = useTranslations("home.hero");

  return (
    <div className="relative flex items-center justify-between w-full h-[calc(100vh-70px)]">
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src="/assets/images/backgrounds/bg-landing.png"
        alt="herosection"
        fill
      />
      <div className="absolute w-full h-full bg-black/5 px-4"></div>

      <div className="z-[2] px-4 pt-16 w-full flex flex-col lg:ml-40 items-center xl:items-start justify-center text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-20 lg:gap-32">
        {/* Texte principal */}
        <div className="bg-black/30 max-w-screen-md relative justify-start p-8 flex flex-col gap-6">
          <div className="text-2xl md:text-5xl whitespace-pre-line tracking-wide">
            {t("title")} <br />
            {t("description_tchad")} <br />
            {t("description_cote_d_ivoire")}
          </div>
          <Link href="/demandez-rdv" className="w-full">
            <Button color="secondary" className="text-white w-full">
              {t("bouton_contact")}
            </Button>
          </Link>
        </div>

        {/* Bloc bas : Demande de carte consulaire */}
        <div className="flex flex-col sm:flex-row relative justify-between items-center gap-4 md:gap-0 bg-primary w-full md:w-5/6 p-6">
          <div className="text-lg font-extralight flex items-center gap-2">
            <FileText size={32} className="text-white" />
            {t("demande_carte_consulaire")}
          </div>
          <Link href="/passport">
            <Button color="secondary" className="text-white">
              {t("bouton_ouvir")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Flèches de navigation */}
      <div className="absolute hidden sm:flex lg:flex left-4 top-1/2 transform -translate-y-1/2 px-6 py-4 text-white bg-transparent border-2 border-white rounded-full cursor-pointer hover:bg-gray-200 transition">
        {"<"}
      </div>
      <div className="absolute hidden sm:flex lg:flex right-4 top-1/2 transform -translate-y-1/2 px-6 py-4 text-white bg-transparent border-2 border-white rounded-full cursor-pointer hover:bg-gray-200 transition">
        {">"}
      </div>
    </div>
  );
}
