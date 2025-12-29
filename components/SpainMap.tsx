'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchProvincias, fetchAyuntamientosByProvinceId } from '@/lib/geoApiService';
import { Ayuntamiento, Provincia, GeoJSONCollection } from '@/lib/types';

interface SpainMapProps {
  height?: string;
  className?: string;
  showMetadata?: boolean;
}

// Component to handle map bounds updates
function MapController({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [10, 10] });
    }
  }, [bounds, map]);
  
  return null;
}

export default function SpainMap({ 
  height = '600px', 
  className = '',
  showMetadata = true 
}: SpainMapProps) {
  const [provinciasData, setProvinciasData] = useState<GeoJSONCollection<Provincia> | null>(null);
  const [ayuntamientosData, setAyuntamientosData] = useState<GeoJSONCollection<Ayuntamiento> | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedProvinceData, setSelectedProvinceData] = useState<{ id: string; name: string } | null>(null);
  const [selectedAyuntamiento, setSelectedAyuntamiento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);

  // Fix for default marker icons in Next.js - only run on client
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Initial load - fetch all provinces
  useEffect(() => {
    const loadProvincias = async () => {
      try {
        setLoading(true);
        const data = await fetchProvincias();
        console.log('📍 Fetched provincias data:', data);
        console.log('📍 Number of features:', data?.features?.length);
        console.log('📍 First feature sample:', data?.features?.[0]);
        setProvinciasData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load province data. Make sure your backend is running.');
        console.error('❌ Error loading provincias:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProvincias();
  }, []);

  // Handle province click
  const handleProvinceClick = async (feature: any, layer: L.Layer) => {
    const provinciaId = feature.properties.id || feature.properties.code;
    const provinciaName = feature.properties.name || feature.properties.nombre || 'Unknown';
    
    if (!provinciaId) {
      console.error('Province ID not found in feature properties');
      return;
    }

    try {
      setLoading(true);
      setSelectedProvince(provinciaId);
      setSelectedProvinceData({ id: provinciaId, name: provinciaName });
      setAyuntamientosData(null); // Clear old ayuntamientos data immediately
      setSelectedAyuntamiento(null); // Clear selected ayuntamiento
      
      // Fetch ayuntamientos for this province
      const ayuntamientos = await fetchAyuntamientosByProvinceId(provinciaId);
      setAyuntamientosData(ayuntamientos);
      
      // Zoom to the clicked province
      if ('getBounds' in layer && typeof layer.getBounds === 'function') {
        const bounds = layer.getBounds();
        setMapBounds(bounds);
      }
      
      setError(null);
    } catch (err) {
      setError(`Failed to load ayuntamientos for province ${provinciaId}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle ayuntamiento click
  const handleAyuntamientoClick = (feature: any, layer: L.Layer) => {
    setSelectedAyuntamiento(feature.properties);
  };

  // Reset to Spain view
  const resetView = () => {
    setSelectedProvince(null);
    setSelectedProvinceData(null);
    setAyuntamientosData(null);
    setSelectedAyuntamiento(null);
    setMapBounds(null);
  };

  // Navigate to province view (from ayuntamiento)
  const navigateToProvince = () => {
    setSelectedAyuntamiento(null);
    // Keep the province selected and ayuntamientos data
    // Just zoom back to province bounds if available
    if (selectedProvinceData) {
      // The province layer should still be available, so we can re-zoom to it
      // For now, just clear the ayuntamiento selection
      setMapBounds(null); // This will trigger a re-fit if needed
    }
  };

  // Style for provinces
  const provinciaStyle = (feature: any) => {
    const isSelected = selectedProvince === (feature.properties.id || feature.properties.code);
    const hasSelection = selectedProvince !== null;
    
    return {
      fillColor: '#fbbf24',
      weight: hasSelection ? (isSelected ? 2 : 1) : 2,
      opacity: hasSelection ? (isSelected ? 1 : 0.3) : 1,
      color: 'white',
      fillOpacity: hasSelection ? (isSelected ? 0.5 : 0.2) : 0.4,
    };
  };

  // Style for ayuntamientos
  const ayuntamientoStyle = (feature: any) => {
    const isSelected = selectedAyuntamiento?.id === feature.properties.id;
    const hasSelection = selectedAyuntamiento !== null;
    
    return {
      fillColor: '#fbbf24',
      weight: hasSelection ? (isSelected ? 2 : 1) : 1,
      opacity: hasSelection ? (isSelected ? 1 : 0.3) : 1,
      color: 'white',
      fillOpacity: hasSelection ? (isSelected ? 0.6 : 0.2) : 0.5,
    };
  };

  // Event handlers for provincia layer
  const onEachProvincia = (feature: any, layer: L.Layer) => {
    const provinceName = feature.properties.name || feature.properties.nombre || 'Unknown';
    
    layer.bindTooltip(provinceName, {
      permanent: false,
      direction: 'auto',
      offset: [10, 0],
    });

    layer.on({
      click: () => handleProvinceClick(feature, layer),
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        // Reset the layer style to match current state
        const target = e.target;
        const style = provinciaStyle(feature);
        target.setStyle(style);
      },
    });
  };

  // Event handlers for ayuntamiento layer
  const onEachAyuntamiento = (feature: any, layer: L.Layer) => {
    const ayuntamientoName = feature.properties.name || feature.properties.nombre || 'Unknown';
    
    layer.bindTooltip(ayuntamientoName, {
      permanent: false,
      direction: 'auto',
      offset: [10, 0],
    });

    layer.on({
      click: () => handleAyuntamientoClick(feature, layer),
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.8,
        });
      },
      mouseout: (e) => {
        // Reset the layer style to match current state
        const target = e.target;
        const style = ayuntamientoStyle(feature);
        target.setStyle(style);
      },
    });
  };

  return (
    <div className={className}>
      <style jsx>{`
        :global(.leaflet-interactive) {
          outline: none !important;
        }
        :global(.leaflet-interactive:focus) {
          outline: none !important;
        }
      `}</style>
      
      {/* Breadcrumb Navigation - Above the map */}
      <div className="bg-white px-4 py-3 rounded-t-lg shadow-md border-b">
        <nav className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Spain</span>
          
          <span className="text-gray-400">›</span>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Province:</span>
            {selectedProvinceData && (
              <button
                onClick={navigateToProvince}
                className={`transition-colors ${
                  !selectedAyuntamiento 
                    ? 'font-semibold text-gray-900 cursor-default' 
                    : 'text-blue-600 hover:text-blue-800 hover:underline'
                }`}
                disabled={!selectedAyuntamiento}
              >
                {selectedProvinceData.name}
              </button>
            )}
            <select
              value={selectedProvinceData?.id || ""}
              onChange={(e) => {
                const provinceId = e.target.value;
                if (provinceId && provinciasData) {
                  const feature = provinciasData.features.find(f => f.properties.id === provinceId);
                  if (feature) {
                    // Simulate clicking on the province
                    handleProvinceClick(feature, { getBounds: () => {
                      // Create bounds from the feature's bounds property
                      const b = feature.properties.bounds;
                      return L.latLngBounds(
                        [b.minLat, b.minLon],
                        [b.maxLat, b.maxLon]
                      );
                    }} as any);
                  }
                }
              }}
              className="rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white w-6 h-6 appearance-none cursor-pointer hover:border-yellow-600"
              style={{ 
                border: '1.5px solid #fbbf24',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                color: 'transparent'
              }}
              title="Select province"
            >
              <option value="">—</option>
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
          
          {selectedProvinceData && (
            <>
              <span className="text-gray-400">›</span>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Municipality:</span>
                {selectedAyuntamiento && (
                  <span className="font-semibold text-gray-900">
                    {selectedAyuntamiento.name || selectedAyuntamiento.nombre || 'Municipality'}
                  </span>
                )}
                <select
                  value={selectedAyuntamiento?.id || ""}
                  onChange={(e) => {
                    const ayuntamientoId = e.target.value;
                    if (ayuntamientoId && ayuntamientosData) {
                      const feature = ayuntamientosData.features.find(f => f.properties.id === ayuntamientoId);
                      if (feature) {
                        handleAyuntamientoClick(feature, {} as any);
                      }
                    }
                  }}
                  className="rounded px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white w-6 h-6 appearance-none cursor-pointer hover:border-yellow-600"
                  style={{ 
                    border: '1.5px solid #fbbf24',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    color: 'transparent'
                  }}
                  title="Select municipality"
                >
                  <option value="">—</option>
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
            </>
          )}
        </nav>
      </div>
      
      {/* Map Container */}
      <div style={{ height }} className="relative z-0 rounded-b-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <div className="text-gray-600">Loading map data...</div>
          </div>
        )}
        
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <MapContainer
          center={[40.4637, -3.7492]} // Center of Spain
          zoom={5.6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Always show provinces */}
          {provinciasData && (
            <GeoJSON
              key={`provincias-${selectedProvince || 'none'}`}
              data={provinciasData}
              style={provinciaStyle}
              onEachFeature={onEachProvincia}
            />
          )}
          
          {/* Show ayuntamientos when a province is selected */}
          {selectedProvince && ayuntamientosData && (
            <GeoJSON
              key={`ayuntamientos-${selectedProvince}-${selectedAyuntamiento?.id || 'none'}`}
              data={ayuntamientosData}
              style={ayuntamientoStyle}
              onEachFeature={onEachAyuntamiento}
            />
          )}
          
          <MapController bounds={mapBounds} />
        </MapContainer>
      </div>

    </div>
  );
}
