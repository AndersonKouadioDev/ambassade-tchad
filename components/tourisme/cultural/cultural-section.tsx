"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CulturalSection() {
  const t = useTranslations("tourisme.cultural");

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Section Texte */}
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">
            {t("title")}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>{t("cultural-text.item1")}</li>
              <li>{t("cultural-text.item2")}</li>
              <li>{t("cultural-text.item3")}</li>
            </ul>
          </div>
        </div>

        {/* Section Images */}
        <div className="order-1 lg:order-2 flex flex-col md:flex-row gap-4 h-[450px] md:h-[550px]">
          <div className="relative flex-1 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/assets/images/illustrations/tourisme/culture_left.png"
              alt={t("alt-left")}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <div className="relative h-1/2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/assets/images/illustrations/tourisme/culture_right_1.png"
                alt={t("alt-right1")}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="relative h-1/2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/assets/images/illustrations/tourisme/culture_right_2.png"
                alt={t("alt-right2")}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
