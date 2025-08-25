import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function BreadcrumbNav() {
  const t = useTranslations("consulaire");
  return (
    <nav className="text-white font-extralight text-lg">
      <ul className="flex space-x-2">
        <li>
          <Link href="/" className="text-white hover:underline">
            {t("title")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
