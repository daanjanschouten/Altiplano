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
    
    if (!provinciaId) {
      console.error('Province ID not found in feature properties');
      return;
    }

    try {
      setLoading(true);
      setSelectedProvince(provinciaId);
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
    setAyuntamientosData(null);
    setSelectedAyuntamiento(null);
    setMapBounds(null);
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
          fillOpacity: 0.6,
        });
      },
      mouseout: (e) => {
        const target = e.target;
        const isSelected = selectedProvince === (feature.properties.id || feature.properties.code);
        const hasSelection = selectedProvince !== null;
        target.setStyle({
          fillOpacity: hasSelection ? (isSelected ? 0.5 : 0.2) : 0.4,
        });
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
        const target = e.target;
        const isSelected = selectedAyuntamiento?.id === feature.properties.id;
        const hasSelection = selectedAyuntamiento !== null;
        target.setStyle({
          fillOpacity: hasSelection ? (isSelected ? 0.6 : 0.2) : 0.5,
        });
      },
    });
  };

  return (
    <div className={`relative ${className}`}>
      <style jsx>{`
        :global(.leaflet-interactive) {
          outline: none !important;
        }
        :global(.leaflet-interactive:focus) {
          outline: none !important;
        }
      `}</style>
      {/* Map Container */}
      <div style={{ height }} className="relative z-0 rounded-lg overflow-hidden">
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
              key="provincias"
              data={provinciasData}
              style={provinciaStyle}
              onEachFeature={onEachProvincia}
            />
          )}
          
          {/* Show ayuntamientos when a province is selected */}
          {selectedProvince && ayuntamientosData && (
            <GeoJSON
              key={`ayuntamientos-${selectedProvince}`}
              data={ayuntamientosData}
              style={ayuntamientoStyle}
              onEachFeature={onEachAyuntamiento}
            />
          )}
          
          <MapController bounds={mapBounds} />
        </MapContainer>
      </div>

      {/* Controls */}
      {selectedProvince && (
        <button
          onClick={resetView}
          className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          ← Back to Spain
        </button>
      )}

      {/* Metadata Panel */}
      {showMetadata && selectedAyuntamiento && (
        <div className="absolute bottom-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold text-lg mb-2">
            {selectedAyuntamiento.name || selectedAyuntamiento.nombre || 'Municipality'}
          </h3>
          
          {selectedAyuntamiento.demographics && (
            <div className="mb-2">
              <h4 className="font-medium text-sm text-gray-700">Demographics</h4>
              <pre className="text-xs text-gray-600 mt-1">
                {JSON.stringify(selectedAyuntamiento.demographics, null, 2)}
              </pre>
            </div>
          )}
          
          {selectedAyuntamiento.vitality && (
            <div>
              <h4 className="font-medium text-sm text-gray-700">Vitality Indicators</h4>
              <pre className="text-xs text-gray-600 mt-1">
                {JSON.stringify(selectedAyuntamiento.vitality, null, 2)}
              </pre>
            </div>
          )}
          
          <button
            onClick={() => setSelectedAyuntamiento(null)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
