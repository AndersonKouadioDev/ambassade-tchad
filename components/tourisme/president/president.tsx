"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function President() {
  const t = useTranslations("tourisme.president");

  return (
    <div className="p-8 mb-10 max-w-screen-2xl mx-auto">
      <div className="flex flex-col justify-center gap-10">
        <div className="text-secondary ml-0 md:ml-4 text-3xl font-semibold text-center md:text-start">
          {t("title")}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Image */}
          <div className="flex flex-1 justify-center w-full max-w-3xl">
            <Image
              className="w-auto h-[900px] object-cover md:object-contain"
              src="/assets/images/illustrations/tourisme/president-1.png"
              alt={t("imageAlt")}
              width={300}
              height={250}
            />
          </div>

          {/* Texte avec puces */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-lg w-full">
            <div className="font-black text-gray-700 text-3xl pb-7">
              {t("projectTitle")}
            </div>
            <ul className="list-disc list-inside space-y-3 text-gray-700 font-mulish">
              {[...Array(12)].map((_, index) => (
                <li key={index}>
                  <span className="font-bold">
                    {t(`chantiers.${index}.title`)} :
                  </span>{" "}
                  {t(`chantiers.${index}.description`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lien de téléchargement PDF */}
        <div className="text-center mt-8">
          <a
            href="/assets/document/projet_presidentiel.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-orange-500 transition-colors"
          >
            📄 Télécharger le plan présidentiel (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
