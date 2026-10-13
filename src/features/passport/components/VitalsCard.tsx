import React from 'react';
import { VeterinaryVitals } from '../../../shared/types/veterinary';
import { Stethoscope } from 'lucide-react';

interface VitalsCardProps {
  readonly vitals?: VeterinaryVitals;
  readonly fallbackWeightKg: number;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, fallbackWeightKg }) => {
  const weight = vitals?.bodyWeightKg ?? fallbackWeightKg;

  // Temperature evaluation for canines/felines
  const getTempStatus = (temp?: number) => {
    if (!temp) return null;
    if (temp < 37.5) return { label: 'Гипотермия', color: 'text-blue-600 bg-blue-50' };
    if (temp <= 39.2) return { label: 'Норма', color: 'text-emerald-700 bg-emerald-50' };
    if (temp <= 39.8) return { label: 'Субфебрильная', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Гипертермия / Лихорадка', color: 'text-rose-700 bg-rose-50' };
  };

  const getMucousMembraneLabel = (color?: string) => {
    switch (color) {
      case 'PINK':
        return { label: 'Розовые (Норма)', color: 'text-emerald-700 bg-emerald-50' };
      case 'PALE':
        return { label: 'Бледные (Анемия/Шок)', color: 'text-amber-700 bg-amber-50' };
      case 'CYANOTIC':
        return { label: 'Цианотичные (Гипоксия)', color: 'text-rose-700 bg-rose-50' };
      case 'ICTERIC':
        return { label: 'Иктеричные (Желтуха)', color: 'text-amber-800 bg-amber-100' };
      case 'HYPEREMIC':
        return { label: 'Гиперемированные (Сепсис)', color: 'text-rose-800 bg-rose-100' };
      default:
        return { label: 'Не оценивалось', color: 'text-slate-600 bg-slate-100' };
    }
  };

  const tempStatus = getTempStatus(vitals?.rectalTemperatureCelsius);
  const mucousStatus = getMucousMembraneLabel(vitals?.mucousMembraneColor);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <Stethoscope className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Клинические показатели</h4>
            <p className="text-[10px] text-slate-400">
              {vitals?.recordedAtIso
                ? `Осмотр от ${new Date(vitals.recordedAtIso).toLocaleDateString('ru-RU')}`
                : 'Физиологические параметры'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Объективный осмотр
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Weight */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-medium">Масса тела</div>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {weight} <span className="text-xs font-medium text-slate-500">кг</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-1">Точный вес для дозировок</div>
        </div>

        {/* Temperature */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">Ректальная T°</span>
            {tempStatus && (
              <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${tempStatus.color}`}>
                {tempStatus.label}
              </span>
            )}
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {vitals?.rectalTemperatureCelsius ? (
              <>
                {vitals.rectalTemperatureCelsius} <span className="text-xs font-medium text-slate-500">°C</span>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-normal">Нет данных</span>
            )}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">Норма: 37.5 – 39.2 °C</div>
        </div>

        {/* Heart Rate */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-medium">Пульс / ЧСС</div>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {vitals?.heartRateBpm ? (
              <>
                {vitals.heartRateBpm} <span className="text-xs font-medium text-slate-500">уд/мин</span>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-normal">Нет данных</span>
            )}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">Аускультация сердца</div>
        </div>

        {/* Respiratory Rate */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-medium">Частота дыхания (ЧДД)</div>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">
            {vitals?.respiratoryRatePerMin ? (
              <>
                {vitals.respiratoryRatePerMin} <span className="text-xs font-medium text-slate-500">д/мин</span>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-normal">Нет данных</span>
            )}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">В состоянии покоя</div>
        </div>
      </div>

      {/* Capillary Refill Time and Mucous Membranes */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">СНК (наполнение капилляров):</span>
          <span className="font-bold text-slate-800 mt-0.5">
            {vitals?.capillaryRefillTimeSeconds ? `${vitals.capillaryRefillTimeSeconds} сек` : 'до 2 сек (норма)'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Слизистые оболочки:</span>
          <span className={`inline-block font-bold text-[10px] px-1.5 py-0.5 rounded mt-0.5 self-start ${mucousStatus.color}`}>
            {mucousStatus.label}
          </span>
        </div>
      </div>
    </div>
  );
};
