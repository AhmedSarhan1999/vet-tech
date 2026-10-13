import React, { useState, useMemo } from 'react';
import { DigitalVetPassport } from '../../shared/types/vet-passport';
import { useAuth } from '../auth/AuthContext';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  FileCheck,
  MapPin,
  Lock,
  Edit2,
  Check,
} from 'lucide-react';
import { useDragScroll } from '../../shared/lib/use-drag-scroll';
import { BookingConfirmationScreen } from './BookingConfirmationScreen';
import { ScheduledBookingConfirmationScreen } from './ScheduledBookingConfirmationScreen';
import { BookingRepository } from '@/dal/booking.repository';
import { BookingOrder } from '@/shared/types/booking';

export interface BookingDoctorInfo {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly education: string;
  readonly rating: number;
  readonly callsCount: number;
  readonly priceRubles: number;
  readonly vetIsLicense?: string;
  readonly vehicle?: string;
  readonly avatarUrl?: string;
  readonly avatarInitials?: string;
}

export interface BookingSlotScreenProps {
  readonly doctor?: BookingDoctorInfo;
  readonly pet?: DigitalVetPassport | null;
  readonly onBack: () => void;
  readonly onProceedToStep3?: (bookingSummary: {
    doctor: BookingDoctorInfo;
    format: 'urgent' | 'planned';
    dateText: string;
    slotTime: string;
    petName: string;
    priceRubles: number;
  }) => void;
  readonly onCompleteBooking?: (order?: BookingOrder) => void;
  readonly bookingRepo?: BookingRepository;
}

interface DateOption {
  readonly id: string;
  readonly dayOfWeek: string;
  readonly dateText: string;
  readonly slotsCount: number;
  readonly fullDateName: string;
  readonly shortDateLabel: string;
}

interface TimeSlot {
  readonly id: string;
  readonly timeRange: string;
  readonly startTime: string;
  readonly label: string;
  readonly isAvailable: boolean;
  readonly isOptimal?: boolean;
}

const DEFAULT_DOCTOR: BookingDoctorInfo = {
  id: 'doc-romanov',
  name: 'Д-р Романов Дмитрий С.',
  title: 'Ветеринарный врач-терапевт, хирург • СПбГУВМ',
  education: 'СПбГУВМ',
  rating: 4.98,
  callsCount: 310,
  priceRubles: 3500,
  vetIsLicense: 'ВетИС «Меркурий» / Россельхознадзор',
  vehicle: 'Renault Duster',
  avatarInitials: 'РД',
};

const DATE_OPTIONS: readonly DateOption[] = [
  {
    id: 'today',
    dayOfWeek: 'Сегодня',
    dateText: '11 окт',
    slotsCount: 2,
    fullDateName: '11 октября',
    shortDateLabel: '11 окт',
  },
  {
    id: 'tomorrow',
    dayOfWeek: 'Завтра',
    dateText: '12 окт',
    slotsCount: 4,
    fullDateName: '12 октября',
    shortDateLabel: '12 окт',
  },
  {
    id: 'mon',
    dayOfWeek: 'Пн',
    dateText: '13 окт',
    slotsCount: 5,
    fullDateName: '13 октября',
    shortDateLabel: '13 окт',
  },
  {
    id: 'tue',
    dayOfWeek: 'Вт',
    dateText: '14 окт',
    slotsCount: 6,
    fullDateName: '14 октября',
    shortDateLabel: '14 окт',
  },
];

const TIME_SLOTS: readonly TimeSlot[] = [
  {
    id: 'slot-1',
    timeRange: '10:00 - 11:30',
    startTime: '10:00',
    label: 'Утренний выезд',
    isAvailable: true,
  },
  {
    id: 'slot-2',
    timeRange: '12:00 - 13:30',
    startTime: '12:00',
    label: 'Дневной выезд',
    isAvailable: false, // Занято
  },
  {
    id: 'slot-3',
    timeRange: '14:00 - 15:30',
    startTime: '14:00',
    label: 'Оптимальное время • Дневной',
    isAvailable: true,
    isOptimal: true, // Выбран по умолчанию
  },
  {
    id: 'slot-4',
    timeRange: '16:00 - 17:30',
    startTime: '16:00',
    label: 'Предвечерний интервал',
    isAvailable: true,
  },
  {
    id: 'slot-5',
    timeRange: '18:00 - 19:30',
    startTime: '18:00',
    label: 'Вечерний интервал',
    isAvailable: true,
  },
];

export const BookingSlotScreen: React.FC<BookingSlotScreenProps> = ({
  doctor = DEFAULT_DOCTOR,
  pet,
  onBack,
  onProceedToStep3,
  onCompleteBooking,
  bookingRepo,
}) => {
  const { user } = useAuth();
  const dateCarouselRef = useDragScroll<HTMLDivElement>();

  const [visitFormat, setVisitFormat] = useState<'urgent' | 'planned'>('planned');
  const [selectedDateId, setSelectedDateId] = useState<string>('tomorrow');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('slot-3');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<{
    dateText: string;
    slotTime: string;
    format: 'urgent' | 'planned';
  } | null>(null);

  // Resolved active date and slot
  const activeDate: DateOption = useMemo(() => {
    return DATE_OPTIONS.find((d) => d.id === selectedDateId) ?? DATE_OPTIONS[1]!;
  }, [selectedDateId]);

  const activeSlot: TimeSlot = useMemo(() => {
    return TIME_SLOTS.find((s) => s.id === selectedSlotId) ?? TIME_SLOTS[2]!;
  }, [selectedSlotId]);

  // Dynamic pet identity
  const petName = pet?.petName ?? 'Норд';
  const petBreed = pet?.breedNameRu ?? 'Сибирский хаски';
  const petAge = pet?.birthDateIso
    ? `${Math.max(1, new Date().getFullYear() - new Date(pet.birthDateIso).getFullYear())} года`
    : '3 года';
  const chipNumber = pet?.microchip?.chipNumber ?? '643094100284912';
  const passportNumber = pet?.passportSeriesNumber ?? 'ВЕТ-491';
  const addressText = pet?.residentialAddress
    ? `${pet.residentialAddress.streetAddress} (${pet.residentialAddress.district} р-н)`
    : 'ул. Ленина, д. 28, кв. 42 (Петроградский р-н)';

  // User initials for header
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  const handleConfirmSlot = () => {
    const data = {
      dateText: visitFormat === 'urgent' ? 'Сейчас' : activeDate.shortDateLabel,
      slotTime: visitFormat === 'urgent' ? '~15-20 мин' : activeSlot.startTime,
      format: visitFormat,
    };

    if (onProceedToStep3) {
      onProceedToStep3({
        doctor,
        format: visitFormat,
        dateText: visitFormat === 'urgent' ? 'Сейчас' : activeDate.shortDateLabel,
        slotTime: visitFormat === 'urgent' ? '~15-20 мин' : activeSlot.startTime,
        petName,
        priceRubles: doctor.priceRubles,
      });
    } else {
      setConfirmationData(data);
    }
  };

  if (confirmationData) {
    if (confirmationData.format === 'planned') {
      return (
        <ScheduledBookingConfirmationScreen
          doctor={doctor}
          pet={pet}
          slotDetails={confirmationData}
          onBack={() => setConfirmationData(null)}
          onCompleteBooking={(order) => {
            setConfirmationData(null);
            if (onCompleteBooking) {
              onCompleteBooking(order);
            } else {
              onBack();
            }
          }}
          bookingRepo={bookingRepo}
        />
      );
    }

    return (
      <BookingConfirmationScreen
        doctor={doctor}
        pet={pet}
        slotDetails={confirmationData}
        onBack={() => setConfirmationData(null)}
        onCompleteBooking={(order) => {
          setConfirmationData(null);
          if (onCompleteBooking) {
            onCompleteBooking(order);
          } else {
            onBack();
          }
        }}
        bookingRepo={bookingRepo}
      />
    );
  }

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* 1. TOP BAR & STEP TITLE                                   */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к выбору врача"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block leading-tight">
                ШАГ 2 ИЗ 3 • ВЫБОР СЛОТА
              </span>
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                Время и формат вызова
              </h1>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Аватар'}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* 2. DOCTOR SUMMARY CARD (FLOATING ELEVATED CARD)           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 min-w-0">
              {/* Doctor Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {doctor.avatarInitials ?? 'РД'}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
              </div>

              {/* Doctor Info */}
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {doctor.name}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                  {doctor.title}
                </p>

                {/* Rating & Regulatory Badges */}
                <div className="flex items-center space-x-2 mt-1.5 text-[11px] flex-wrap gap-y-1">
                  <span className="flex items-center space-x-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{doctor.rating}</span>
                    <span className="text-slate-400 font-normal">({doctor.callsCount}+ выездов)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="text-right shrink-0">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Ставка
              </span>
              <span className="text-base font-black text-slate-900 leading-none">
                {doctor.priceRubles.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Regulatory Authority Stamp */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{doctor.vetIsLicense ?? 'ВетИС «Меркурий» / Россельхознадзор'}</span>
            </div>
            <span className="text-slate-400 font-normal">
              {doctor.vehicle ?? 'Renault Duster'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. VISIT FORMAT SELECTOR                                  */}
        {/* ========================================================= */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block px-1">
            Формат вызова
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Urgent Option */}
            <button
              type="button"
              onClick={() => setVisitFormat('urgent')}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                visitFormat === 'urgent'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-1.5 text-amber-700">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                <span className="text-xs font-black">20-30 мин</span>
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">Срочный выезд</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                Дежурный вет-экипаж
              </div>
            </button>

            {/* Planned Option (Selected by Default) */}
            <button
              type="button"
              onClick={() => setVisitFormat('planned')}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                visitFormat === 'planned'
                  ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-blue-700">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-black">Запланировать</span>
                </div>
                {visitFormat === 'planned' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">Плановый осмотр</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                Вакцинация, диспансеризация
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. EMERGENCY DISPATCH ALERT BANNER (URGENT FORMAT)        */}
        {/* ========================================================= */}
        {visitFormat === 'urgent' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 space-y-3 animate-fadeIn">
            <div className="flex items-center space-x-2 text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider">
                Экстренная ветеринарная служба 24/7
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  Ближайшая бригада ветеринарной скорой помощи готова к выезду.
                </h3>
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  Расчетное время прибытия: ~15–20 минут.
                </p>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Мобильный экипаж оснащен экспресс-лабораторией, кислородом и средствами экстренной реанимации.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-900">
              <span>Экипаж на дежурстве: {doctor.name}</span>
              <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-lg text-[10px]">
                Приоритет: URGENT
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4 & 5. DATE CAROUSEL & TIME SLOTS (PLANNED FORMAT ONLY)   */}
        {/* ========================================================= */}
        {visitFormat === 'planned' && (
          <>
            {/* 4. DATE CAROUSEL (ВЫБЕРИТЕ ДАТУ • ОКТЯБРЬ) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Выберите дату • Октябрь
                </label>
                <span className="text-[10px] font-bold text-blue-600">
                  {activeDate.fullDateName}
                </span>
              </div>

              <div
                ref={dateCarouselRef}
                className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 cursor-grab active:cursor-grabbing select-none"
              >
                {DATE_OPTIONS.map((item) => {
                  const isSelected = item.id === selectedDateId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedDateId(item.id)}
                      className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border min-h-[44px] flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{item.dayOfWeek}</span>
                        <span className={isSelected ? 'text-blue-100' : 'text-slate-900'}>
                          {item.dateText}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-medium mt-0.5 ${
                          isSelected ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        ({item.slotsCount} {item.slotsCount === 2 ? 'слота' : 'слотов'})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. ARRIVAL TIME WINDOWS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Интервалы прибытия на {activeDate.fullDateName}
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Шаг: 1.5 часа
                </span>
              </div>

              {/* Notice Callout */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/70 flex items-start space-x-2.5 text-xs text-sky-900">
                <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-sky-800">
                  Интервал 1.5 ч включает дорожную обстановку района и осмотр питомца без стресса (лампа Вуда, термометрия, чип-сканер).
                </p>
              </div>

              {/* Interactive Slots List */}
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = slot.id === selectedSlotId && slot.isAvailable;
                  const isDisabled = !slot.isAvailable;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => slot.isAvailable && setSelectedSlotId(slot.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isDisabled
                          ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="shrink-0 inline-flex items-center justify-center">
                          <Clock
                            className={`w-4 h-4 ${
                              isSelected
                                ? 'text-white'
                                : isDisabled
                                ? 'text-slate-400'
                                : 'text-blue-600'
                            }`}
                          />
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`text-xs font-black leading-tight ${
                              isDisabled ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {slot.timeRange}
                          </div>
                          <div
                            className={`text-[10px] font-medium leading-tight mt-0.5 truncate ${
                              isSelected
                                ? 'text-blue-100'
                                : isDisabled
                                ? 'text-slate-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {slot.label}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        {isDisabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-200 text-slate-500">
                            Занято
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white text-blue-600 flex items-center space-x-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Выбран</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                            Свободно
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 6. PRE-VISIT SUMMARY CARD                                 */}
        {/* ========================================================= */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>ДАННЫЕ ВЫЗОВА • СПБ ВЕТСЛУЖБА 24/7</span>
            </span>
            <button
              type="button"
              onClick={() => alert('Редактирование данных вызова: адрес и примечания')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Edit2 className="w-3 h-3 shrink-0" />
              <span>Изменить</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Pet details */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-xs">
                Пациент: {petName} ({petBreed}, {petAge})
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Чип: {chipNumber} • Ветпаспорт #{passportNumber}
              </div>
            </div>

            {/* Procedure */}
            <div className="flex items-start space-x-2 text-slate-700">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span className="text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-900">Процедура:</span> Плановая комплексная вакцинация (Nobivac DHPPI + Lepto) + отметка в ВетИС
              </span>
            </div>

            {/* Safety instructions */}
            <div className="flex items-start space-x-2 text-slate-700">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span className="text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-900">Инструкция безопасности:</span> Хаски изолирован в комнате, намордник и ошейник подготовлены для фиксации
              </span>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-2 text-slate-700 pt-1 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-[11px] text-slate-600 font-medium truncate">
                {addressText}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. STICKY BOTTOM ACTION & ESCROW DISCLAIMER               */}
        {/* ========================================================= */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleConfirmSlot}
            className={`text-white font-bold shadow-md rounded-2xl w-full min-h-[50px] px-4 py-3 flex items-center justify-center transition-all active:scale-[0.99] space-x-2 ${
              visitFormat === 'urgent'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-[#0D6EFD] hover:bg-[#0B5ED7] shadow-blue-600/20'
            }`}
          >
            <span className="text-white font-extrabold text-sm sm:text-base">
              {visitFormat === 'urgent'
                ? 'Перейти к экстренному вызову (~15–20 мин)'
                : `Перейти к подтверждению: ${activeDate.shortDateLabel}, ${activeSlot.startTime}`}
            </span>
            <span className="text-white font-extrabold text-base sm:text-lg">→</span>
          </button>

          {/* Regulatory Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2 text-[10px] text-slate-600 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p>
              🔒 Сумма {doctor.priceRubles.toLocaleString('ru-RU')} ₽ будет зарезервирована через ЮKassa и спишется только после завершения осмотра питомца и внесения записи в ФГИС «ВетИС» (Закон РФ № 4979-1).
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUCCESS CONFIRMATION MODAL (INTERACTIVE TESTING)          */}
      {/* ========================================================= */}
      {isSuccessModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Слот успешно забронирован!
              </h3>
              <p className="text-xs text-slate-600">
                {activeDate.fullDateName}, {activeSlot.timeRange}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Врач: {doctor.name} • Пациент: {petName}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Сумма холдирования:</span>
                <span className="font-bold text-slate-900">{doctor.priceRubles.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Гарантия:</span>
                <span className="font-semibold text-emerald-700">ЮKassa Эскроу</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Уведомление в ВетИС:</span>
                <span className="font-semibold text-blue-700">ФГИС «Хорриот»</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onBack();
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
            >
              Вернуться к списку врачей
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
