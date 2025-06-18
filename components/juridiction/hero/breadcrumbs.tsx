import {Link} from '@/i18n/navigation';

export default function BreadcrumbNav() {
  return (
    <nav className="text-white font-extralight text-lg">
      <ul className="flex space-x-2">
        <li>
          <Link href="/" className="text-white hover:underline">
            Home
          </Link>
        </li>
        <span>{">"}</span>
        <li>
          <Link href="/ambassade" className="text-white hover:underline">
            L&apos;Ambassade
          </Link>
        </li>
        <span>{">"}</span>
        <li>
          <Link href="#" className="text-white">
            Nos juridictions
          </Link>
        </li>
      </ul>
    </nav>
  );
}
