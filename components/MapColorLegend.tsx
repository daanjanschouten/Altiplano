'use client';

import { BUCKET_COLOR_SCHEME } from '@/lib/mapLayers';
import { BucketNumber } from '@/lib/types';

interface MapColorLegendProps {
  activeLayer: string | null;
}

export default function MapColorLegend({ activeLayer }: MapColorLegendProps) {
  // Only show if a layer is active
  if (!activeLayer) {
    return null;
  }

  const bucketLabels: Record<BucketNumber, string> = {
    0: 'Strong Negative',
    1: 'Moderate Negative',
    2: 'Neutral',
    3: 'Moderate Positive',
    4: 'Strong Positive',
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
      {/* Gradient bar */}
      <div className="flex items-center gap-1 mb-1">
        {([0, 1, 2, 3, 4] as BucketNumber[]).map((bucket) => (
          <div
            key={bucket}
            className="w-6 h-6 first:rounded-l last:rounded-r border border-gray-300"
            style={{
              backgroundColor: BUCKET_COLOR_SCHEME[bucket].normal,
            }}
          />
        ))}
      </div>
      {/* Labels for extremes only */}
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>Negative</span>
        <span>Positive</span>
      </div>
    </div>
  );
}
