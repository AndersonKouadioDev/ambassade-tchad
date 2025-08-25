import { useTranslations } from "next-intl";

export default function Geography() {
  const t = useTranslations("tourisme.geography");

  return (
    <div id="geography" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        {/* Titre de la page */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("title")}
        </h2>

        {/* Contenu textuel */}
        <div className="space-y-12">
          {/* Section générale */}
          <div className="space-y-4 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <ul className="list-disc list-outside pl-5 space-y-2">
              {t.raw("sections.general").map((item: string, index: number) => (
                <li key={`general-${index}`}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section Relief */}
          <div className="space-y-4 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <h3 className="text-2xl font-bold text-secondary mb-2">
              {t("sections.relief.title")}
            </h3>
            <ul className="list-disc list-outside pl-5 space-y-2">
              {t
                .raw("sections.relief.items")
                .map((item: string, index: number) => (
                  <li key={`relief-${index}`}>{item}</li>
                ))}
            </ul>
          </div>

          {/* Section Climat */}
          <div className="space-y-4 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            <h3 className="text-2xl font-bold text-secondary mb-2">
              {t("sections.climate.title")}
            </h3>
            <ul className="list-disc list-outside pl-5 space-y-2">
              {t
                .raw("sections.climate.items")
                .map((item: string, index: number) => (
                  <li key={`climate-${index}`}>{item}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
