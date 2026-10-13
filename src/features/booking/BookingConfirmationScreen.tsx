import React, { useState } from 'react';
import { DigitalVetPassport } from '../../shared/types/vet-passport';
import { useAuth } from '../auth/AuthContext';
import { BookingDoctorInfo } from './BookingSlotScreen';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Car,
  Check,
  AlertTriangle,
  FileCheck2,
  MapPin,
  CreditCard,
  Lock,
  Thermometer,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

import { BookingRepository } from '@/dal/booking.repository';
import { UrgentBookingOrder, BookingOrder } from '@/shared/types/booking';

export interface BookingConfirmationScreenProps {
  readonly doctor?: BookingDoctorInfo;
  readonly pet?: DigitalVetPassport | null;
  readonly slotDetails?: {
    dateText: string;
    slotTime: string;
    format: 'urgent' | 'planned';
  };
  readonly onBack: () => void;
  readonly onCompleteBooking?: (order?: BookingOrder) => void;
  readonly bookingRepo?: BookingRepository;
}

const DEFAULT_DOCTOR_CONFIRMATION: BookingDoctorInfo = {
  id: 'doc-romanov',
  name: 'Д-р Романов Д. С.',
  title: 'Ветеринарный терапевт • СПбГУВМ (Стаж 11 лет)',
  education: 'СПбГУВМ',
  rating: 4.97,
  callsCount: 388,
  priceRubles: 3500,
  vetIsLicense: 'ФГИС «ВетИС» • Аттестован',
  vehicle: 'VW Tiguan ВетНеотложка (вет-лаборатория, кислородный концентратор) • ~15-20 мин расчетное прибытие',
  avatarInitials: 'РД',
};

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  doctor = DEFAULT_DOCTOR_CONFIRMATION,
  pet,
  slotDetails: _slotDetails = {
    dateText: '12 окт',
    slotTime: '14:00',
    format: 'urgent',
  },
  onBack,
  onCompleteBooking,
  bookingRepo,
}) => {
  const { user } = useAuth();
  const repo = React.useMemo(() => bookingRepo ?? new BookingRepository(), [bookingRepo]);

  const [isBiosecurityChecked, setIsBiosecurityChecked] = useState<boolean>(true);
  const [selectedPaymentCard, setSelectedPaymentCard] = useState<string>(
    'МИР •••• 4412 (ПАО Сбербанк • Основная)'
  );
  const [isHoldSuccessModalOpen, setIsHoldSuccessModalOpen] = useState<boolean>(false);

  // Dynamic Pet and Anamnesis details
  const petName = pet?.petName ?? 'Норд';
  const petBreed = pet?.breedNameRu ?? 'Сибирский хаски';
  const petAge = pet?.birthDateIso
    ? `${Math.max(1, new Date().getFullYear() - new Date(pet.birthDateIso).getFullYear())} года`
    : '3 года';
  const petWeight = pet?.weightKg ? `${pet.weightKg} кг` : '28.5 кг';
  const chipNumber = pet?.microchip?.chipNumber ?? '643098100294812';

  // Dynamic user initials
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  const [createdOrder, setCreatedOrder] = useState<UrgentBookingOrder | null>(null);

  const handleAuthorizeHold = async () => {
    const newOrder: UrgentBookingOrder = {
      id: `urgent-${Date.now()}`,
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
      userId: user?.uid ?? 'guest-user-spb',
      dispatchType: 'urgent',
      status: 'HOLD_AUTHORIZED',
      etaMinutes: 18,
      urgentFlags: {
        feverTemperature: 'T 39.4°C',
        criticalSymptomAlert: 'Острый гастроэнтерит, рвота (2 раза с утра), вялость',
      },
      pet: {
        id: pet?.id ?? 'pet-nord-default',
        name: petName,
        breed: petBreed,
        weightKg: pet?.weightKg ?? 28.5,
        ageText: petAge,
        microchipNumber: chipNumber,
        passportSeriesNumber: pet?.passportSeriesNumber ?? 'ВЕТ-491',
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.title,
        vehicle: doctor.vehicle ?? 'VW Tiguan ВетНеотложка #В741АА198',
        licenseNumber: doctor.vetIsLicense ?? 'ФГИС «ВетИС» • Аттестован',
        rating: doctor.rating,
        callsCount: doctor.callsCount,
      },
      address: {
        district: 'Петроградский',
        street: 'Большой проспект П.С.',
        house: '58',
        entrance: '2',
        floor: '4',
        apartment: '24',
        intercomCode: '24К',
        barrierNotes: 'Парадная 2, во дворе, код 24К',
        fullAddressText: 'г. Санкт-Петербург, Большой проспект П.С., д. 58, кв. 24',
      },
      restraintProtocol: {
        temperamentNotes: 'Беспокойное состояние, повышенная температура',
        softMuzzleRequired: true,
        leashRequired: true,
        otherAnimalsIsolated: true,
        isVetPassportPrepared: isBiosecurityChecked,
      },
      anamnesis: {
        chiefComplaint: 'Острый гастроэнтерит, рвота, вялость',
        clinicalPurpose: 'Неотложный клинический осмотр, термометрия, стабилизация состояния',
        symptomsNotes: 'Рвота 2 раза с утра, отказ от корма, гипертермия',
        highPriorityTemperature: '39.4°C',
      },
      pricing: {
        basePriceRubles: 3500,
        discountRubles: 0,
        finalHoldRubles: 3500,
        tariffLabel: 'Неотложный вызов вет-бригады',
      },
      payment: {
        cardMask: '4412',
        bankName: 'ПАО Сбербанк',
        yooKassaHoldId: `yk_hold_${Math.random().toString(36).substring(2, 10)}`,
        status: 'HOLD_AUTHORIZED',
      },
    };

    const res = await repo.createBooking(newOrder);
    if (res.success) {
      setCreatedOrder(res.data as UrgentBookingOrder);
    }
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
      {/* 1. STICKY HEADER & STEP TRACKER                          */}
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
                ШАГ 3 ИЗ 3
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
      <div className="bg-blue-50/90 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-[10px] font-extrabold text-blue-900 tracking-wide truncate">
            СРОЧНЫЙ ВЫЕЗД ВЕТВРАЧА • Петроградский р-н • Закон РФ № 4979-1
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* 2. SELECTED DOCTOR CARD                                   */}
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
                <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {doctor.name}
                </h2>
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
                    {doctor.vetIsLicense ?? 'ФГИС «ВетИС» • Аттестован'}
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

          {/* Mobile Unit Specs & ETA */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2 text-xs text-slate-700">
            <Car className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="min-w-0 text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-900">
                {doctor.vehicle ?? 'VW Tiguan ВетНеотложка (вет-лаборатория, концентратор)'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PATIENT & CLINICAL ANAMNESIS CARD                     */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Пациент и анамнез</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Чип: #{chipNumber}
            </span>
          </div>

          {/* Patient Row with Urgent Temp Alert */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-black text-slate-900 truncate">
                {petName} ({petBreed}, {petAge}, {petWeight})
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-700 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>Срочный экстренный выезд • Окно прибытия ~15–20 мин</span>
              </div>
            </div>

            {/* Temperature Pill */}
            <div className="shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-xs">
              <Thermometer className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>T 39.4°C</span>
            </div>
          </div>

          {/* Reason for Call Callout */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Причина срочного вызова:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90 pl-5">
              Подозрение на острый гастроэнтерит / инородное тело: вялость, рвота пеной, отказ от корма и воды. Высокая температура.
            </p>
          </div>

          {/* Biosecurity Directive Checkbox */}
          <button
            type="button"
            onClick={() => setIsBiosecurityChecked(!isBiosecurityChecked)}
            className="w-full text-left flex items-start space-x-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div
              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                isBiosecurityChecked
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-300 bg-white'
              }`}
            >
              {isBiosecurityChecked && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-[11px] text-slate-700 leading-tight">
              Подготовить ветеринарный паспорт с отметками о вакцинации от бешенства (Nobivac Rabies / ВетИС)
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 4. ARRIVAL ADDRESS & RESTRAINT PROTOCOL CARD             */}
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

            {/* Restraint Directives */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 leading-relaxed space-y-1">
              <div className="font-bold text-slate-900">
                Фиксация и зообезопасность (ст. 2.1 Закона РФ № 4979-1):
              </div>
              <p>
                Доброжелателен, но при боли беспокоен. Подготовлен мягкий намордник и поводок. Другие животные изолированы.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. FINANCIAL BREAKDOWN & YOOKASSA ESCROW GUARANTEE       */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Закон РФ № 4979-1 • Защита платежа</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              ХОЛДИРОВАНИЕ
            </span>
          </div>

          {/* Line Items */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Базовый очный выезд ветврача-терапевта:</span>
              <span className="font-semibold text-slate-900">
                {doctor.priceRubles.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Базовый осмотр, термометрия, чип-сканирование:</span>
              <span className="font-semibold text-emerald-600">Включено</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Сервисный сбор платформы:</span>
              <span className="font-semibold text-slate-500">0 ₽ (0%)</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-slate-800 text-xs">Итого к холдированию:</span>
              <span className="text-xl font-black text-slate-900">
                {doctor.priceRubles.toLocaleString('ru-RU')} ₽
              </span>
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

          {/* Escrow Reassurance Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-start space-x-2.5 text-[11px] text-emerald-950 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              🛡️ Деньги НЕ списываются сразу. Сумма {doctor.priceRubles.toLocaleString('ru-RU')} ₽ замораживается на вашей карте и будет переведена клинике только после очного осмотра, сканирования чипа и подписания протокола в приложении.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. STICKY ACTION BAR & LEGAL FOOTNOTE                    */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAuthorizeHold}
            className="w-full h-12 px-5 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.99]"
          >
            <span>Зарезервировать {doctor.priceRubles.toLocaleString('ru-RU')} ₽ и вызвать ветврача</span>
            <span className="text-base font-extrabold">→</span>
          </button>

          <p className="text-[10px] text-slate-500 leading-relaxed text-center px-1">
            Нажимая кнопку, вы подтверждаете согласие с условиями публичной оферты и регламентом ветеринарной помощи (Закон РФ № 4979-1, 152-ФЗ). Электронный чек (54-ФЗ) и протокол ФГИС «ВетИС» (Меркурий/Хорриот) поступят на e-mail.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. YOOKASSA HOLD SUCCESS MODAL                           */}
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
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">
                ЮKassa • Холдирование успешно
              </span>
              <h3 className="text-base font-black text-slate-900">
                Вызов ветврача подтвержден!
              </h3>
              <p className="text-xs text-slate-600">
                Заказ №RU-78/VET-2024-912 • ФГИС «Хорриот»
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Врач экипажа:</span>
                <span className="font-bold text-slate-900">{doctor.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Расчетное прибытие:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  ~15-20 минут
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Заморожено на карте:</span>
                <span className="font-bold text-slate-900">{doctor.priceRubles.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Статус выезда:</span>
                <span className="font-bold text-blue-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping inline-block" />
                  Экипаж выехал
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishBooking}
              className="w-full py-3 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98]"
            >
              Перейти к отслеживанию вызова →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
