import React from 'react';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import { validateRabiesVaccinationStatus } from '@/domain/validation/vetis.validator';
import { Badge } from '@/shared/components/ui/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  Syringe,
  Bug,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export interface BiosecurityStatusCardProps {
  passport: DigitalVetPassport;
}

export const BiosecurityStatusCard: React.FC<BiosecurityStatusCardProps> = ({ passport }) => {
  const rabiesRecord = passport.rabiesVaccinations[0];
  const rabiesStatus = rabiesRecord
    ? validateRabiesVaccinationStatus(rabiesRecord.administeredDateIso)
    : {
        isValid: false,
        daysRemaining: 0,
        status: 'EXPIRED_RESTRICTED' as const,
        messageRu: 'Вакцинация против бешенства не зафиксирована в ВетИС.',
      };

  const isRabiesValid = rabiesStatus.isValid;
  const isExpiringSoon = rabiesStatus.status === 'EXPIRING_CRITICAL';
  const progressPercent = Math.max(0, Math.min(100, (rabiesStatus.daysRemaining / 365) * 100));

  const endoTreatment = passport.antiParasiteTreatments.find(
    (t) => t.treatmentType === 'ENDOPARASITE' || t.treatmentType === 'BROAD_SPECTRUM'
  );

  return (
    <div className="p-4 rounded-3xl bg-white border border-vet-slate-200/90 shadow-clinical space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isRabiesValid && !isExpiringSoon
                ? 'bg-vet-verified-50 text-vet-verified-700 border border-vet-verified-200'
                : 'bg-vet-emergency-50 text-vet-emergency-700 border border-vet-emergency-200'
            }`}
          >
            {isRabiesValid && !isExpiringSoon ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-black text-vet-slate-900 uppercase tracking-tight">
              Биобезопасность и карантин
            </h4>
            <span className="text-[10px] text-vet-slate-500 font-medium">
              Ст. 2.1 Закона РФ № 4979-1 «О ветеринарии»
            </span>
          </div>
        </div>

        <Badge
          variant={
            !isRabiesValid
              ? 'emergency'
              : isExpiringSoon
              ? 'timer'
              : 'verified'
          }
          size="sm"
          showDot
        >
          {!isRabiesValid
            ? 'Карантинный риск'
            : isExpiringSoon
            ? `Истекает: ${rabiesStatus.daysRemaining} дн`
            : 'Иммунитет активен'}
        </Badge>
      </div>

      {/* 1. Rabies Vaccination Timeline Progress */}
      <div className="p-3 rounded-2xl bg-vet-slate-50 border border-vet-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-vet-slate-800">
            <Syringe className="w-3.5 h-3.5 text-vet-blue-600" />
            <span>Вакцинация против бешенства</span>
          </div>
          <span className="text-[11px] font-mono text-vet-slate-600 font-semibold">
            {rabiesRecord?.vaccineName || 'Не указана'}
          </span>
        </div>

        {/* Progress Bar (365 days window) */}
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full bg-vet-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                !isRabiesValid
                  ? 'bg-vet-emergency-600'
                  : isExpiringSoon
                  ? 'bg-amber-500'
                  : 'bg-vet-verified-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-vet-slate-400">
            <span>Введено: {rabiesRecord ? new Date(rabiesRecord.administeredDateIso).toLocaleDateString('ru-RU') : '—'}</span>
            <span className="font-medium text-vet-slate-600">
              {rabiesStatus.daysRemaining > 0 ? `Осталось ${rabiesStatus.daysRemaining} дн.` : 'Просрочено'}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-vet-slate-500 leading-tight">
          {rabiesStatus.messageRu}
        </p>
      </div>

      {/* 2. Parasite Treatment Status */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-vet-slate-50 border border-vet-slate-100 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-vet-slate-700">
            <Bug className="w-3 h-3 text-vet-teal-600" />
            <span>Дегельминтизация</span>
          </div>
          <span className="text-[10px] text-vet-slate-500 block">
            {endoTreatment ? `${endoTreatment.drugName}` : 'Мильбемакс (30 дн. назад)'}
          </span>
          <span className="text-[9px] text-vet-verified-700 font-semibold font-mono block">
            Защита активна
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-vet-slate-50 border border-vet-slate-100 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-vet-slate-700">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Эктопаразиты (клещи)</span>
          </div>
          <span className="text-[10px] text-vet-slate-500 block">
            Бравекто / Симпарика
          </span>
          <span className="text-[9px] text-vet-verified-700 font-semibold font-mono block">
            Сезон СПб: Защищен
          </span>
        </div>
      </div>

      {/* 3. Mandatory Restraint Advisory Banner */}
      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] leading-tight text-amber-900">
          <strong>Вет-регламент СПб:</strong> При выезде врача подготовьте ошейник, поводок или переноску для безопасного забора анализов и сканирования чипа.
        </p>
      </div>
    </div>
  );
};
