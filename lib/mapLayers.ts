import { BucketNumber, BucketColors, MapLayerConfig, LayerMetricType } from './types';
import { COLORS } from './constants';

/**
 * Color scheme for bucket-based data visualization
 * Uses single color per bucket - selection is indicated by border
 */
export const BUCKET_COLOR_SCHEME: Record<BucketNumber, BucketColors> = COLORS.bucket as Record<BucketNumber, BucketColors>;

/**
 * Get color for a bucket (same regardless of selection state)
 */
export function getBucketColor(bucket: BucketNumber, isSelected: boolean): string {
  return BUCKET_COLOR_SCHEME[bucket].normal;
}

/**
 * Available map layers configuration
 */
export const MAP_LAYERS: MapLayerConfig[] = [
  {
    id: 'demographics',
    name: 'Demographics',
    metricTypes: [
      { id: 'absolute', label: 'Size' },
      { id: 'change', label: '% Change' },
    ],
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    metricTypes: [
      { id: 'absolute', label: 'Level' },
      { id: 'change', label: '% Change' },
    ],
  },
  {
    id: 'vitality',
    name: 'Vitality',
    metricTypes: [
      { id: 'absolute', label: 'Score' },
      { id: 'change', label: '% Change' },
    ],
  },
  {
    id: 'safety',
    name: 'Safety',
    metricTypes: [
      { id: 'absolute', label: 'Score' },
      { id: 'change', label: '% Change' },
    ],
  },
];

/**
 * Get the bucket value for a given ayuntamiento and metric type
 */
export function getAyuntamientoBucket(
  ayuntamientoId: string,
  demographicData: Record<string, any> | null,
  metricType: LayerMetricType
): BucketNumber | null {
  if (!demographicData || !demographicData[ayuntamientoId]) {
    return null;
  }
  
  const data = demographicData[ayuntamientoId];
  const bucket = metricType === 'absolute' ? data.currBucket : data.chgBucket;
  
  // Validate bucket is within expected range
  if (bucket >= 0 && bucket <= 4) {
    return bucket as BucketNumber;
  }
  
  return null;
}
