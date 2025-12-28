export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="container-wide py-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-lg font-semibold text-brand-700">
            Altiplano
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Altiplano. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
