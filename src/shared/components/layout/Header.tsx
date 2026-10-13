import React from 'react';
import { Badge } from '@/shared/components/ui/Badge';
import { SpbDistrict } from '@/shared/types/veterinary';
import { MapPin, Activity, ShieldCheck, PhoneCall } from 'lucide-react';

export interface HeaderProps {
  currentDistrict?: SpbDistrict;
  isVetIsSynced?: boolean;
  onEmergencyClick?: () => void;
}

/**
 * Clinical Header for VetTech OS
 * Displays Saint Petersburg district status, VetIS Horriot sync state, and SOS trigger
 */
export const Header: React.FC<HeaderProps> = ({
  currentDistrict = 'Центральный',
  isVetIsSynced = true,
  onEmergencyClick,
}) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-2">
      {/* Brand & Location Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-vet-blue-600 flex items-center justify-center text-white shadow-clinical">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold text-vet-slate-900 leading-tight">
              VetTech OS
            </h1>
            <Badge variant="verified" size="sm" className="text-[10px] py-0 px-1.5 font-semibold">
              СПб
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-vet-slate-500 font-medium">
            <MapPin className="w-3 h-3 text-vet-teal-600" />
            <span>{currentDistrict} р-н</span>
            <span className="text-vet-slate-300">•</span>
            {isVetIsSynced ? (
              <span className="text-vet-verified-600 inline-flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                Хорриот
              </span>
            ) : (
              <span className="text-vet-timer-600">Офлайн</span>
            )}
          </div>
        </div>
      </div>

      {/* Emergency SOS Quick Button */}
      <button
        onClick={onEmergencyClick}
        type="button"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-vet-emergency-50 border border-vet-emergency-200 text-vet-emergency-700 text-xs font-bold active:scale-95 transition-all shadow-sm hover:bg-vet-emergency-100"
        title="Экстренный выезд ветеринарной службы"
      >
        <PhoneCall className="w-3.5 h-3.5 text-vet-emergency-600 animate-pulse" />
        <span>SOS 24/7</span>
      </button>
    </div>
  );
};
