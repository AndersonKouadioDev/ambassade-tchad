"use client";

import Image from "next/image";
import { Button } from "@heroui/react";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Hero() {
  const t = useTranslations("home.hero");

  return (
    <div className="relative w-full h-[calc(100vh-70px)] lg:h-[700px] xl:h-[800px] 2xl:h-[700px] 3xl:h-[800px]">
      {/* Fond sur toute la largeur */}
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src="/assets/images/backgrounds/bg-landing.png"
        alt="herosection"
        fill
      />
      <div className="absolute w-full h-full bg-black/5"></div>

      {/* Contenu centré avec largeur max */}
      <div className="relative z-20 mx-auto max-w-screen-2xl h-full flex items-center justify-between px-4">
        {/* Flèche de navigation gauche */}
        <div className="hidden lg:flex left-4 top-1/2 transform -translate-y-1/2 px-6 py-4 text-white bg-transparent border-2 border-white rounded-full cursor-pointer hover:bg-gray-200 transition">
          {"<"}
        </div>

        <div className="w-full flex flex-col items-center xl:items-start text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-20 lg:gap-32">
          {/* Texte principal */}
          <div className="bg-black/30 max-w-screen-md p-8 flex flex-col gap-6 lg:ml-4">
            <div className="text-3xl sm:text-4xl md:text-6xl font-extralight tracking-wide">
              {t("title")}
            </div>
          </div>

          {/* Bloc bas : Demande de carte consulaire */}
          <div className="flex mx-auto flex-col sm:flex-row justify-between items-center gap-4 md:gap-0 bg-primary w-full md:w-5/6 p-6 rounded-t-xl">
            <div className="text-lg font-extralight flex items-center gap-2">
              <FileText size={32} className="text-white" />
              {t("demande_carte_consulaire")}
            </div>
            <Link href="/consulaire">
              <Button color="secondary" className="text-white">
                {t("bouton_ouvir")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Flèche de navigation droite */}
        <div className="hidden lg:flex right-4 top-1/2 transform -translate-y-1/2 px-6 py-4 text-white bg-transparent border-2 border-white rounded-full cursor-pointer hover:bg-gray-200 transition">
          {">"}
        </div>
      </div>
    </div>
  );
}
