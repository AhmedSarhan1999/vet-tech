import React, { useState, useMemo } from 'react';
import { DigitalVetPassport } from '../../shared/types/vet-passport';
import { useAuth } from '../auth/AuthContext';
import { BookingDoctorInfo } from './BookingSlotScreen';
import { BookingRepository } from '@/dal/booking.repository';
import { ScheduledBookingOrder, BookingOrder } from '@/shared/types/booking';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Calendar,
  Check,
  Clock,
  MapPin,
  CreditCard,
  Lock,
  ChevronRight,
  CheckCircle2,
  BellRing,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

export interface ScheduledBookingConfirmationScreenProps {
  readonly doctor?: BookingDoctorInfo;
  readonly pet?: DigitalVetPassport | null;
  readonly slotDetails?: {
    dateText: string;
    slotTime: string;
    format: 'urgent' | 'planned';
    fullDateName?: string;
    timeRange?: string;
  };
  readonly onBack: () => void;
  readonly onCompleteBooking?: (order?: BookingOrder) => void;
  readonly bookingRepo?: BookingRepository;
}

const DEFAULT_SCHEDULED_DOCTOR: BookingDoctorInfo = {
  id: 'doc-romanov',
  name: 'Д-р Романов Д. С.',
  title: 'Ветеринарный терапевт, хирург • СПбГУВМ',
  education: 'СПбГУВМ',
  rating: 4.98,
  callsCount: 194,
  priceRubles: 2800,
  vetIsLicense: 'ВетИС #78-VET • Россельхознадзор',
  vehicle: 'Renault Duster (термобокс для биопрепаратов)',
  avatarInitials: 'РД',
};

export const ScheduledBookingConfirmationScreen: React.FC<ScheduledBookingConfirmationScreenProps> = ({
  doctor = DEFAULT_SCHEDULED_DOCTOR,
  pet,
  slotDetails = {
    dateText: '12 окт',
    slotTime: '14:00',
    format: 'planned',
    fullDateName: 'Вторник, 12 октября',
    timeRange: '14:00 - 15:30',
  },
  onBack,
  onCompleteBooking,
  bookingRepo,
}) => {
  const { user } = useAuth();
  const repo = useMemo(() => bookingRepo ?? new BookingRepository(), [bookingRepo]);

  const [isChecklistChecked, setIsChecklistChecked] = useState<boolean>(true);
  const [selectedPaymentCard, setSelectedPaymentCard] = useState<string>(
    'МИР •••• 4412 (ПАО Сбербанк • Основная)'
  );
  const [isHoldSuccessModalOpen, setIsHoldSuccessModalOpen] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<ScheduledBookingOrder | null>(null);

  // Dynamic Pet and Patient details
  const petName = pet?.petName ?? 'Норд';
  const petBreed = pet?.breedNameRu ?? 'Сибирский хаски';
  const petAge = pet?.birthDateIso
    ? `${Math.max(1, new Date().getFullYear() - new Date(pet.birthDateIso).getFullYear())} года`
    : '3 года';
  const petWeight = pet?.weightKg ? `${pet.weightKg} кг` : '26.4 кг';
  const passportNumber = pet?.passportSeriesNumber ?? 'ВЕТ-491';
  const chipNumber = pet?.microchip?.chipNumber ?? '643094100284912';

  // Formatted Scheduled Slot
  const displayDateText = slotDetails.fullDateName ?? 'Вторник, 12 октября';
  const displayTimeWindow = slotDetails.timeRange ?? '14:00 - 15:30';

  // User initials for header
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  const handleConfirmReservation = async () => {
    const newScheduledOrder: ScheduledBookingOrder = {
      id: `ord-plan-${Date.now()}`,
      dispatchType: 'scheduled',
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
      userId: user?.uid ?? 'usr-spb-parent-01',
      status: 'HOLD_AUTHORIZED',
      scheduledDateText: displayDateText,
      timeWindow: {
        startTime: slotDetails.slotTime,
        endTime: '15:30',
        label: 'Оптимальное время • Дневной интервал',
      },
      cancellationDeadlineText: 'до 12:00 (за 2 часа до визита)',
      reminderAdvanceHours: 2,
      pet: {
        id: pet?.id ?? 'pet-nord-01',
        name: petName,
        breed: petBreed,
        weightKg: pet?.weightKg ?? 26.4,
        ageText: petAge,
        microchipNumber: chipNumber,
        passportSeriesNumber: passportNumber,
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        licenseNumber: doctor.vetIsLicense ?? 'ВетИС #78-VET',
        vehicle: doctor.vehicle ?? 'Renault Duster',
        specialization: doctor.title,
        rating: doctor.rating,
        callsCount: doctor.callsCount,
      },
      address: {
        district: pet?.residentialAddress?.district ?? 'Петроградский',
        street: 'ул. Ленина',
        house: '28',
        entrance: '2',
        floor: '4',
        apartment: '42',
        intercomCode: '42',
        barrierNotes: 'Шлагбаум: открыть через охрану',
        fullAddressText: 'г. Санкт-Петербург, ул. Ленина, д. 28, подъезд 2, этаж 4, кв. 42',
      },
      restraintProtocol: {
        temperamentNotes: 'Дружелюбен, активен',
        softMuzzleRequired: true,
        leashRequired: true,
        otherAnimalsIsolated: true,
        isVetPassportPrepared: isChecklistChecked,
      },
      anamnesis: {
        chiefComplaint: 'Плановая диспансеризация и вакцинация',
        clinicalPurpose:
          'Плановая комплексная вакцинация (Nobivac DHPPi + L), кардиоскрининг перед поездкой за город, считывание микрочипа и внесение записи в ФГИС «ВетИС» (Хорриот).',
      },
      pricing: {
        basePriceRubles: 3500,
        discountRubles: 700,
        finalHoldRubles: 2800,
        tariffLabel: 'Плановый тариф • Раннее бронирование',
      },
      payment: {
        cardMask: '4412',
        bankName: 'ПАО Сбербанк',
        yooKassaHoldId: `yk-hold-${Date.now()}`,
        status: 'HOLD_AUTHORIZED',
      },
    };

    await repo.createBooking(newScheduledOrder);
    setCreatedOrder(newScheduledOrder);
    setIsHoldSuccessModalOpen(true);
  };

  const handleFinishBooking = () => {
    setIsHoldSuccessModalOpen(false);
    if (onCompleteBooking) {
      onCompleteBooking(createdOrder ?? undefined);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* 1. STICKY HEADER & REGULATORY RIBBON                     */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к выбору слота"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block leading-tight">
                ШАГ 3 ИЗ 3 • ПОДТВЕРЖДЕНИЕ
              </span>
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                СПб ВетСлужба 24/7
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

      {/* Regulatory Status Banner */}
      <div className="bg-emerald-50/90 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[10px] font-extrabold text-emerald-900 tracking-wide truncate">
            ПЛАНОВЫЙ ВЫЕЗД ВЕТВРАЧА • Петроградский р-н • Закон РФ № 4979-1
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* 2. CONFIRMED ARRIVAL SLOT CARD                            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200/80">
              <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Согласованный интервал прибытия</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Шаг: 1.5 ч
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5 shrink-0" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-slate-900 leading-snug">
                {displayDateText}
              </h2>
              <div className="text-xs font-bold text-blue-700 mt-0.5">
                Окно прибытия: {displayTimeWindow}
              </div>
            </div>
          </div>

          {/* Advance Reminder Calm Info Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
            <BellRing className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              Напоминание поступит за 2 часа до визита. Доктор прибудет со стерильной укладкой, ISO-сканером микрочипов и термоконтейнером с сертифицированными биопрепаратами (ВетИС).
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. SELECTED DOCTOR CARD WITH PLANNED DISCOUNT            */}
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

              {/* Info */}
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {doctor.name}
                </h3>
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
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                    {doctor.vetIsLicense ?? 'ВетИС #78-VET'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing with Planned Discount */}
            <div className="text-right shrink-0">
              <div className="line-through text-xs font-semibold text-slate-400">
                3 500 ₽
              </div>
              <div className="text-lg font-black text-slate-900 leading-none mt-0.5">
                2 800 ₽
              </div>
              <span className="inline-block mt-1 text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                Скидка -700 ₽
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Плановый тариф</span>
            </span>
            <span className="text-slate-500 text-[10px]">
              Спеццена за раннее планирование осмотра и вакцинации
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. PATIENT & CLINICAL PURPOSE CARD                       */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Пациент и цель визита</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Ветпаспорт #{passportNumber}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-black text-slate-900">
              Собака {petName} ({petBreed}, {petAge}, {petWeight})
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Чип ISO: #{chipNumber}
            </div>
          </div>

          {/* Purpose of Visit Callout */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-xs text-blue-950 space-y-1">
            <span className="font-bold text-blue-900 block text-[11px]">
              Назначенная процедура:
            </span>
            <p className="text-[11px] leading-relaxed text-blue-900/90">
              Плановая комплексная вакцинация (Nobivac DHPPi + L), кардиоскрининг перед поездкой за город, считывание микрочипа и внесение записи в ФГИС «ВетИС» (Хорриот).
            </p>
          </div>

          {/* Checklist Notice */}
          <button
            type="button"
            onClick={() => setIsChecklistChecked(!isChecklistChecked)}
            className="w-full text-left flex items-start space-x-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div
              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                isChecklistChecked
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-300 bg-white'
              }`}
            >
              {isChecklistChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-[11px] text-slate-700 leading-tight">
              Международный ветпаспорт и микрочип подготовлены к официальной регистрации в ФГИС «ВетИС»
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 5. LOGISTICS & BIOSECURITY RESTRAINT PROTOCOL CARD       */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Адрес прибытия ветврача</span>
            </span>
            <button
              type="button"
              onClick={() => alert('Редактирование адреса вызова')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              Изменить
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-900 leading-snug">
              г. Санкт-Петербург, ул. Ленина, д. 28, подъезд 2, этаж 4, кв. 42
            </div>

            {/* Logistics Pill */}
            <div className="inline-block p-2 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px]">
              Домофон: 42 • Шлагбаум: открыть через охрану
            </div>

            {/* Directives */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed space-y-1">
              <div className="font-bold text-slate-900">
                Фиксация и зообезопасность (ст. 2.1 Закона РФ № 4979-1):
              </div>
              <p>
                Дружелюбен, активен. Подготовлены поводок и мягкий намордник для осмотра слизистых и термометрии. Зона осмотра изолирована от сквозняков.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. YOOKASSA ESCROW FINANCIAL SUMMARY                     */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Закон РФ № 4979-1 • Эскроу ЮKassa</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              ХОЛДИРОВАНИЕ • БЕЗ СПИСАНИЯ
            </span>
          </div>

          {/* Itemized Line Items */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Базовый плановый очный выезд ветврача:</span>
              <span className="font-semibold text-slate-900">2 800 ₽</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Антисептический набор, расходники и ВетИС:</span>
              <span className="font-semibold text-emerald-600">Включено</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Сервисный сбор платформы:</span>
              <span className="font-semibold text-slate-500">0 ₽ (0%)</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-800 text-xs">Итого к холдированию:</span>
              <span className="text-xl font-black text-slate-900">2 800 ₽</span>
            </div>
          </div>

          {/* Linked Bank Card Pill */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-800 truncate">
                {selectedPaymentCard}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedPaymentCard((prev) =>
                  prev.includes('4412')
                    ? 'Tinkoff Black •••• 8821 (Т-Банк)'
                    : 'МИР •••• 4412 (ПАО Сбербанк • Основная)'
                );
              }}
              className="text-blue-600 font-bold hover:underline shrink-0 text-xs flex items-center space-x-0.5"
            >
              <span>Изменить</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Escrow Legal Reassurance Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-start space-x-2.5 text-[11px] text-emerald-950 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              🛡️ Бесплатная отмена или перенос слота возможны до 12:00 (за 2 часа до прибытия). Средства 2 800 ₽ замораживаются на вашей карте через ЮKassa и списываются исключительно после очного осмотра, сканирования чипа и цифрового подписания протокола в приложении.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 7. STICKY ACTION BAR & LEGAL FOOTNOTE                    */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleConfirmReservation}
            className="w-full h-12 px-5 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.99]"
          >
            <span>Зарезервировать 2 800 ₽ и подтвердить запись</span>
            <span className="text-base font-extrabold">→</span>
          </button>

          <p className="text-[10px] text-slate-500 leading-relaxed text-center px-1">
            Нажимая кнопку, вы подтверждаете согласие с условиями публичной оферты и регламентом планового ветеринарного обслуживания (Закон РФ № 4979-1, 152-ФЗ). Данные вакцинации синхронизируются с Россельхознадзором (ФГИС «ВетИС»), фискальный чек (54-ФЗ) поступит на e-mail.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. YOOKASSA SCHEDULED HOLD SUCCESS MODAL                 */}
      {/* ========================================================= */}
      {isHoldSuccessModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsHoldSuccessModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">
                ЮKassa • Холдирование 2 800 ₽ успешно
              </span>
              <h3 className="text-base font-black text-slate-900">
                Заказ на плановый выезд оформлен!
              </h3>
              <p className="text-xs text-slate-600">
                Заказ #{createdOrder?.id ?? 'RU-78/VET-2024-PLAN-841'} • ФГИС «Хорриот»
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Врач визита:</span>
                <span className="font-bold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Дата и интервал:</span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  {displayDateText}, {displayTimeWindow}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Заморожено на карте:</span>
                <span className="font-bold text-slate-900">2 800 ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Бесплатная отмена:</span>
                <span className="font-semibold text-emerald-700">до 12:00 (за 2 часа)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishBooking}
              className="w-full py-3 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Перейти к моим записям →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
