import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ShieldCheck, Smartphone } from 'lucide-react';

export interface MobileContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomBar?: React.ReactNode;
  className?: string;
  showDesktopFrame?: boolean;
}

/**
 * MobileContainer
 * Adaptive mobile-first shell maintaining an app-like viewport (max 440px)
 * on mobile devices while scaling into an ergonomic clinical preview on desktop.
 */
export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  header,
  bottomBar,
  className,
  showDesktopFrame = true,
}) => {
  return (
    <div className="min-h-screen w-full bg-vet-slate-900 flex flex-col items-center justify-start md:py-6 md:px-4 antialiased">
      {/* Desktop Context Ribbon (Visible only on tablets & desktop >= 768px) */}
      {showDesktopFrame && (
        <aside
          aria-label="Сведения о среде VetTech OS"
          className="hidden md:flex items-center justify-between w-full max-w-[440px] mb-2 px-3 py-1.5 rounded-lg bg-vet-slate-800/80 border border-vet-slate-700/60 text-vet-slate-300 text-xs shadow-sm"
        >
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-vet-teal-400" />
            <span>VetTech OS Mobile Shell</span>
            <span className="text-vet-slate-500">• 440px</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-vet-verified-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ВетИС / 4979-1-ФЗ</span>
          </div>
        </aside>
      )}

      {/* Main Viewport Container */}
      <div
        className={cn(
          'w-full max-w-[440px] flex-1 flex flex-col bg-vet-slate-50',
          'md:rounded-[36px] md:shadow-2xl md:border md:border-vet-slate-700/50 md:overflow-hidden',
          'relative min-h-screen md:min-h-[860px] md:max-h-[920px]',
          'transition-all duration-200'
        )}
      >
        {/* Device Simulated Status Bar (Mobile-first ergonomics) */}
        <div className="w-full bg-white px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-vet-slate-800 select-none border-b border-vet-slate-100/60 z-30">
          <span className="tracking-tight font-mono">14:28</span>
          <div className="w-20 h-4 bg-vet-slate-900 rounded-full hidden md:block opacity-20 mx-auto" />
          <div className="flex items-center gap-1.5 text-xs text-vet-slate-600">
            <span className="text-[10px] uppercase font-bold text-vet-blue-600 tracking-wider">SPB 78</span>
            <span className="font-mono text-[10px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Optional Header Slot */}
        {header && (
          <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-vet-slate-200/80 shadow-sm">
            {header}
          </header>
        )}

        {/* Scrollable Content Viewport */}
        <main
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 no-scrollbar',
            className
          )}
        >
          {children}
        </main>

        {/* Optional Bottom Action Bar Slot */}
        {bottomBar && (
          <nav
            aria-label="Нижняя панель действий"
            className="sticky bottom-0 z-20 w-full bg-white/95 backdrop-blur-md border-t border-vet-slate-200/80 pb-safe shadow-lg"
          >
            {bottomBar}
          </nav>
        )}
      </div>
    </div>
  );
};
