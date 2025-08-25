"use client";
import { useTranslations } from "next-intl";

export default function Statistic() {
  const t = useTranslations("tourisme.statistic");

  return (
    <div id="statistic" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("title")}
        </h2>

        {/* Contenu textuel (liste) */}
        <div className="space-y-4 text-gray-700 max-w-2xl mx-auto leading-relaxed">
          <ul className="list-disc list-outside pl-5 space-y-2">
            <li>
              <span className="font-semibold text-secondary">
                {t("list.capital")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.area")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.population")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.density")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.religions")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.languages")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.currency")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.gdp")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.gdp_per_capita")}:
              </span>
            </li>
            <li>
              <span className="font-semibold text-secondary">
                {t("list.main_cities")}:
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
