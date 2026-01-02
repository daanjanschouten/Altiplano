import Image from 'next/image';
import dynamic from 'next/dynamic';
import Logo from '@/app/logo.svg';
import SplitLayout from '@/components/SplitLayout';

// Dynamically import SpainMap with no SSR to avoid Leaflet window issues
const SpainMap = dynamic(() => import('@/components/SpainMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ height: '600px' }}>
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top section - logo and text with same layout as map */}
      <SplitLayout
        className="pt-8 pb-6"
        left={
          <div className="flex items-center justify-center">
            <Image
              src={Logo}
              alt="Altiplano"
              priority
              className="h-16 w-auto"
            />
          </div>
        }
        right={
          <div className="flex items-center justify-between">
            <div className="pl-24">
              <h1 className="font-display text-3xl font-semibold text-gray-900">
                Ready when you are
              </h1>
              <p className="mt-2 text-gray-600">
                A second home in Spain. We'll help you make it happen.
              </p>
            </div>
            
            {/* Navigation links */}
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                Blog
              </a>
              <a 
                href="#" 
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                How We Help
              </a>
              <a
                href="#"
                className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition-colors text-sm whitespace-nowrap"
              >
                Free Consultation ↗
              </a>
            </div>
          </div>
        }
      />
      
      {/* Map section */}
      <div className="pb-8">
        <SpainMap height="600px" showMetadata={true} />
      </div>

      {/* How We Help section */}
      <SplitLayout
        className="py-12"
        left={
          <div /> // Empty div to maintain 300px spacing
        }
        right={
          <div>
            {/* Header with same padding as "Ready when you are" */}
            <div className="pl-24 mb-4">
              <h2 className="font-display text-3xl font-semibold text-gray-900">
                Buying property in Spain can be daunting. Here's how we help.
              </h2>
            </div>

            {/* Introductory text */}
            <div className="pl-24 mb-8">
              <p className="text-gray-600 max-w-2xl">
                From your first search to the notary signing, we're with you. We handle the complexities so you can focus on finding the right place.
              </p>
            </div>

            {/* 3 Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Language & Culture
                </h3>
                <p className="text-sm text-gray-600">
                  Native-level Spanish and local know-how so nothing gets lost in translation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Legal & Bureaucracy
                </h3>
                <p className="text-sm text-gray-600">
                  NIE applications, contracts, taxes — we guide you through every step.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-100">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  Data-Driven Search
                </h3>
                <p className="text-sm text-gray-600">
                  Market insights and location analysis to find value others miss.
                </p>
              </div>
            </div>

            {/* Free Consultation button */}
            <div className="flex justify-end mt-8">
              <a
                href="#"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition-colors"
              >
                Free Consultation ↗
              </a>
            </div>
          </div>
        }
      />

      {/* About Us section */}
      <SplitLayout
        className="py-12"
        left={
          <div /> // Empty div to maintain 300px spacing
        }
        right={
          <div>
            {/* Header with same padding */}
            <div className="pl-24 mb-4">
              <h2 className="font-display text-3xl font-semibold text-gray-900">
                About Us
              </h2>
            </div>

            {/* Placeholder content */}
            <div className="pl-24">
              <p className="text-gray-600 max-w-2xl mb-4">
                [Placeholder content - to be replaced]
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}
