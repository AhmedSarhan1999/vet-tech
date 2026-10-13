import React from 'react';
import { cn } from '@/shared/lib/utils';
import { PawPrint, Calendar, MessageSquare, FileText, User } from 'lucide-react';

export type NavTabId = 'home' | 'appointments' | 'chats' | 'passport' | 'profile';

export interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  appointmentsBadgeCount?: number;
  chatsBadgeCount?: number;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  appointmentsBadgeCount = 1,
  chatsBadgeCount = 1,
  className,
}) => {
  const tabs: { id: NavTabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: 'Главная',
      icon: <PawPrint className="w-5 h-5" />,
    },
    {
      id: 'appointments',
      label: 'Записи',
      icon: <Calendar className="w-5 h-5" />,
      badge: appointmentsBadgeCount,
    },
    {
      id: 'chats',
      label: 'Чаты',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: chatsBadgeCount,
    },
    {
      id: 'passport',
      label: 'Ветпаспорт',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Основная навигация"
      className={cn(
        'w-full bg-white/95 backdrop-blur-md border-t border-vet-slate-200/90 py-2 px-3 flex items-center justify-around select-none shadow-lg',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-150',
              'active:scale-95 focus-visible:outline-none',
              isActive
                ? 'text-vet-blue-600 font-bold'
                : 'text-vet-slate-400 hover:text-vet-slate-600 font-medium'
            )}
          >
            {/* Active Top Highlight Indicator */}
            {isActive && (
              <span className="absolute -top-2 w-8 h-1 bg-vet-blue-600 rounded-full" />
            )}

            {/* Icon Slot with optional Notification Badge */}
            <div className="relative">
              <span
                className={cn(
                  'transition-transform duration-150 block',
                  isActive ? 'scale-110 text-vet-blue-600' : 'text-current'
                )}
              >
                {tab.icon}
              </span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-vet-emergency-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm animate-pulse-subtle">
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={cn(
                'text-[10px] mt-1 tracking-tight',
                isActive ? 'font-bold text-vet-blue-600' : 'text-vet-slate-500'
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
