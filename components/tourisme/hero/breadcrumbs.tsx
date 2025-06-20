// import Tourisme from '@/app/[locale]/tourisme/page';
import {Link} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function BreadcrumbNav() {
  const t = useTranslations("tourisme.breadcrumbs")
  return (
    <nav className="text-white font-extralight text-lg">
      <ul className="flex space-x-2">
        <li>
          <Link href="/" className="text-white hover:underline">
            {t("home")}
          </Link>
        </li>
        <span>{">"}</span>
        <li>
          <Link href="/tourisme" className="text-white hover:underline">
            {t("tourism")}
          </Link>
        </li>
        <span>{">"}</span>
        <li>
          <Link href="#" className="text-white">
            {t("site")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
