// API service for fetching geographic data from the backend
const API_BASE_URL = 'http://localhost:8080';

import { Provincia, ProvinciaResponse } from "./types";
import { Ayuntamiento, AyuntamientoResponse } from "./types";
import { GeoJSONCollection, GeoJSONGeometry } from "./types";

/**
 * Transform backend provincia response to GeoJSON Feature
 */
function transformProvinciaToFeature(provincia: ProvinciaResponse): Provincia {
  return {
    type: 'Feature',
    properties: {
      id: provincia.provinciaId,
      code: provincia.provinciaId,
      name: provincia.name,
      comunidadAutonomaId: provincia.comunidadAutonomaId,
      bounds: provincia.bounds,
      centroid: provincia.centroid,
    },
    geometry: parseGeometry(provincia.geometry),
  };
}

function parseGeometry(geometryJson: string): GeoJSONGeometry {
  const parsed: unknown = JSON.parse(geometryJson);
  
  // Runtime validation
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid geometry: expected object');
  }
  
  const geometry = parsed as Record<string, unknown>;
  
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    throw new Error(`Invalid geometry type: ${geometry.type}`);
  }
  
  if (!Array.isArray(geometry.coordinates)) {
    throw new Error('Invalid geometry: missing coordinates array');
  }
  
  return parsed as GeoJSONGeometry;
}

/**
 * Transform backend ayuntamiento response to GeoJSON Feature
 */
function transformAyuntamientoToFeature(ayuntamiento: AyuntamientoResponse): Ayuntamiento {
  return {
    type: 'Feature',
    properties: {
      id: ayuntamiento.ayuntamientoId,
      name: ayuntamiento.name,
      provinciaId: ayuntamiento.provinciaId,
      bounds: ayuntamiento.bounds,
      centroid: ayuntamiento.centroid
    },
    geometry: parseGeometry(ayuntamiento.geometry),
  };
}

/**
 * Fetch all provinces with geometry data
 */
export async function fetchProvincias(): Promise<GeoJSONCollection<Provincia>> {
  const response = await fetch(`${API_BASE_URL}/provincias/withGeometry`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch provincias: ${response.status} ${response.statusText}`);
  }
  
  const data: ProvinciaResponse[] = await response.json();
  
  return {
    type: 'FeatureCollection',
    features: data.map(transformProvinciaToFeature),
  };
}

/**
 * Fetch a specific province by ID with geometry
 */
export async function fetchProvinciaById(provinciaId: string): Promise<Provincia> {
  try {
    const response = await fetch(`${API_BASE_URL}/provincias/withGeometry/${provinciaId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch provincia ${provinciaId}: ${response.statusText}`);
    }
    const data: ProvinciaResponse = await response.json();
    return transformProvinciaToFeature(data);
  } catch (error) {
    console.error(`Error fetching provincia ${provinciaId}:`, error);
    throw error;
  }
}

/**
 * Fetch all ayuntamientos for a given province with geometry
 */
export async function fetchAyuntamientosByProvinceId(provinceId: string): Promise<GeoJSONCollection<Ayuntamiento>> {
  try {
    const response = await fetch(`${API_BASE_URL}/ayuntamientos/withGeometry/byProvince/${provinceId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ayuntamientos for province ${provinceId}: ${response.statusText}`);
    }
    const data: AyuntamientoResponse[] = await response.json();
    
    // Transform backend response to GeoJSON FeatureCollection
    return {
      type: 'FeatureCollection',
      features: data.map(transformAyuntamientoToFeature),
    };
  } catch (error) {
    console.error(`Error fetching ayuntamientos for province ${provinceId}:`, error);
    throw error;
  }
}
