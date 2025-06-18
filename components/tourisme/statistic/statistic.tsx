"use client";
import {Link} from '@/i18n/navigation';
import { useTranslations } from "next-intl";

export default function Statistic() {
  const t = useTranslations("tourisme.statistic");

  return (
    <div id="statistic" className="font-mulish m-8 pb-6">
      <div className="flex flex-col lg:flex-row justify-center gap-2 py-4">
        <Link href="tchad-s">
          <div className="bg-primary text-white px-2 md:px-40 py-1 font-medium rounded-full md:rounded-b-md cursor-pointer text-center w-full md:w-auto">
            {t("tabs.key_figures")}
          </div>
        </Link>
        <Link href="tchad-h">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.history")}
          </div>
        </Link>
        <Link href="tchad-g">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.geography")}
          </div>
        </Link>
      </div>

      <div className="space-y-2 ml-10">
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>{t("list.capital")}</li>
          <li>{t("list.area")}</li>
          <li>{t("list.population")}</li>
          <li>{t("list.density")}</li>
          <li>{t("list.religions")}</li>
          <li>{t("list.languages")}</li>
          <li>{t("list.currency")}</li>
          <li>{t("list.gdp")}</li>
          <li>{t("list.gdp_per_capita")}</li>
          <li>{t("list.main_cities")}</li>
        </ul>
      </div>
    </div>
  );
}
