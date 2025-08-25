import { useTranslations } from "next-intl";

export default function History() {
  const t = useTranslations("tourisme.history");

  return (
    <div id="history" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-12">
          {t("title")}
        </h2>

        {/* Contenu textuel */}
        <div className="space-y-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {t.raw("content").map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
