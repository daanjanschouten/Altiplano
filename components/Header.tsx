import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-100">
      <nav className="container-wide flex items-center justify-between py-6">
        <Link href="/" className="font-display text-xl font-semibold text-brand-700">
          ALTIPLANO
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
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
