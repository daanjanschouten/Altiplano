import { LAYOUT } from '@/lib/constants';

interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

/**
 * Reusable layout component that creates a fixed-width left panel and flexible right section.
 * Width is controlled by LAYOUT.sidebarWidth constant for consistency across the app.
 */
export default function SplitLayout({ left, right, className = '' }: SplitLayoutProps) {
  return (
    <div className={`flex gap-4 mx-auto ${className}`} style={{ width: LAYOUT.containerWidth }}>
      {/* Left side - Fixed width from constants */}
      <div className="flex-shrink-0" style={{ width: `${LAYOUT.sidebarWidth}px` }}>
        {left}
      </div>
      
      {/* Right side - Takes remaining space */}
      <div className="flex-1 min-w-0">
        {right}
      </div>
    </div>
  );
}
