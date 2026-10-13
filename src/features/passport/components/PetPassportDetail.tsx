import React from 'react';
import { DigitalVetPassport } from '../../../shared/types/vet-passport';
import { BiosecurityStatusCard } from './BiosecurityStatusCard';
import { VaccinationHistoryList } from './VaccinationHistoryList';
import {
  ShieldCheck,
  MapPin,
  Building,
  QrCode,
  PhoneCall,
  Dog,
  Cat,
  Rat,
  Rabbit,
  PawPrint,
  Pill,
  Activity,
  Tag,
} from 'lucide-react';

export interface PetPassportDetailProps {
  readonly passport: DigitalVetPassport;
  readonly onRequestHouseCall?: (pet: DigitalVetPassport) => void;
  readonly onOpenTherapyTracker?: (pet: DigitalVetPassport) => void;
}

export const PetPassportDetail: React.FC<PetPassportDetailProps> = ({
  passport,
  onRequestHouseCall,
  onOpenTherapyTracker,
}) => {
  // Calculate age string
  const calculateAge = (birthDateIso: string): string => {
    const birth = new Date(birthDateIso);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years <= 0) {
      return `${months} мес.`;
    }
    return `${years} г. ${months} мес.`;
  };

  const renderSpeciesIcon = (species: string) => {
    switch (species) {
      case 'canine':
        return <Dog className="w-8 h-8 text-blue-600" />;
      case 'feline':
        return <Cat className="w-8 h-8 text-amber-600" />;
      case 'rodent':
        return <Rat className="w-8 h-8 text-slate-600" />;
      case 'lagomorph':
        return <Rabbit className="w-8 h-8 text-pink-600" />;
      default:
        return <PawPrint className="w-8 h-8 text-teal-600" />;
    }
  };

  const getSexLabel = (sex: string, isSterilized: boolean): string => {
    switch (sex) {
      case 'MALE_CASTRATED':
        return 'Самец (кастрирован)';
      case 'MALE_INTACT':
        return isSterilized ? 'Самец (кастрирован)' : 'Самец (интактный)';
      case 'FEMALE_STERILIZED':
        return 'Самка (стерилизована)';
      case 'FEMALE_INTACT':
        return isSterilized ? 'Самка (стерилизована)' : 'Самка (интактная)';
      default:
        return 'Пол не указан';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn font-sans">
      {/* Official Header Card - Luminous Cheerful Clinical Document Surface */}
      <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-md border border-slate-200/90 relative overflow-hidden space-y-4">
        {/* Subtle Watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-[0.04] pointer-events-none text-blue-600">
          <ShieldCheck className="w-52 h-52" />
        </div>

        {/* Regulatory Stamp */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-[11px] font-black tracking-wider text-slate-700 uppercase">
              ФГИС «ВетИС» • Госреестр
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-lg">
            {passport.passportSeriesNumber}
          </span>
        </div>

        {/* Pet Profile Details */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
            {renderSpeciesIcon(passport.speciesCategory)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">{passport.petName}</h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {passport.status === 'ACTIVE' ? 'АКТИВЕН' : 'КАРАНТИН'}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-600 mt-0.5 truncate">
              {passport.breedNameRu}
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-2 font-medium">
              <span>{getSexLabel(passport.sex, passport.isSterilized)}</span>
              <span>•</span>
              <span>{calculateAge(passport.birthDateIso)}</span>
              <span>•</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{passport.weightKg} кг</span>
            </div>
          </div>
        </div>

        {/* Identification Numbers Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-500 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>ХОРРИОТ ID (ВЕТИС)</span>
            </div>
            <div className="font-mono font-bold text-xs text-slate-900 mt-1.5 truncate">
              {passport.horriotId}
            </div>
            <div className="text-[9px] font-semibold text-emerald-700 mt-1 flex items-center space-x-1">
              <span>✓ Верифицирован в РФ</span>
            </div>
          </div>

          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-bold text-slate-500 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>МИКРОЧИП ISO</span>
            </div>
            <div className="font-mono font-bold text-xs text-slate-900 mt-1.5 truncate">
              {passport.microchip?.chipNumber ?? 'Не чипирован'}
            </div>
            <div className="text-[9px] font-semibold text-slate-500 mt-1">
              {passport.microchip?.isVerified ? 'Стандарт 11784/11785' : 'Ожидает верификации'}
            </div>
          </div>
        </div>

        {/* Location & Issuing Clinic */}
        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
          <div className="flex items-center space-x-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {passport.residentialAddress.district} р-н, {passport.residentialAddress.streetAddress}
            </span>
          </div>
          <div className="flex items-center space-x-2 truncate">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-slate-500">{passport.issuingClinicName}</span>
          </div>
        </div>
      </div>

      {/* Active Therapy & Medication Section - Luminous Friendly Clinical Card */}
      <div className="bg-gradient-to-br from-blue-50/90 via-white to-sky-50/80 rounded-3xl p-5 text-slate-900 shadow-md border-2 border-blue-200/90 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                Активная терапия и медикаменты
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-tight truncate mt-0.5">
                Синулокс 250 мг (Амоксициллин)
              </h3>
            </div>
          </div>

          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            День 1 из 10
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-blue-100/90 shadow-2xs space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-700">
            <span>Дозировка: <strong>1.5 таб 2 раза/сут</strong> (каждые 12 ч)</span>
            <span className="text-emerald-700 font-extrabold">Приверженность: 100%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Диагноз: Острый бактериальный трахеобронхит • Назначил: Д-р Романов Д. С.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenTherapyTracker?.(passport)}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span>Перейти в трекер терапии и приема лекарств →</span>
        </button>
      </div>

      {/* Quick Action Trigger: House-Call Dispatch */}
      {onRequestHouseCall && (
        <button
          type="button"
          onClick={() => onRequestHouseCall(passport)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md rounded-2xl w-full min-h-[50px] px-4 py-3 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white shrink-0" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-white font-extrabold text-sm sm:text-base leading-tight truncate">
                Вызвать врача для {passport.petName} →
              </div>
              <div className="text-white/90 text-xs font-semibold leading-tight truncate mt-0.5">
                Район: {passport.residentialAddress.district} • Скорая ветпомощь 24/7
              </div>
            </div>
          </div>
          <span className="text-xs font-black bg-white text-blue-700 px-3.5 py-1.5 rounded-xl shrink-0 shadow-xs">
            Вызов →
          </span>
        </button>
      )}

      {/* Biosecurity & Rabies Law No. 4979-1 */}
      <BiosecurityStatusCard passport={passport} />

      {/* Certified Vaccination Records (Mercury VSD) */}
      <VaccinationHistoryList
        rabiesVaccinations={passport.rabiesVaccinations}
        comprehensiveVaccinations={passport.comprehensiveVaccinations}
      />

      {/* Export / Share Footnote */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <QrCode className="w-4 h-4 text-slate-500" />
          <span className="text-[11px] font-medium">QR-код ветпаспорта для клиник СПб</span>
        </div>
        <button
          type="button"
          onClick={() => alert(`QR-код ветпаспорта ${passport.passportSeriesNumber} сгенерирован`)}
          className="text-blue-600 font-bold text-[11px] hover:underline cursor-pointer"
        >
          Открыть QR
        </button>
      </div>
    </div>
  );
};
