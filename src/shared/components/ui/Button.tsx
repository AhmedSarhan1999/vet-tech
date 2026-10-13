import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ButtonVariant, ButtonSize } from '@/shared/types/ui';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-vet-blue-500 hover:bg-vet-blue-600 active:bg-vet-blue-700 text-white shadow-clinical focus-visible:ring-vet-blue-500/30',
  teal:
    'bg-vet-teal-600 hover:bg-vet-teal-700 active:bg-vet-teal-800 text-white shadow-clinical focus-visible:ring-vet-teal-500/30',
  emergency:
    'bg-vet-emergency-600 hover:bg-vet-emergency-700 active:bg-red-800 text-white shadow-emergency-glow focus-visible:ring-vet-emergency-500/40 font-semibold',
  verified:
    'bg-vet-verified-600 hover:bg-vet-verified-700 active:bg-vet-verified-800 text-white shadow-clinical focus-visible:ring-vet-verified-500/30',
  outline:
    'border border-vet-slate-200 bg-white hover:bg-vet-slate-50 active:bg-vet-slate-100 text-vet-slate-800 shadow-sm focus-visible:ring-vet-slate-400/20',
  ghost:
    'bg-transparent hover:bg-vet-slate-100 active:bg-vet-slate-200 text-vet-slate-700 focus-visible:ring-vet-slate-400/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-base rounded-xl gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'active:scale-[0.98] disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-60 cursor-not-allowed shadow-none',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
