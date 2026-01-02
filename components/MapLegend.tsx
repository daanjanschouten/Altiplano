'use client';

import { MAP_LAYERS } from '@/lib/mapLayers';
import { COLORS, LAYOUT } from '@/lib/constants';
import { LayerMetricType, GeoJSONCollection, Provincia, Ayuntamiento, AcantiladoLocation } from '@/lib/types';

interface MapLegendProps {
  activeLayer: string | null;
  activeMetricType: LayerMetricType;
  onLayerChange: (layerId: string | null) => void;
  onMetricTypeChange: (metricType: LayerMetricType) => void;
  // Breadcrumb-related props
  selectedProvinceData: { id: string; name: string } | null;
  selectedAyuntamiento: any;
  selectedAcantiladoLocation: any;
  provinciasData: GeoJSONCollection<Provincia> | null;
  ayuntamientosData: GeoJSONCollection<Ayuntamiento> | null;
  acantiladoLocationsData: GeoJSONCollection<AcantiladoLocation> | null;
  onProvinceChange: (provinceId: string) => void;
  onAyuntamientoChange: (ayuntamientoId: string) => void;
  onLocationChange: (locationId: string) => void;
  onNavigateToProvince: () => void;
  onNavigateToAyuntamiento: () => void;
  // Idealista search props
  searchType: 'homes' | 'land';
  onSearchTypeChange: (type: 'homes' | 'land') => void;
}

// Layer icons
const LayerIcon = ({ layerId }: { layerId: string }) => {
  const iconProps = {
    width: 18,
    height: 18,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (layerId) {
    case 'demographics':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'realestate':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'vitality':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'safety':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function MapLegend({
  activeLayer,
  activeMetricType,
  onLayerChange,
  onMetricTypeChange,
  selectedProvinceData,
  selectedAyuntamiento,
  selectedAcantiladoLocation,
  provinciasData,
  ayuntamientosData,
  acantiladoLocationsData,
  onProvinceChange,
  onAyuntamientoChange,
  onLocationChange,
  onNavigateToProvince,
  onNavigateToAyuntamiento,
  searchType,
  onSearchTypeChange,
}: MapLegendProps) {
  const currentLayer = MAP_LAYERS.find(layer => layer.id === activeLayer);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 flex flex-col gap-4" style={{ width: `${LAYOUT.sidebarWidth}px` }}>
      {/* Section 1: Location */}
      <div className="border-b border-gray-200 pb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Location
        </label>
        <div className="flex flex-col gap-2 text-sm">
          {/* Province */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-500">Province:</span>
            {selectedProvinceData && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateToProvince}
                  className={`transition-colors text-right ${
                    !selectedAyuntamiento 
                      ? 'font-semibold text-gray-900 cursor-default' 
                      : 'text-blue-600 hover:text-blue-800 hover:underline'
                  }`}
                  disabled={!selectedAyuntamiento}
                >
                  {selectedProvinceData.name}
                </button>
                <select
                  value={selectedProvinceData.id}
                  onChange={(e) => onProvinceChange(e.target.value)}
                  className="rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white w-5 h-5 appearance-none cursor-pointer hover:border-yellow-600"
                  style={{ 
                    border: `1.5px solid ${COLORS.brand.main}`,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    color: 'transparent'
                  }}
                >
                  {provinciasData?.features
                    .slice()
                    .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
                    .map(feature => (
                      <option key={feature.properties.id} value={feature.properties.id}>
                        {feature.properties.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Municipality */}
          {selectedProvinceData && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Municipality:</span>
              {selectedAyuntamiento && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateToAyuntamiento}
                    className={`transition-colors text-right ${
                      !selectedAcantiladoLocation 
                        ? 'font-semibold text-gray-900 cursor-default' 
                        : 'text-blue-600 hover:text-blue-800 hover:underline'
                    }`}
                    disabled={!selectedAcantiladoLocation}
                  >
                    {selectedAyuntamiento.name}
                  </button>
                  <select
                    value={selectedAyuntamiento.id}
                    onChange={(e) => onAyuntamientoChange(e.target.value)}
                    className="rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white w-5 h-5 appearance-none cursor-pointer hover:border-yellow-600"
                    style={{ 
                      border: `1.5px solid ${COLORS.brand.main}`,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      color: 'transparent'
                    }}
                  >
                    {ayuntamientosData?.features
                      .slice()
                      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
                      .map(feature => (
                        <option key={feature.properties.id} value={feature.properties.id}>
                          {feature.properties.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {!selectedAyuntamiento && <span className="text-gray-400">—</span>}
            </div>
          )}

          {/* Postcode */}
          {selectedAyuntamiento && (
            <div className="flex items-center justify-between gap-2 min-h-[20px]">
              <span className="text-gray-500">Postcode:</span>
              {selectedAcantiladoLocation && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-right">{selectedAcantiladoLocation.name}</span>
                  <select
                    value={selectedAcantiladoLocation.id}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className="rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white w-5 h-5 appearance-none cursor-pointer hover:border-yellow-600"
                    style={{ 
                      border: `1.5px solid ${COLORS.brand.main}`,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      color: 'transparent'
                    }}
                  >
                    {acantiladoLocationsData?.features
                      .slice()
                      .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
                      .map(feature => (
                        <option key={feature.properties.id} value={feature.properties.id}>
                          {feature.properties.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {!selectedAcantiladoLocation && <span className="text-gray-400">—</span>}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Layer */}
      {currentLayer && (
      <div className="border-b border-gray-200 pb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Layer
        </label>
        <div className="flex gap-1">
          {MAP_LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => onLayerChange(activeLayer === layer.id ? null : layer.id)}
              className={`p-3 transition-colors rounded ${
                activeLayer === layer.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
              title={layer.name}
            >
              <LayerIcon layerId={layer.id} />
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Section 3: Metric Selection */}
      {currentLayer && (
      <div className="border-b border-gray-200 pb-4">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            {currentLayer.name}
          </label>
         <div className="flex gap-1">
          {currentLayer.metricTypes.map((metricType) => (
            <button
              key={metricType.id}
              onClick={() => onMetricTypeChange(metricType.id)}
              className={`flex-1 px-2 py-2 transition-colors text-sm font-semibold rounded text-left ${
                activeMetricType === metricType.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
              title={metricType.label}
            >
              {metricType.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Section 4: Idealista Search Controls */}
      {selectedAyuntamiento && (
        <div>
          <div className="flex items-center gap-2">
            {/* Search Type Toggle */}
            <div className="flex items-stretch border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => onSearchTypeChange('homes')}
                className={`px-2 py-2 transition-colors flex items-center justify-center ${
                  searchType === 'homes'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Search for homes"
              >
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6L8 2L14 6V13C14 13.5304 13.7893 14.0391 13.4142 14.4142C13.0391 14.7893 12.5304 15 12 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V6Z" />
                  <path d="M6 15V9H10V15" />
                </svg>
              </button>
              <button
                onClick={() => onSearchTypeChange('land')}
                className={`px-2 py-2 transition-colors flex items-center justify-center ${
                  searchType === 'land'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Search for land/plots"
              >
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="12" height="12" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                  <line x1="8" y1="2" x2="8" y2="14" />
                </svg>
              </button>
            </div>
            
            {/* Search Button */}
            <a
              href={(() => {
                const municipalitySlug = selectedAyuntamiento.name
                  .toLowerCase()
                  .replace(/\s+/g, '_')
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '');
                
                let barrioSlug = '';
                if (selectedAcantiladoLocation?.name && selectedAcantiladoLocation.name.includes(' | ')) {
                  const parts = selectedAcantiladoLocation.name.split(' | ');
                  if (parts.length > 1 && parts[1].trim()) {
                    barrioSlug = '_' + parts[1]
                      .toLowerCase()
                      .replace(/\s+/g, '_')
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '');
                  }
                }
                
                const searchCategory = searchType === 'homes' ? 'venta-viviendas' : 'venta-terrenos';
                return `https://www.idealista.com/buscar/${searchCategory}/${municipalitySlug}${barrioSlug}/`;
              })()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition-colors text-sm whitespace-nowrap flex-1 text-center"
            >
              Search Idealista →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
