import React from 'react';
import { useAuth } from '@/features/auth';
import {
  Bell,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export interface DashboardHeaderProps {
  districtName?: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  unreadNotificationsCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  districtName = 'Петроградский р-н, Санкт-Петербург',
  onNotificationClick,
  onProfileClick,
  unreadNotificationsCount = 2,
}) => {
  const { user, activeRole } = useAuth();

  // Extract friendly first name
  const displayName = user?.displayName?.split(' ')[0] || (activeRole === 'veterinarian' ? 'Доктор' : 'Елена');
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  return (
    <div className="w-full bg-white border-b border-vet-slate-200/80 px-4 pt-3 pb-3.5 space-y-2.5">
      {/* Top Regulatory Micro-bar */}
      <div className="flex items-center justify-between text-[10px] text-vet-slate-500 font-medium">
        <div className="flex items-center gap-1 text-vet-verified-700 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-vet-verified-600" />
          <span>ФГИС «ВЕТИС» • ЗАКОН РФ № 4979-1</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-vet-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-vet-verified-500 animate-pulse" />
          <span className="font-bold text-vet-slate-800">СПб ВетСлужба 24/7</span>
        </div>
      </div>

      {/* Main Greeting & Profile Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* User Greeting & District */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onProfileClick}
            className="relative w-10 h-10 rounded-2xl bg-vet-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-clinical hover:scale-105 active:scale-95 transition-all focus:outline-none"
            title="Профиль владельца"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-vet-verified-500 border-2 border-white" />
          </button>

          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-extrabold text-vet-slate-900 leading-tight">
                Здравствуйте, {displayName}!
              </h2>
              <span className="inline-flex items-center text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full shrink-0">
                {activeRole === 'veterinarian' ? 'Ветврач' : 'Владелец'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-vet-slate-500 font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate max-w-[210px]">{districtName}</span>
            </div>
          </div>
        </div>

        {/* Header Right Actions (Notifications & Quick Profile) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative w-9 h-9 rounded-xl bg-vet-slate-50 border border-vet-slate-200/80 flex items-center justify-center text-vet-slate-600 hover:text-vet-blue-600 hover:bg-vet-blue-50 active:scale-95 transition-all"
            title="Уведомления"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-vet-emergency-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
