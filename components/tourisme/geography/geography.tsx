import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Geography() {
  const t = useTranslations("tourisme.geography");

  return (
    <div id="geography" className="font-mulish m-8 pb-6">
      {/* Onglets */}
      <div className="flex flex-col lg:flex-row justify-center gap-2 py-4">
        <Link href="tchad-s">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.key_figures")}
          </div>
        </Link>
        <Link href="tchad-h">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.history")}
          </div>
        </Link>
        <Link href="tchad-g">
          <div className="bg-primary text-white px-2 md:px-40 py-1 font-medium rounded-full md:rounded-b-md cursor-pointer text-center w-full md:w-auto">
            {t("tabs.geography")}
          </div>
        </Link>
      </div>

      {/* Section générale */}
      <div className="space-y-2 mx-10">
        <div className="pb-6"></div>
        <ul className="list-disc list-outside pl-5 space-y-2">
          {t.raw("sections.general").map((item: string, index: number) => (
            <li key={`general-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section Relief */}
      <div className="space-y-2 mx-10">
        <div className="text-gray-700 text-lg py-6">{t("sections.relief.title")}</div>
        <ul className="list-disc list-outside pl-5 space-y-2">
          {t.raw("sections.relief.items").map((item: string, index: number) => (
            <li key={`relief-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section Climat */}
      <div className="space-y-2 mx-10">
        <div className="text-gray-700 text-lg py-6">{t("sections.climate.title")}</div>
        <ul className="list-disc list-outside pl-5 space-y-2">
          {t.raw("sections.climate.items").map((item: string, index: number) => (
            <li key={`climate-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
