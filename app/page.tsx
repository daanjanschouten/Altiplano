import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import SpainMap with no SSR to avoid Leaflet window issues
const SpainMap = dynamic(() => import('@/components/SpainMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ height: '400px' }}>
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="container-wide py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Ready when you are
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            A second home in Spain. We'll help you make it happen.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-brand-600 px-8 py-3 font-medium text-white transition-colors hover:bg-brand-700"
            >
              Get in touch
            </Link>
            <Link
              href="/#services"
              className="rounded-full border border-gray-300 px-8 py-3 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              Our services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl font-semibold text-gray-900">
            What we do
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            From market analysis to portfolio strategy, we provide the insights
            you need to make confident property decisions.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              title="Market Analysis"
              description="Deep dives into local and regional market trends, pricing dynamics, and growth opportunities."
            />
            <ServiceCard
              title="Valuation Consulting"
              description="Data-backed property valuations that account for market conditions, comparables, and future potential."
            />
            <ServiceCard
              title="Portfolio Strategy"
              description="Strategic guidance for building, optimizing, or divesting real estate holdings."
            />
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="border-t border-gray-100 py-24">
        <div className="container-wide">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-gray-900">
              Explore Spain
            </h2>
            <p className="mt-4 max-w-2xl text-gray-600">
              Discover investment opportunities across Spanish provinces and municipalities.
              Click on any province to explore detailed demographic and vitality data.
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <SpainMap height="400px" showMetadata={false} />
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/map"
              className="inline-block text-brand-600 underline underline-offset-4 transition-colors hover:text-brand-700"
            >
              View full interactive map →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-t border-gray-100 py-24">
        <div className="container-wide">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-gray-900">
              About us
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              We're a team of real estate professionals and data analysts who
              believe better information leads to better outcomes. Our approach
              combines deep market expertise with modern analytical tools to
              give you a clearer picture of value and opportunity.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block text-brand-600 underline underline-offset-4 transition-colors hover:text-brand-700"
            >
              Let's talk about your project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
      <h3 className="font-display text-xl font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  );
}
