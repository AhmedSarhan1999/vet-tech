import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  Car,
  PhoneCall,
  UserCheck,
  Radio,
  LogOut,
  ArrowLeftRight,
} from 'lucide-react';

export interface AdminHeaderProps {
  readonly onSignOut?: () => void;
  readonly onSwitchRole?: (role: 'pet_parent' | 'veterinarian') => void;
  readonly emergencyCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onSignOut,
  onSwitchRole,
  emergencyCount = 0,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('14:38:09');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Title Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                СПб ВетСлужба 24/7 • СИТУАЦИОННЫЙ ВЕТ-ЦЕНТР
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Хорриот / Меркурий ОК
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500">
              Единый оперативный диспетчерский контур экстренной ветеринарной помощи • Санкт-Петербург
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onSwitchRole && (
            <button
              type="button"
              onClick={() => onSwitchRole('veterinarian')}
              className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Переключиться в кабинет врача"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Кабинет врача</span>
            </button>
          )}

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="py-1.5 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              title="Выйти из диспетчерской"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выход</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Telemetry Metrics Ribbon */}
      <div className="px-4 py-2 bg-slate-50/80 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-semibold text-slate-700">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-slate-500 font-normal">Время:</span>
          <span className="font-mono font-black text-slate-900">{currentTime} МСК</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <Car className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-slate-500 font-normal">Экипажи на дежурстве:</span>
          <span className="font-mono font-black text-slate-900">34 / 42 на линии</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-slate-500 font-normal">Очередь вызовов:</span>
          <span className="font-mono font-black text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            7 срочных на дом
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <ShieldAlert className={`w-3.5 h-3.5 shrink-0 ${emergencyCount > 0 ? 'text-rose-600 animate-bounce' : 'text-emerald-600'}`} />
          <span className="text-slate-500 font-normal">SOS экстренно:</span>
          {emergencyCount > 0 ? (
            <span className="font-mono font-black text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-300 animate-pulse">
              1 АКТИВНАЯ ТРЕВОГА
            </span>
          ) : (
            <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              0 (Зообезопасность в норме)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 ml-auto">
          <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-slate-500 font-normal">Диспетчер:</span>
          <span className="font-bold text-slate-900">
            Кузнецов И. В. • СПбГУВМ Вет-Координатор СПб
          </span>
        </div>
      </div>
    </header>
  );
};
