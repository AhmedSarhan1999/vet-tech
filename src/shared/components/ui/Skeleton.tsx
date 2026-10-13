import React from 'react';
import { cn } from '@/shared/lib/utils';
import { SkeletonShape } from '@/shared/types/ui';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
}

/**
 * Precision Clinical Skeleton Primitive
 * Provides subtle, non-jarring loading states for mobile veterinary UI
 */
export const Skeleton: React.FC<SkeletonProps> & {
  Card: React.FC<{ className?: string }>;
  Avatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }>;
  Badge: React.FC<{ className?: string }>;
  Row: React.FC<{ className?: string }>;
} = ({
  shape = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const shapeStyles: Record<SkeletonShape, string> = {
    text: 'h-4 w-full rounded',
    rectangular: 'rounded-xl',
    circular: 'rounded-full aspect-square',
    pill: 'rounded-full h-6 w-16',
  };

  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  return (
    <div
      role="status"
      aria-label="Загрузка данных..."
      style={inlineStyles}
      className={cn(
        'animate-pulse bg-vet-slate-200/80',
        shapeStyles[shape],
        className
      )}
      {...props}
    />
  );
};

// Preset: Card Skeleton
Skeleton.Card = function SkeletonCard({ className }) {
  return (
    <div className={cn('p-4 rounded-2xl bg-white border border-vet-slate-200/80 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton shape="circular" className="w-10 h-10" />
          <div className="space-y-1.5">
            <Skeleton shape="text" className="w-28 h-4" />
            <Skeleton shape="text" className="w-20 h-3" />
          </div>
        </div>
        <Skeleton shape="pill" className="w-16 h-6" />
      </div>
      <Skeleton shape="text" className="w-full h-3" />
      <Skeleton shape="text" className="w-4/5 h-3" />
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton shape="rectangular" className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
};

// Preset: Avatar Skeleton
Skeleton.Avatar = function SkeletonAvatar({ size = 'md', className }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return <Skeleton shape="circular" className={cn(sizeMap[size], className)} />;
};

// Preset: Badge Skeleton
Skeleton.Badge = function SkeletonBadge({ className }) {
  return <Skeleton shape="pill" className={cn('w-20 h-6', className)} />;
};

// Preset: Row Skeleton
Skeleton.Row = function SkeletonRow({ className }) {
  return (
    <div className={cn('flex items-center justify-between py-2 border-b border-vet-slate-100', className)}>
      <Skeleton shape="text" className="w-32 h-4" />
      <Skeleton shape="text" className="w-20 h-4" />
    </div>
  );
};
