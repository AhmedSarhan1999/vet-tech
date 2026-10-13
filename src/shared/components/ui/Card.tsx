import React from 'react';
import { cn } from '@/shared/lib/utils';
import { CardVariant } from '@/shared/types/ui';
import { AsyncState } from '@/shared/types/async-state';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { AlertCircle } from 'lucide-react';

export interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-vet-slate-200/90 shadow-clinical',
  elevated: 'bg-white border border-vet-slate-200/60 shadow-clinical-md',
  emergency: 'bg-red-50/50 border border-vet-emergency-200 shadow-emergency-glow',
  verified: 'bg-emerald-50/30 border border-vet-verified-200 shadow-clinical',
  interactive: 'bg-white border border-vet-slate-200/90 shadow-clinical hover:border-vet-blue-300 hover:shadow-clinical-md transition-all cursor-pointer active:scale-[0.99]',
};

export interface TripleStateCardProps<T> extends CardBaseProps {
  state?: AsyncState<T>;
  renderData?: (data: T) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderError?: (error: Error | string) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function Card<T = unknown>({
  variant = 'default',
  state,
  renderData,
  renderSkeleton,
  renderEmpty,
  renderError,
  emptyTitle = 'Данные отсутствуют',
  emptyDescription = 'В текущем реестре нет записей по заданным параметрам.',
  className,
  children,
  ...props
}: TripleStateCardProps<T>): React.ReactElement {
  // If state is provided, handle the triple-state rendering
  if (state) {
    if (state.status === 'loading') {
      if (renderSkeleton) {
        return <div className={cn('rounded-2xl', className)}>{renderSkeleton()}</div>;
      }
      return <Skeleton.Card className={className} />;
    }

    if (state.status === 'empty') {
      if (renderEmpty) {
        return <div className={cn('rounded-2xl', className)}>{renderEmpty()}</div>;
      }
      return (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          className={className}
        />
      );
    }

    if (state.status === 'error') {
      if (renderError) {
        return <div className={cn('rounded-2xl', className)}>{renderError(state.error)}</div>;
      }
      const errorMsg = typeof state.error === 'string' ? state.error : state.error.message;
      return (
        <div
          className={cn(
            'p-4 rounded-2xl bg-vet-emergency-50 border border-vet-emergency-200 text-vet-emergency-800 space-y-2',
            className
          )}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="w-5 h-5 text-vet-emergency-600 flex-shrink-0" />
            <span>Ошибка загрузки клинических данных</span>
          </div>
          <p className="text-xs text-vet-emergency-700">{errorMsg}</p>
        </div>
      );
    }

    if (state.status === 'ready' && renderData) {
      return (
        <div
          className={cn(
            'rounded-2xl p-4 sm:p-5 transition-all',
            variantStyles[variant],
            className
          )}
          {...props}
        >
          {renderData(state.data)}
        </div>
      );
    }
  }

  // Fallback to standard children container
  return (
    <div
      className={cn(
        'rounded-2xl p-4 sm:p-5 transition-all',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between pb-3 border-b border-vet-slate-100 mb-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-vet-slate-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-vet-slate-500 mt-0.5', className)} {...props}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between pt-3 border-t border-vet-slate-100 mt-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};
