import {Link} from '@/i18n/navigation';
import { useTranslations } from "next-intl";

export default function History() {
  const t = useTranslations("tourisme.history");

  return (
    <div id="history" className="font-mulish m-8 pb-6">
      <div className="flex flex-col lg:flex-row justify-center gap-2 py-4">
        <Link href="tchad-s">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.key_figures")}
          </div>
        </Link>
        <Link href="tchad-h">
          <div className="bg-primary text-white px-2 md:px-40 py-1 font-medium rounded-full md:rounded-b-md cursor-pointer text-center w-full md:w-auto">
            {t("tabs.history")}
          </div>
        </Link>
        <Link href="tchad-g">
          <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center w-full md:w-auto">
            {t("tabs.geography")}
          </div>
        </Link>
      </div>

      <div className="space-y-2 mx-10">
        <ul className="list-disc list-outside pl-5 space-y-2">
          {t.raw("content").map((paragraph: string, i: number) => (
            <li key={i}>{paragraph}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
