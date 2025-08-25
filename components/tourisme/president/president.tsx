"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function President() {
  const t = useTranslations("tourisme.president");

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-xl">
        {/* Titre principal centré et élégant */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-primary">
          {t("title")}
        </h2>

        {/* Conteneur principal avec mise en page réorganisée */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Bloc de texte avec liste */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 lg:order-2 max-w-lg lg:max-w-xl">
            <h3 className="font-extrabold text-2xl md:text-3xl pb-6 text-gray-800 border-b border-gray-300 mb-6">
              {t("projectTitle")}
            </h3>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              {[...Array(12)].map((_, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  <div>
                    <span className="font-bold">
                      {t(`chantiers.${index}.title`)} :
                    </span>{" "}
                    {t(`chantiers.${index}.description`)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex-1 lg:order-1 max-w-md lg:max-w-lg">
            <Image
              className="object-cover rounded-2xl shadow-xl border-4 border-white"
              src="/assets/images/illustrations/tourisme/president-1.png"
              alt={t("imageAlt")}
              priority
              width={600}
              height={900}
            />
          </div>
        </div>

        {/* Lien de téléchargement PDF */}
        <div className="text-center mt-12">
          <a
            href="/assets/document/projet_presidentiel.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-orange-500 transition-colors transform hover:scale-105"
          >
            📄 {t("downloadCta")}
          </a>
        </div>
      </div>
    </div>
  );
}
