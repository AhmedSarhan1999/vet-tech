import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  unitBadge?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      unitBadge,
      icon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-vet-slate-700 tracking-wide uppercase select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center rounded-xl shadow-sm transition-all">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-vet-slate-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-11 px-3.5 bg-white text-vet-slate-900 text-sm rounded-xl border transition-all',
              'placeholder:text-vet-slate-400 focus:outline-none',
              icon ? 'pl-10' : 'pl-3.5',
              unitBadge ? 'pr-14' : 'pr-3.5',
              error
                ? 'border-vet-emergency-500 focus:ring-2 focus:ring-vet-emergency-500/20'
                : 'border-vet-slate-200 hover:border-vet-slate-300 focus:border-vet-blue-500 focus:ring-2 focus:ring-vet-blue-500/20',
              disabled && 'bg-vet-slate-50 text-vet-slate-400 cursor-not-allowed border-vet-slate-200',
              className
            )}
            {...props}
          />

          {unitBadge && (
            <div className="absolute right-3 px-2 py-0.5 rounded-md bg-vet-slate-100 text-vet-slate-600 text-xs font-medium pointer-events-none border border-vet-slate-200">
              {unitBadge}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-vet-emergency-600 font-medium flex items-center gap-1 animate-fadeIn">
            <span>⚠</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-vet-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
