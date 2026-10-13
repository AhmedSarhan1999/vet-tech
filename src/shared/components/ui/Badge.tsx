import React from 'react';
import { cn } from '@/shared/lib/utils';
import { BadgeVariant, BadgeSize } from '@/shared/types/ui';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  showDot?: boolean;
  pingDot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  verified: {
    container: 'bg-vet-verified-50 text-vet-verified-700 border-vet-verified-200/80',
    dot: 'bg-vet-verified-500',
  },
  emergency: {
    container: 'bg-vet-emergency-50 text-vet-emergency-700 border-vet-emergency-200/80 font-semibold',
    dot: 'bg-vet-emergency-600',
  },
  timer: {
    container: 'bg-vet-timer-50 text-vet-timer-700 border-vet-timer-200/80',
    dot: 'bg-vet-timer-500',
  },
  medical: {
    container: 'bg-vet-blue-50 text-vet-blue-700 border-vet-blue-200/80',
    dot: 'bg-vet-blue-500',
  },
  teal: {
    container: 'bg-vet-teal-50 text-vet-teal-700 border-vet-teal-200/80',
    dot: 'bg-vet-teal-500',
  },
  neutral: {
    container: 'bg-vet-slate-100 text-vet-slate-700 border-vet-slate-200',
    dot: 'bg-vet-slate-400',
  },
  'triage-red': {
    container: 'bg-red-600 text-white border-red-700 font-bold tracking-wide shadow-sm',
    dot: 'bg-white',
  },
  'triage-orange': {
    container: 'bg-orange-500 text-white border-orange-600 font-semibold tracking-wide',
    dot: 'bg-white',
  },
  'triage-yellow': {
    container: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
    dot: 'bg-amber-600',
  },
  'triage-green': {
    container: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium',
    dot: 'bg-emerald-600',
  },
  'triage-blue': {
    container: 'bg-sky-100 text-sky-900 border-sky-300 font-medium',
    dot: 'bg-sky-600',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

/**
 * Clinical Badge Component
 * Used for Rabies status, VetIS sync tags, and Manchester Veterinary Triage levels.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  showDot = false,
  pingDot = false,
  className,
  children,
  ...props
}) => {
  const currentVariant = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none',
        currentVariant.container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {(showDot || pingDot) && (
        <span className="relative flex h-2 w-2">
          {pingDot && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                currentVariant.dot
              )}
            />
          )}
          <span
            className={cn('relative inline-flex rounded-full h-2 w-2', currentVariant.dot)}
          />
        </span>
      )}
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
