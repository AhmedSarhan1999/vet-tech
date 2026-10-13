import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { VeterinaryChatsScreen } from '@/features/chat';
import {
  ArrowLeft,
  Share2,
  Download,
  ShieldCheck,
  FileText,
  Stethoscope,
  Activity,
  Clock,
  Pill,
  AlertTriangle,
  Heart,
  ExternalLink,
  PhoneCall,
  MessageSquare,
  Check,
  Lock,
  Sparkles,
  Utensils,
  Droplets,
  Award,
} from 'lucide-react';

export interface ClinicalProtocolData {
  readonly visitId?: string;
  readonly protocolNumber?: string;
  readonly vetIsNumber?: string;
  readonly dateText?: string;
  readonly timeText?: string;
  readonly doctor: {
    readonly name: string;
    readonly specialty: string;
    readonly almaMater: string;
    readonly experienceYears?: number;
    readonly vetIsLicense: string;
    readonly digitalSignatureVerified: boolean;
  };
  readonly patient: {
    readonly name: string;
    readonly speciesBreed: string;
    readonly ageGender: string;
    readonly verifiedWeightKg: number;
    readonly chipNumber: string;
    readonly passportSeriesNumber: string;
    readonly temperament?: string;
  };
  readonly diagnosis: {
    readonly code: string;
    readonly title: string;
    readonly rectalTemperature: string;
    readonly objectiveFindings: string;
    readonly prognosis: string;
  };
  readonly rapidTest: {
    readonly title: string;
    readonly result: 'NEGATIVE' | 'POSITIVE';
    readonly lotNumber: string;
    readonly expirationDate: string;
    readonly interpretation: string;
  };
  readonly smartSchedule: {
    readonly dayText: string;
    readonly medicationName: string;
    readonly activeSubstance: string;
    readonly dosageInstruction: string;
    readonly warningText: string;
    readonly totalDoses: number;
    readonly initialTakenDoses: number;
    readonly nextDoseTime: string;
    readonly remainingDays: number;
  };
  readonly dietAndCare: {
    readonly dietDirective: string;
    readonly sorbentDirective: string;
    readonly hydrationDirective: string;
  };
  readonly payment: {
    readonly orderRef: string;
    readonly totalRubles: number;
    readonly baseExamRubles: number;
    readonly rapidTestRubles: number;
    readonly cardMasked: string;
    readonly fiscalReceiptNumber: string;
  };
}

export interface ClinicalProtocolScreenProps {
  readonly onBack: () => void;
  readonly data?: ClinicalProtocolData;
  readonly onOpenChat?: () => void;
}

const DEFAULT_PROTOCOL_DATA: ClinicalProtocolData = {
  visitId: '#ВЕТ-491',
  protocolNumber: '#ВЕТ-491',
  vetIsNumber: '#78-9042',
  dateText: '12 окт 2026',
  timeText: '15:10',
  doctor: {
    name: 'Д-р Романов Дмитрий С.',
    specialty: 'Ветврач-терапевт, хирург',
    almaMater: 'СПбГУВМ (Стаж 11 лет)',
    experienceYears: 11,
    vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-4190',
    digitalSignatureVerified: true,
  },
  patient: {
    name: 'Норд',
    speciesBreed: 'Собака • Сибирский хаски',
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
    totalRubles: 4000,
    baseExamRubles: 2800,
    rapidTestRubles: 1200,
    cardMasked: 'МИР •••• 4412 (Сбербанк)',
    fiscalReceiptNumber: 'ФН #92810000411 (54-ФЗ)',
  },
};

export const ClinicalProtocolScreen: React.FC<ClinicalProtocolScreenProps> = ({
  onBack,
  data = DEFAULT_PROTOCOL_DATA,
  onOpenChat,
}) => {
  const { user } = useAuth();

  // Medication tracker state
  const [eveningDoseTaken, setEveningDoseTaken] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SBP Tipping state
  const [selectedTip, setSelectedTip] = useState<number | 'custom'>(500);
  const [customTipAmount, setCustomTipAmount] = useState<string>('700');
  const [tipSubmitted, setTipSubmitted] = useState<boolean>(false);

  // Active curatorship chat navigation state
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleEveningDose = () => {
    setEveningDoseTaken((prev) => {
      const next = !prev;
      if (next) {
        showToast('Вечерняя доза (1.5 таб. Синулокс) успешно отмечена в Ветпаспорте ✓');
      } else {
        showToast('Отметка о вечернем приеме отменена');
      }
      return next;
    });
  };

  const handleShareProtocol = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Ветеринарный протокол ${data.protocolNumber} (${data.patient.name})`,
          text: `Клинический протокол осмотра собаки ${data.patient.name}. Диагноз: ${data.diagnosis.title}. ФГИС «ВетИС» ${data.vetIsNumber}.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      showToast('Ссылка на официальный электронный протокол скопирована');
    }
  };

  const handleDownloadPdf = () => {
    showToast(`PDF-протокол ${data.protocolNumber} с электронной подписью УКЭП сформирован и сохранен`);
  };

  const handleSendTip = () => {
    const amount = selectedTip === 'custom' ? parseInt(customTipAmount, 10) || 500 : selectedTip;
    setTipSubmitted(true);
    showToast(`Чаевые ${amount} ₽ успешно переведены доктору по СБП! Спасибо за благодарность.`);
  };

  // User initials
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  const takenDosesCount = (data.smartSchedule.initialTakenDoses ?? 1) + (eveningDoseTaken ? 1 : 0);
  const totalDosesCount = data.smartSchedule.totalDoses || 14;
  const progressPercent = Math.min(100, Math.round((takenDosesCount / totalDosesCount) * 100));

  if (isChatActive) {
    return (
      <VeterinaryChatsScreen
        onBack={() => setIsChatActive(false)}
        initialChatId="nord-curatorship"
      />
    );
  }

  return (
    <div className="min-h-full pb-28 text-slate-900 bg-slate-50/60 font-sans">
      {/* ========================================================= */}
      {/* A. STICKY HEADER & DIGITAL DOCUMENT BANNER                */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к списку визитов"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                  Ветпротокол {data.protocolNumber}
                </h1>
              </div>
              <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                Ветеринарная служба 24/7 • Санкт-Петербург
              </p>
            </div>
          </div>

          {/* Quick Action Icons & User Avatar */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              title="Экспорт в PDF"
              aria-label="Экспорт протокола в PDF"
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShareProtocol}
              title="Поделиться протоколом"
              aria-label="Поделиться протоколом"
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ml-0.5">
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
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* DOCUMENT STATUS BADGE & REGULATORY RIBBON                 */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-emerald-700/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Протокол ветпомощи</span>
            </span>

            <span className="text-[10px] font-mono font-bold tracking-tight text-emerald-100 bg-black/20 px-2.5 py-1 rounded-xl">
              ВИЗИТ {data.visitId} • ЗАВЕРШЕН • ВЕТИС {data.vetIsNumber}
            </span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-black leading-tight text-white">
              Клинический протокол и смарт-план реабилитации
            </h2>
            <div className="mt-1 text-xs text-emerald-100 flex items-center space-x-1.5 flex-wrap">
              <span>Пациент: <strong>{data.patient.name}</strong> ({data.patient.speciesBreed})</span>
              <span>•</span>
              <span>Вес: <strong>{data.patient.verifiedWeightKg} кг</strong></span>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/50 flex items-center justify-between text-[11px] text-emerald-100 flex-wrap gap-1.5">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>ОСМОТР ЗАВЕРШЕН • {data.dateText}, {data.timeText}</span>
            </div>
            <span className="text-[10px] text-emerald-200">
              ФГИС «ВетИС» Хорриот • Закон РФ № 4979-1
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* B. ATTENDING DOCTOR & LEGAL SIGNATURE BLOCK               */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Лечащий ветеринарный врач
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>УКЭП подтверждена</span>
            </span>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="relative shrink-0">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-base flex items-center justify-center shadow-md">
                {data.doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  {data.doctor.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-snug mt-0.5">
                {data.doctor.specialty}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2 flex-wrap">
                <span className="font-semibold text-slate-700">{data.doctor.almaMater}</span>
                <span>•</span>
                <span className="text-blue-700 font-bold font-mono">{data.doctor.vetIsLicense}</span>
              </div>
            </div>
          </div>

          {/* Rosselkhoznadzor Legal Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5 text-[11px]">
              <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Сертификация Россельхознадзора:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 pl-5">
              Аттестован Россельхознадзором. Протокол заверен усиленной квалифицированной электронной подписью (УКЭП) врача и выгружен в ВетИС (Хорриот).
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* C. PATIENT DATA & EXAM VITALS SUMMARY                     */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Паспортные данные и статус осмотра
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
              {data.patient.passportSeriesNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Кличка и порода</span>
              <div className="font-extrabold text-slate-900">{data.patient.name}</div>
              <div className="text-[11px] text-slate-600">{data.patient.speciesBreed}</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Возраст и вес</span>
              <div className="font-extrabold text-slate-900">{data.patient.verifiedWeightKg} кг</div>
              <div className="text-[11px] text-slate-600">{data.patient.ageGender}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
            <span className="text-slate-500 font-medium">Микрочип ISO 11784:</span>
            <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              #{data.patient.chipNumber}
            </span>
          </div>

          {/* Temperament Note */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider block">
              Поведение при осмотре:
            </span>
            <p className="text-[11px] leading-relaxed text-amber-900">
              {data.patient.temperament}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* D. CLINICAL DIAGNOSIS & RAPID TEST RESULTS                */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1.5">
              <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Клинический диагноз
              </span>
            </div>
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {data.diagnosis.code}
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {data.diagnosis.title}
            </h3>
            <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Ректальная температура:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {data.diagnosis.rectalTemperature}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed border-t border-slate-200/60 pt-2">
                <strong className="text-slate-900">Объективный статус:</strong> {data.diagnosis.objectiveFindings}
              </p>
            </div>
          </div>

          {/* Bedside Rapid Test Result Box (Soft Amber/Orange) */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <div className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-black text-amber-950">
                  {data.rapidTest.title}
                </span>
              </div>
              <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                ОТРИЦАТЕЛЬНО (-)
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-amber-900">
              {data.rapidTest.interpretation}
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-amber-800 pt-1 border-t border-amber-200">
              <span>Серия: {data.rapidTest.lotNumber}</span>
              <span>Годен до: {data.rapidTest.expirationDate}</span>
              <span className="font-sans font-bold text-emerald-700">✓ Валидировано</span>
            </div>
          </div>

          {/* Prognosis Callout */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="font-extrabold text-emerald-900 flex items-center space-x-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Клинический прогноз:</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed pl-5">
              {data.diagnosis.prognosis}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* E. SMART MEDICATION ADMINISTRATION TRACKER                */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-1.5">
              <Pill className="w-4 h-4 text-blue-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Смарт-график приема медикаментов
              </h2>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {data.smartSchedule.dayText}
            </span>
          </div>

          {/* Prescribed Drug Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  {data.smartSchedule.medicationName}
                </h3>
                <p className="text-[11px] text-blue-900/80 mt-0.5">
                  {data.smartSchedule.activeSubstance}
                </p>
              </div>
              <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                Rx Рецепт
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-blue-100 space-y-1 text-[11px] text-slate-800">
              <strong className="text-blue-950 block">Точная дозировка:</strong>
              <p className="leading-relaxed text-slate-700">
                {data.smartSchedule.dosageInstruction}
              </p>
            </div>

            {/* Strict Antibiotic Warning Box */}
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-950 text-[11px] leading-relaxed flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p>
                <strong>Внимание:</strong> {data.smartSchedule.warningText}
              </p>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>Прогресс курса: {takenDosesCount} из {totalDosesCount} приемов ({progressPercent}%)</span>
                <span className="text-blue-700">
                  {eveningDoseTaken ? 'Норма за день выполнена ✓' : `След. прием в ${data.smartSchedule.nextDoseTime}`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                Осталось {data.smartSchedule.remainingDays} дней курса
              </p>
            </div>
          </div>

          {/* Daily Schedule List */}
          <div className="space-y-2 pt-1 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
              Расписание на сегодня:
            </span>

            {/* Morning Dose (Completed) */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Утренний прием • 08:30 (1.5 таб.)
                  </div>
                  <div className="text-[10px] text-emerald-800 font-medium">
                    ✓ Принято в 08:35 • Фиксация в веткарте
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Выполнено
              </span>
            </div>

            {/* Evening Dose (Interactive Window) */}
            <div className={`p-3 rounded-2xl border transition-all ${
              eveningDoseTaken
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-white border-blue-300 shadow-sm'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    eveningDoseTaken ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white animate-pulse'
                  }`}>
                    {eveningDoseTaken ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Вечерний прием • {data.smartSchedule.nextDoseTime} (1.5 таб.)
                    </div>
                    <div className={`text-[10px] font-medium ${
                      eveningDoseTaken ? 'text-emerald-800' : 'text-blue-700'
                    }`}>
                      {eveningDoseTaken
                        ? '✓ Отмечено в приложении владельцем'
                        : 'ОКНО ПРИЕМА • После вечернего кормления'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleEveningDose}
                  className={`py-2 px-3.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer ${
                    eveningDoseTaken
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {eveningDoseTaken ? 'Отменить отметку' : '✓ Отметить прием (1.5 таб.)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* F. VETERINARY DIET & SUPPORTIVE CARE PROTOCOLS            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Диета и поддерживающая терапия
            </h2>
            <span className="text-[10px] font-bold text-slate-500">
              3 ключевых регламента
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Diet Directive */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-slate-900">1. Лечебное питание (Gastrointestinal):</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed pl-5">
                {data.dietAndCare.dietDirective}
              </p>
            </div>

            {/* Sorbent Directive */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-slate-900">2. Сорбент (Энтеросгель ветеринарный):</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed pl-5">
                {data.dietAndCare.sorbentDirective}
              </p>
            </div>

            {/* Hydration Directive */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="text-slate-900">3. Питьевой режим и гидратация:</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed pl-5">
                {data.dietAndCare.hydrationDirective}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* G. FISCAL SETTLEMENT, ESCROW CAPTURE & SBP TIPPING        */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Финансовый расчет и чек (54-ФЗ)
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Оплачено • ВетЭскроу</span>
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Первичный вызов и клинический осмотр на дому:</span>
              <span className="font-bold text-slate-900">{data.payment.baseExamRubles.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Экспресс-тест на антигены (CPV/CCV Ag):</span>
              <span className="font-bold text-slate-900">+{data.payment.rapidTestRubles.toLocaleString('ru-RU')} ₽</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-slate-900 block">
                  Итого списано: {data.payment.totalRubles.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-[10px] text-slate-500">
                  {data.payment.cardMasked}
                </span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Электронный фискальный чек ${data.payment.fiscalReceiptNumber} открыт`)}
                className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
              >
                <span>Чек 54-ФЗ</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* DOCTOR TIPPING MODULE (SBP) */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-black text-slate-900">
                    Поблагодарить доктора
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  100% суммы поступит напрямую доктору по СБП (без комиссии клиники)
                </p>
              </div>

              {/* SBP Emblem */}
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black text-slate-800 tracking-tight ml-0.5">СБП</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[300, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedTip(amount);
                    setTipSubmitted(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedTip === amount
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                  }`}
                >
                  +{amount} ₽
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setSelectedTip('custom');
                  setTipSubmitted(false);
                }}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedTip === 'custom'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                }`}
              >
                Другая
              </button>
            </div>

            {selectedTip === 'custom' && (
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={customTipAmount}
                  onChange={(e) => setCustomTipAmount(e.target.value)}
                  placeholder="Сумма в ₽"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                />
                <span className="text-xs font-bold text-slate-500">₽</span>
              </div>
            )}

            {/* SBP Action Button */}
            <button
              type="button"
              onClick={handleSendTip}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-[0.99] ${
                tipSubmitted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {tipSubmitted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Чаевые отправлены ✓ Спасибо!</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>
                    Отправить {selectedTip === 'custom' ? customTipAmount || '500' : selectedTip} ₽ через СБП
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* H. CONTINUOUS CLINICAL FOLLOW-UP & DISPATCH FOOTER        */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-1">
          {/* Follow-up Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1">
            <div className="font-extrabold text-blue-900 flex items-center space-x-1.5 text-xs">
              <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Клиническое сопровождение Норда</span>
            </div>
            <p className="text-[11px] text-blue-900/90 pl-5">
              Дежурный ветврач клиники на связи до 22:00. При усилении симптомов или отказе от воды свяжитесь с врачом немедленно.
            </p>
          </div>

          {/* Interactive Action Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:+78124201503"
              className="py-3 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors text-center shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-slate-600" />
              <span>Позвонить врачу</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat();
                } else {
                  setIsChatActive(true);
                }
              }}
              className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Чат с ветврачом</span>
            </button>
          </div>

          {/* Dispatch Footer */}
          <div className="text-center pt-2 space-y-1">
            <a
              href="tel:+78124201503"
              className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Круглосуточный диспетчерский пульт СПб: 8 (812) 420-15-03</span>
            </a>
            <p className="text-[10px] text-slate-400">
              Закон РФ № 4979-1 «О ветеринарии» • ФГИС «ВетИС» (Хорриот) • 152-ФЗ
            </p>
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
