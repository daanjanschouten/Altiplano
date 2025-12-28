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

export interface GeoJSONCollection<T> {
  type: 'FeatureCollection';
  features: T[];
}