import { useTranslations } from "next-intl";
import {Link} from '@/i18n/navigation';

export default function BreadcrumbNav() {
  const t = useTranslations("gallery.video.breadcrumbs");
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
          <Link href="/galerie/galerie-videos" className="text-white hover:underline">
            {t("video")}
          </Link>
        </li>
        <span>{">"}</span>
        {/* <li>
          <Link href="#" className="text-white">
            L&apos;Ambassadeur
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}
