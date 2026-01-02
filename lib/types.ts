// Shared geometric types
interface Bounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

interface Centroid {
  lat: number;
  lon: number;
}

export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

// Backend response types
export interface ProvinciaResponse {
  provinciaId: string;
  name: string;
  comunidadAutonomaId: string;
  geometry: string;  // Stringified GeoJSON - parsed in transform
  bounds: Bounds;
  centroid: Centroid;
}

export interface AyuntamientoResponse {
  ayuntamientoId: string;
  name: string;
  provinciaId: string;
  geometry: string;
  bounds: Bounds;
  centroid: Centroid;
}

export interface PostcodeResponse {
  codigoIne: string;
  codigoPostal: string;
  ayuntamientoIds: string[];
  geometry: string;
  bounds: Bounds;
  centroid: Centroid;
}

export interface BarrioResponse {
  barrioId: number;
  name: string;
  ayuntamientoId: string;
  geometry: string;
  bounds: Bounds;
  centroid: Centroid;
}

export interface AcantiladoLocationResponse {
  acantiladoLocationId: string;
  acantiladoLocationName: string;
  provinceId: string;
  ayuntamientoId: string;
  geometry: string;
  bounds: Bounds;
  centroid: Centroid;
}

// Frontend GeoJSON types
export interface Provincia {
  type: 'Feature';  // Literal type, not just string
  properties: {
    id: string;
    code: string;
    name: string;
    comunidadAutonomaId: string;
    bounds: Bounds;
    centroid: Centroid;
  };
  geometry: GeoJSONGeometry;
}

export interface Ayuntamiento {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    provinciaId: string;
    bounds: Bounds;
    centroid: Centroid;
  };
  geometry: GeoJSONGeometry;
}

export interface Postcode {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    ayuntamientoIds: string[];
    bounds: Bounds;
    centroid: Centroid;
  };
  geometry: GeoJSONGeometry;
}

export interface Barrio {
  type: 'Feature';
  properties: {
    id: number;
    name: string;
    ayuntamientoId: string
    bounds: Bounds;
    centroid: Centroid;
  };
  geometry: GeoJSONGeometry;
}

export interface AcantiladoLocation {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    provinceId: string;
    ayuntamientoId: string;
    bounds: Bounds;
    centroid: Centroid;
  };
  geometry: GeoJSONGeometry;
}

export interface GeoJSONCollection<T> {
  type: 'FeatureCollection';
  features: T[];
}

// Demographic data layer types
export interface AyuntamientoMetricData {
  curr: number;           // Current value (e.g., population)
  currBucket: number;     // Bucket for current value (0-4)
  chgPct: number;         // Percentage change
  chgBucket: number;      // Bucket for change percentage (0-4)
}

export interface DemographicDataLayer {
  provinceId: string;
  referenceYear: number;
  comparisonYear: number;
  dataByAyuntamiento: Record<string, AyuntamientoMetricData>;
}

// Map layer configuration types
export type BucketNumber = 0 | 1 | 2 | 3 | 4;

export interface BucketColors {
  normal: string;      // Color when not selected
  selected: string;    // Color when selected
}

export type LayerMetricType = 'absolute' | 'change';

export interface MapLayerConfig {
  id: string;
  name: string;
  metricTypes: {
    id: LayerMetricType;
    label: string;
  }[];
}
