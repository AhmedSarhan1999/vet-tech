import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ShieldAlert } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  regulatoryNote?: string;
  className?: string;
}

/**
 * Clinical Empty State Component
 * Provides clean, reassuring, and actionable states when clinical records are empty.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  regulatoryNote,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl',
        'border border-dashed border-vet-slate-300 bg-white/70',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-vet-slate-100 flex items-center justify-center text-vet-slate-500 mb-4 shadow-sm border border-vet-slate-200/60">
        {icon ?? <ShieldAlert className="w-7 h-7 text-vet-slate-400" />}
      </div>

      <h3 className="text-base font-semibold text-vet-slate-900 tracking-tight mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-vet-slate-500 max-w-xs mb-4 leading-relaxed">
        {description}
      </p>

      {regulatoryNote && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vet-slate-50 border border-vet-slate-200 text-[11px] text-vet-slate-600 mb-4 font-mono">
          <span>⚖</span>
          <span>{regulatoryNote}</span>
        </div>
      )}

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
