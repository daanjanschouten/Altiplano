import Link from 'next/link';
import Image from 'next/image';

import Logo from '@/app/logo.svg';

export function Header() {
  return (
    <header className="border-b border-gray-100">
      <nav className="container-wide flex items-center justify-between py-2">
        <Link href="/" className="flex items-center">
          <Image
            src={Logo}
            alt="Altiplano"
            priority
            className="h-16 w-auto"
          />
        </Link>

        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="/#services"
              className="text-sm text-gray-600 transition-colors hover:text-brand-600"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/#about"
              className="text-sm text-gray-600 transition-colors hover:text-brand-600"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className="text-sm text-gray-600 transition-colors hover:text-brand-600"
            >
              Map
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="rounded-full bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
