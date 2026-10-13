import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BookingRepository } from '@/dal/booking.repository';
import { ClinicalProtocolScreen } from '@/features/history';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Clock,
  FlaskConical,
  Info,
  Stethoscope,
  Syringe,
  CheckSquare,
  Square,
  CreditCard,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

export interface ActiveExaminationScreenProps {
  readonly onBack: () => void;
  readonly workOrderNumber?: string;
  readonly doctorName?: string;
  readonly doctorTitle?: string;
  readonly petName?: string;
  readonly petBreed?: string;
  readonly addressText?: string;
  readonly bookingRepo?: BookingRepository;
  readonly onCompleteExamination?: () => void;
}

export const ActiveExaminationScreen: React.FC<ActiveExaminationScreenProps> = ({
  onBack,
  workOrderNumber = 'ВЕТ-7841',
  doctorName = 'Д-р Романов Дмитрий С.',
  doctorTitle = 'Ветврач-терапевт, хирург • СПбГУВМ (Стаж 9 лет)',
  petName = 'Норд',
  petBreed = 'Сибирский хаски',
  addressText = 'г. Санкт-Петербург, ул. Ленина, д. 28, кв. 42 (Петроградский р-н)',
  bookingRepo: _bookingRepo,
  onCompleteExamination,
}) => {
  const { user } = useAuth();

  // State management for bedside prescription
  const [procedureStatus, setProcedureStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isConsentChecked, setIsConsentChecked] = useState<boolean>(true);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const basePriceRubles = 2800;
  const testPriceRubles = 1400;
  const currentTotalRubles = procedureStatus === 'rejected' ? basePriceRubles : basePriceRubles + testPriceRubles;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveProcedure = () => {
    if (!isConsentChecked) {
      showToast('Необходимо подтвердить информированное согласие владельца.');
      return;
    }
    setProcedureStatus('approved');
    showToast('Назначение одобрено! Экспресс-тест CPV/CCV Ag добавлен. Эскроу-холд обновлен до 4 200 ₽.');
  };

  const handleRejectProcedure = () => {
    setProcedureStatus('rejected');
    showToast('Назначение отклонено. Врач продолжает базовый терапевтический осмотр (2 800 ₽).');
  };

  // Navigation state for completed clinical protocol view
  const [isProtocolOpen, setIsProtocolOpen] = useState<boolean>(false);

  const handleCompleteExamination = () => {
    if (onCompleteExamination) {
      onCompleteExamination();
    } else {
      setIsProtocolOpen(true);
    }
  };

  // User initials
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'АВ';

  if (isProtocolOpen) {
    return (
      <ClinicalProtocolScreen
        onBack={() => setIsProtocolOpen(false)}
        data={{
          visitId: `#${workOrderNumber}`,
          protocolNumber: '#ВЕТ-491',
          vetIsNumber: '#78-9042',
          dateText: '12 окт 2026',
          timeText: '15:10',
          doctor: {
            name: doctorName,
            specialty: doctorTitle,
            almaMater: 'СПбГУВМ (Стаж 11 лет)',
            experienceYears: 11,
            vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-4190',
            digitalSignatureVerified: true,
          },
          patient: {
            name: petName,
            speciesBreed: `Собака • ${petBreed}`,
            ageGender: 'Кобель, 3 года',
            verifiedWeightKg: 28.4,
            chipNumber: '643098100234567',
            passportSeriesNumber: 'ВЕТ-491 (СПб)',
            temperament: 'Спокойный при хозяине (стрессует при манипуляциях, осмотрен без седации)',
          },
          diagnosis: {
            code: 'МКБ-ВЕТ K52.9',
            title: 'Острый алиментарный гастроэнтерит',
            rectalTemperature: '38.6°C (Норма)',
            objectiveFindings: 'Умеренная болезненность в эпигастральной области при глубокой пальпации. Брюшная стенка мягкая, без признаков перитонита. Дегидратация легкой степени (<5%). Слизистые бледно-розовые, СНК 1.5 сек.',
            prognosis: 'Благоприятный терапевтический прогноз при строгом соблюдении схемы антибиотикотерапии и гастроинтестинальной диеты. Купирование симптомов ожидается в течение 24–48 часов.',
          },
          rapidTest: {
            title: 'Экспресс-тест Ag Parvovirus / Coronavirus: ОТРИЦАТЕЛЬНЫЙ (-)',
            result: 'NEGATIVE',
            lotNumber: '#VET-8831',
            expirationDate: '09/2026',
            interpretation: 'Проведено у постели пациента. Тест-система лот: #VET-8831 (годен до: 09/2026). Парвовирусный и коронавирусный энтериты собак исключены.',
          },
          smartSchedule: {
            dayText: 'ДЕНЬ 1 ИЗ 7',
            medicationName: 'Синулокс 250 мг',
            activeSubstance: 'Амоксициллин + клавулановая кислота (жевательные таблетки)',
            dosageInstruction: '1.5 таблетки (355 мг) строго рассчитано на вес 28.4 кг, 2 раза в день после кормления (с интервалом 12 часов).',
            warningText: 'Курс 7 дней строго: не прерывать досрочно даже при прекращении диареи и рвоты во избежание рецидива и антибиотикорезистентности.',
            totalDoses: 14,
            initialTakenDoses: 1,
            nextDoseTime: '20:30',
            remainingDays: 6,
          },
          dietAndCare: {
            dietDirective: 'Гастроинтестинальная диета (Gastrointestinal: Royal Canin / Pro Plan EN). Дробное кормление 4 раза в сутки порциями по 90–100 г. Строго исключить лакомства, жирное, кости и домашнюю пищу со стола на 14 дней.',
            sorbentDirective: 'Энтеросгель ветеринарный: 15 г пасты развести в 30 мл теплой воды, выпаивать шприцем без иглы за 1.5 часа до кормления или приема Синулокса, 3 раза в сутки в течение 3 дней.',
            hydrationDirective: 'Постоянный доступ к свежей фильтрованной воде комнатной температуры. Контролировать тургор кожной складки на холке и влажность слизистых десен.',
          },
          payment: {
            orderRef: '#ВЕТ-ОПЛ-491',
            totalRubles: procedureStatus === 'rejected' ? 2800 : 4000,
            baseExamRubles: 2800,
            rapidTestRubles: procedureStatus === 'rejected' ? 0 : 1200,
            cardMasked: 'МИР •••• 4412 (Сбербанк)',
            fiscalReceiptNumber: 'ФН #92810000411 (54-ФЗ)',
          },
        }}
      />
    );
  }

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* A. STICKY TOP BAR & ACTIVE EXAMINATION RIBBON             */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к вызову"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                ВетПомощь на дому
              </h1>
              <div className="flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                <span className="text-[10px] font-bold text-indigo-800 truncate">
                  ФГИС «ВетИС» (Хорриот) • СПб ВетСлужба 24/7
                </span>
              </div>
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

        {/* High-visibility Status Pill in Soft Indigo */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-black tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>ОСМОТР АКТИВЕН • У ПОСТЕЛИ ПАЦИЕНТА</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            Наряд #{workOrderNumber}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* B. ACTIVE ORDER & PATIENT OVERVIEW CARD                   */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                ОСМОТР АКТИВЕН
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
              Наряд #{workOrderNumber}
            </span>
          </div>

          {/* Attending Doctor Profile */}
          <div className="flex items-start space-x-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                РД
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold text-slate-900 leading-tight">
                {doctorName}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5 truncate">
                {doctorTitle}
              </p>
              <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-600">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 text-[10px]">
                  ФГИС «ВетИС» (Хорриот) • Аттестован
                </span>
              </div>
            </div>
          </div>

          {/* Patient Capsule */}
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-black text-slate-900 text-sm">
                  {petBreed} {petName}
                </span>
                <span className="text-slate-600 font-medium block text-[11px]">
                  3 года • кобель (кастрирован) • 28.4 кг
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                Ветпаспорт #ВЕТ-491 (СПб)
              </span>
            </div>
            <div className="font-mono text-[10px] text-slate-500 pt-1 border-t border-blue-100/80">
              Микрочип ISO 643098100234567 • Внесен в систему «Хорриот»
            </div>
          </div>

          {/* Biosecurity Restraint Warning Alert (Soft Peach / Orange Container) */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Стрессует / Требуется фиксация владельцем (намордник надет)</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed pl-5.5">
              Владелец удерживает питомца в положении лежа на боку во время пальпации и забора биоматериалов согласно ст. 2.1 Закона РФ № 4979-1.
            </p>
          </div>

          {/* Arrival Address Line */}
          <div className="flex items-center space-x-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <span className="font-semibold text-slate-800">Адрес:</span>
            <span className="truncate">{addressText}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* C. BEDSIDE DYNAMIC PROCEDURE PRESCRIPTION CARD            */}
        {/* ========================================================= */}
        {procedureStatus !== 'rejected' ? (
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-indigo-200 shadow-sm space-y-4 animate-fadeIn">
            {/* Header: Prescription Tag and Fee */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black">
                <Syringe className="w-3.5 h-3.5" />
                <span>Назначение у постели животного</span>
              </div>
              <span className="text-sm font-black text-indigo-900 bg-indigo-100/70 px-3 py-1 rounded-xl border border-indigo-200">
                +1 400 ₽
              </span>
            </div>

            {/* Procedure Title */}
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                Экспресс-тест на антиген парвовируса и коронавируса собак (CPV/CCV Ag)
              </h2>
            </div>

            {/* Clinical Justification Quote Block */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-l-4 border-indigo-500 text-xs text-slate-700 space-y-1.5 leading-relaxed">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5 text-[11px]">
                <Stethoscope className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Клиническое обоснование ветеринарного врача:</span>
              </div>
              <blockquote className="italic text-[11px] text-slate-800 pl-5">
                «При клиническом осмотре выявлены: выраженная вялость, болезненность в эпигастральной области при пальпации, гиперемия слизистых оболочек и гипертермия (T 39.8°C). Для дифференциальной диагностики острого гастроэнтерита и исключения парвовирусного энтерита перед введением спазмолитиков и противорвотных препаратов строго показано иммунохроматографическое экспресс-тестирование.»
              </blockquote>
              <div className="text-[10px] text-slate-500 font-semibold pl-5 pt-0.5">
                — Д-р Романов Д. С., ведущий ветврач выездной службы
              </div>
            </div>

            {/* Regulatory & Speed Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-bold text-slate-700 leading-tight">
                  ФГИС «ВетИС» (Хорриот) • Партия #ВЕТ-7841 ✓
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-[10px] font-bold text-slate-700 leading-tight">
                  Экспресс-анализ на месте за 10 минут ⏱
                </span>
              </div>
            </div>

            {/* Sterile Packaging Quality Assurance Box */}
            <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start space-x-2.5 text-xs text-indigo-950">
              <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-indigo-900 text-xs">
                  Стерильный тест-набор готов к забору пробы
                </div>
                <p className="text-[10px] text-indigo-800 leading-relaxed mt-0.5">
                  Герметичный фольгированный блистер вскрывается исключительно в присутствии владельца животного.
                </p>
              </div>
            </div>

            {/* State when approved */}
            {procedureStatus === 'approved' && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center space-x-2 text-xs font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Статус: Одобрено владельцем • Забор биоматериала начат</span>
              </div>
            )}
          </div>
        ) : (
          /* Rejection Notice Box */
          <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 text-slate-700 space-y-1 text-xs animate-fadeIn">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Отказ от дополнительной экспресс-диагностики зафиксирован</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Врач продолжает базовый терапевтический осмотр и симптоматическую стабилизацию питомца без экспресс-тестирования CPV/CCV. Стоимость визита сохранена на базовом уровне (2 800 ₽).
            </p>
            <button
              type="button"
              onClick={() => setProcedureStatus('pending')}
              className="text-blue-600 font-bold hover:underline pt-1 block text-[11px]"
            >
              Вернуть назначение теста обратно
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* D. OWNER INFORMED CONSENT BLOCK                           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Информированное согласие владельца
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Закон РФ № 4979-1
            </span>
          </div>

          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Ветеринарно-санитарные правила • 152-ФЗ
          </p>

          {/* Interactive Checkbox Component */}
          <button
            type="button"
            onClick={() => setIsConsentChecked(!isConsentChecked)}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
              isConsentChecked
                ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/10'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="mt-0.5 shrink-0 text-blue-600">
              {isConsentChecked ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </span>
            <div className="min-w-0">
              <div className="font-extrabold text-xs text-slate-900 leading-snug">
                Согласие владельца животного (Куратора):
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed mt-1">
                «Я, Александр В., подтверждаю проведение экспресс-тестирования собаке (Норд, хаски, 3 года). Ветеринарный врач разъяснил цели, методику забора проб и тактику терапии в зависимости от результата.»
              </p>
            </div>
          </button>

          {/* Digital Audit Compliance Note */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
            <span>Цифровая фиксация • Запись в электронный ветпаспорт</span>
            <span className="font-mono font-bold text-blue-700">#ВЕТ-491-ИДС</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* E. UPDATED YOOKASSA ESCROW FINANCIAL SUMMARY             */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Безопасная сделка ЮKassa Эскроу</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              ХОЛДИРОВАНИЕ
            </span>
          </div>

          {/* Itemized Financial Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Базовый очный выезд и клинический осмотр на дому:</span>
              <span className="font-bold text-slate-900">
                {basePriceRubles.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            {procedureStatus !== 'rejected' && (
              <div className="flex justify-between items-center text-indigo-950 bg-indigo-50/70 p-2 rounded-xl border border-indigo-100">
                <div className="flex items-center space-x-1 min-w-0">
                  <span className="font-semibold text-[11px] truncate">
                    Экспресс-тест CPV/CCV Ag (по согласованию):
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="text-indigo-600 hover:text-indigo-800 shrink-0"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="font-black text-indigo-900 shrink-0">
                  +{testPriceRubles.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}

            {showTooltip && (
              <div className="p-2.5 rounded-xl bg-slate-100 text-[10px] text-slate-600 leading-relaxed border border-slate-200">
                Стоимость включает сертифицированный тест-набор CPV/CCV Ag, стерильный зонд для забора биоматериала, буферный реагент и регистрацию в ФГИС «ВетИС» (Хорриот).
              </div>
            )}

            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Сервисный сбор платформы:</span>
              <span>0 ₽ (0%)</span>
            </div>

            {/* Total Line */}
            <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
              <div>
                <span className="font-extrabold text-slate-900 text-xs block">
                  Итого к блокировке (эскроу-холд):
                </span>
                <span className="text-[10px] text-slate-400">
                  Списание только после завершения приема
                </span>
              </div>
              <span className="text-xl font-black text-slate-900">
                {currentTotalRubles.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Linked Payment Method */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-medium text-slate-800 truncate block">
                  МИР •••• 4412 (ПАО Сбербанк)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Основной способ оплаты
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Комиссия 0%
            </span>
          </div>

          {/* Escrow Protection Callout */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs leading-relaxed space-y-1">
            <div className="font-extrabold text-emerald-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Гарантия безопасности платежей ЮKassa (54-ФЗ):</span>
            </div>
            <p className="text-[11px] text-emerald-900/90 pl-5.5">
              Деньги НЕ списываются сразу. Сумма {currentTotalRubles.toLocaleString('ru-RU')} ₽ резервируется на номинальном эскроу-счете в банке и будет списана ТОЛЬКО после окончания визита и обоюдного подписания электронного протокола в приложении. Электронный чек (54-ФЗ) и ветеринарный сертификат ВСД (Меркурий) сформируются автоматически.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* F. DUAL-ACTION BUTTONS & LEGAL FOOTER                     */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          {procedureStatus === 'pending' ? (
            <>
              {/* Primary Action Button: Approve */}
              <button
                type="button"
                onClick={handleApproveProcedure}
                className="w-full py-4 px-5 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-between text-sm sm:text-base transition-all active:scale-[0.99]"
              >
                <span className="font-extrabold">
                  Одобрить и добавить к визиту (+1 400 ₽)
                </span>
                <span className="font-extrabold text-base">→</span>
              </button>

              {/* Secondary Action: Reject */}
              <button
                type="button"
                onClick={handleRejectProcedure}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Отклонить назначение (продолжить базовый осмотр без теста)
              </button>
            </>
          ) : procedureStatus === 'approved' ? (
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-black">
                    Назначение утверждено (4 200 ₽) • Забор биоматериала начат
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </div>

              <button
                type="button"
                onClick={handleCompleteExamination}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Завершить осмотр и открыть ветпротокол →</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-800 text-white flex items-center justify-between">
                <span className="text-xs font-bold">
                  Базовый осмотр активен (2 800 ₽) • Без экспресс-теста
                </span>
              </div>

              <button
                type="button"
                onClick={handleCompleteExamination}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Завершить осмотр и открыть ветпротокол →</span>
              </button>
            </div>
          )}

          {/* Legal Footer */}
          <div className="text-center pt-2 space-y-1">
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 font-medium">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>
                Защита персональных данных 152-ФЗ • ФГИС «ВетИС» (Хорриот / Меркурий) • Управление ветеринарии Санкт-Петербурга
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-slideUp">
          <div className="bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-slate-700 max-w-sm text-center">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
