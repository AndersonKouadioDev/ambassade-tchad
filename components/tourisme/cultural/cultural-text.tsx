import { useTranslations } from "next-intl";

export default function CulturalText() {
  const t = useTranslations("tourisme.cultural.cultural-text");
  return (
    <div className="font-mulish m-8 pb-6">
        <div className="space-y-2 mx-0 md:mx-10">
            <ul className="list-disc list-outside pl-5 space-y-2">
                <li>{t("item1")}</li>
                <li>{t("item2")}</li>
                <li>{t("item3")}</li>
            </ul>
        </div>
    </div>
  );
}
