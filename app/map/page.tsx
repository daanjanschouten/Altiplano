import dynamic from 'next/dynamic';

// Dynamically import SpainMap with no SSR to avoid Leaflet window issues
const SpainMap = dynamic(() => import('@/components/SpainMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ height: '700px' }}>
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section - contained */}
      <div className="container-wide py-8 pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">
            Ready when you are
          </h1>
          <p className="mt-2 text-gray-600">
            A second home in Spain. We'll help you make it happen.
          </p>
        </div>
      </div>
      
      {/* Map section - full width */}
      <div className="pb-8">
        <SpainMap height="700px" showMetadata={true} />
      </div>
      
      {/* Info cards - contained */}
      <div className="container-wide pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">How to Use</h3>
            <p className="mt-2 text-sm text-gray-600">
              Click on any province to zoom in and view municipalities (ayuntamientos) within that region.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">View Metadata</h3>
            <p className="mt-2 text-sm text-gray-600">
              Click on individual municipalities to view demographic and vitality indicators.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-sm text-gray-900">Navigate</h3>
            <p className="mt-2 text-sm text-gray-600">
              Use the "Back to Spain" button to return to the province view at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
