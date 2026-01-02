'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchProvincias, fetchAyuntamientosByProvinceId, fetchAcantiladoLocationsByAyuntamientoId, fetchDemographicDataByProvince } from '@/lib/geoApiService';
import { Ayuntamiento, Provincia, AcantiladoLocation, GeoJSONCollection, DemographicDataLayer, LayerMetricType } from '@/lib/types';
import { getBucketColor, getAyuntamientoBucket } from '@/lib/mapLayers';
import { COLORS, LAYOUT } from '@/lib/constants';
import MapLegend from './MapLegend';
import MapColorLegend from './MapColorLegend';

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
  const [acantiladoLocationsData, setAcantiladoLocationsData] = useState<GeoJSONCollection<AcantiladoLocation> | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedProvinceData, setSelectedProvinceData] = useState<{ id: string; name: string } | null>(null);
  const [selectedAyuntamiento, setSelectedAyuntamiento] = useState<any>(null);
  const [selectedAcantiladoLocation, setSelectedAcantiladoLocation] = useState<any>(null);
  const [searchType, setSearchType] = useState<'homes' | 'land'>('homes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  
  // Layer state
  const [activeLayer, setActiveLayer] = useState<string | null>('demographics');
  const [activeMetricType, setActiveMetricType] = useState<LayerMetricType>('change');
  const [demographicData, setDemographicData] = useState<DemographicDataLayer | null>(null);

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

  // Fetch demographic data when province changes and demographics layer is active
  useEffect(() => {
    if (selectedProvince && activeLayer === 'demographics') {
      const loadDemographics = async () => {
        try {
          const data = await fetchDemographicDataByProvince(selectedProvince);
          setDemographicData(data);
          console.log('📊 Loaded demographic data:', data);
        } catch (err) {
          console.error('Failed to load demographic data:', err);
          setDemographicData(null);
        }
      };
      loadDemographics();
    } else {
      setDemographicData(null);
    }
  }, [selectedProvince, activeLayer]);

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
  const handleAyuntamientoClick = async (feature: any, layer: L.Layer) => {
    const ayuntamientoId = feature.properties.id;
    const ayuntamientoName = feature.properties.name || 'Unknown';
    
    if (!ayuntamientoId) {
      console.error('Ayuntamiento ID not found in feature properties');
      return;
    }

    // Toggle selection - if clicking the same ayuntamiento, deselect it
    if (selectedAyuntamiento?.id === ayuntamientoId) {
      setSelectedAyuntamiento(null);
      setAcantiladoLocationsData(null);
      setSelectedAcantiladoLocation(null);
      return;
    }

    try {
      setLoading(true);
      setSelectedAyuntamiento(feature.properties);
      setAcantiladoLocationsData(null); // Clear old locations data immediately
      setSelectedAcantiladoLocation(null); // Clear selected location
      
      // Fetch acantilado locations for this ayuntamiento
      const locations = await fetchAcantiladoLocationsByAyuntamientoId(ayuntamientoId);
      setAcantiladoLocationsData(locations);
      
      // Don't zoom - keep current view for visual comparison
      
      setError(null);
    } catch (err) {
      setError(`Failed to load acantilado locations for ayuntamiento ${ayuntamientoId}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle acantilado location click
  const handleAcantiladoLocationClick = (feature: any, layer: L.Layer) => {
    const locationId = feature.properties.id;
    
    // Toggle selection - if clicking the same location, deselect it
    if (selectedAcantiladoLocation?.id === locationId) {
      setSelectedAcantiladoLocation(null);
      return;
    }
    
    setSelectedAcantiladoLocation(feature.properties);
  };

  // Reset to Spain view
  const resetView = () => {
    setSelectedProvince(null);
    setSelectedProvinceData(null);
    setAyuntamientosData(null);
    setSelectedAyuntamiento(null);
    setAcantiladoLocationsData(null);
    setSelectedAcantiladoLocation(null);
    setMapBounds(null);
  };

  // Navigate to province view (from ayuntamiento or deeper)
  const navigateToProvince = () => {
    setSelectedAyuntamiento(null);
    setAcantiladoLocationsData(null);
    setSelectedAcantiladoLocation(null);
    // Keep the province selected and ayuntamientos data
    setMapBounds(null);
  };

  // Navigate to ayuntamiento view (from acantilado location)
  const navigateToAyuntamiento = () => {
    setSelectedAcantiladoLocation(null);
    // Keep the ayuntamiento selected and acantilado locations data
    setMapBounds(null);
  };

  // Style for provinces
  const provinciaStyle = (feature: any) => {
    const isSelected = selectedProvince === (feature.properties.id || feature.properties.code);
    const hasSelection = selectedProvince !== null;
    
    return {
      fillColor: COLORS.brand.main,
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
    
    // Use bucket-based colors when demographics layer is active
    if (activeLayer === 'demographics' && demographicData) {
      const bucket = getAyuntamientoBucket(
        feature.properties.id,
        demographicData.dataByAyuntamiento,
        activeMetricType
      );
      
      if (bucket !== null) {
        const fillColor = getBucketColor(bucket, isSelected);
        return {
          fillColor,
          weight: hasSelection ? (isSelected ? 3 : 1) : 1,
          opacity: hasSelection ? (isSelected ? 1 : 0.3) : 1,
          color: 'white',
          fillOpacity: hasSelection ? (isSelected ? 0.6 : 0.2) : 0.5,
        };
      }
    }
    
    // Default yellow color when no layer is active or no data - use single color
    return {
      fillColor: COLORS.brand.main,
      weight: hasSelection ? (isSelected ? 3 : 1) : 1,
      opacity: hasSelection ? (isSelected ? 1 : 0.3) : 1,
      color: 'white',
      fillOpacity: hasSelection ? (isSelected ? 0.6 : 0.2) : 0.5,
    };
  };


  // Style for acantilado locations
  const acantiladoLocationStyle = (feature: any) => {
    const isSelected = selectedAcantiladoLocation?.id === feature.properties.id;
    const hasSelection = selectedAcantiladoLocation !== null;
    
    return {
      fillColor: COLORS.brand.main,
      weight: hasSelection ? (isSelected ? 2 : 1) : 1,
      opacity: hasSelection ? (isSelected ? 1 : 0.3) : 1,
      color: 'white',
      fillOpacity: hasSelection ? (isSelected ? 0.7 : 0.2) : 0.6,
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

  // Event handlers for acantilado location layer
  const onEachAcantiladoLocation = (feature: any, layer: L.Layer) => {
    const locationName = feature.properties.name || 'Unknown';
    const ayuntamientoName = selectedAyuntamiento?.name || '';
    
    // Display as "Ayuntamiento Name | Postcode" 
    const displayName = ayuntamientoName ? `${ayuntamientoName} | ${locationName}` : locationName;
    
    layer.bindTooltip(displayName, {
      permanent: false,
      direction: 'auto',
      offset: [10, 0],
    });

    layer.on({
      click: () => handleAcantiladoLocationClick(feature, layer),
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        // Reset the layer style to match current state
        const target = e.target;
        const style = acantiladoLocationStyle(feature);
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
      
      <div className="flex gap-4 mx-auto" style={{ width: LAYOUT.containerWidth }}>
        {/* Map Legend sidebar - positioned on the left */}
        <div className="flex-shrink-0">
          <MapLegend
              activeLayer={activeLayer}
              activeMetricType={activeMetricType}
              onLayerChange={setActiveLayer}
              onMetricTypeChange={setActiveMetricType}
              selectedProvinceData={selectedProvinceData}
              selectedAyuntamiento={selectedAyuntamiento}
              selectedAcantiladoLocation={selectedAcantiladoLocation}
              provinciasData={provinciasData}
              ayuntamientosData={ayuntamientosData}
              acantiladoLocationsData={acantiladoLocationsData}
              onProvinceChange={(provinceId) => {
                if (provinceId && provinciasData) {
                  const feature = provinciasData.features.find(f => f.properties.id === provinceId);
                  if (feature) {
                    handleProvinceClick(feature, { getBounds: () => {
                      const b = feature.properties.bounds;
                      return L.latLngBounds(
                        [b.minLat, b.minLon],
                        [b.maxLat, b.maxLon]
                      );
                    }} as any);
                  }
                }
              }}
              onAyuntamientoChange={(ayuntamientoId) => {
                if (ayuntamientoId && ayuntamientosData) {
                  const feature = ayuntamientosData.features.find(f => f.properties.id === ayuntamientoId);
                  if (feature) {
                    handleAyuntamientoClick(feature, {} as any);
                  }
                }
              }}
              onLocationChange={(locationId) => {
                if (locationId && acantiladoLocationsData) {
                  const feature = acantiladoLocationsData.features.find(f => f.properties.id === locationId);
                  if (feature) {
                    handleAcantiladoLocationClick(feature, {} as any);
                  }
                }
              }}
              onNavigateToProvince={navigateToProvince}
              onNavigateToAyuntamiento={navigateToAyuntamiento}
              searchType={searchType}
              onSearchTypeChange={setSearchType}
            />
        </div>
        
        {/* Map Container */}
        <div style={{ height }} className="relative z-0 flex-1 rounded-lg overflow-hidden min-w-0">
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

          {/* Color Legend Overlay - Top Right */}
          {selectedProvince && <MapColorLegend activeLayer={activeLayer} />}

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
                key={`ayuntamientos-${selectedProvince}-${selectedAyuntamiento?.id || 'none'}-${activeLayer || 'none'}-${activeMetricType}`}
                data={ayuntamientosData}
                style={ayuntamientoStyle}
                onEachFeature={onEachAyuntamiento}
              />
            )}
            
            {/* Show acantilado locations when an ayuntamiento is selected */}
            {selectedAyuntamiento && acantiladoLocationsData && (
              <GeoJSON
                key={`acantilado-locations-${selectedAyuntamiento.id}-${selectedAcantiladoLocation?.id || 'none'}`}
                data={acantiladoLocationsData}
                style={acantiladoLocationStyle}
                onEachFeature={onEachAcantiladoLocation}
              />
            )}
            
            <MapController bounds={mapBounds} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
