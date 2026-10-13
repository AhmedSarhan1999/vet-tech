import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ActiveExaminationScreen } from './ActiveExaminationScreen';
import {
  ArrowLeft,
  PhoneCall,
  ShieldCheck,
  Copy,
  Volume2,
  Lock,
  Car,
  Key,
  Check,
  MapPin,
  Info,
  CheckSquare,
  Square,
  Activity,
} from 'lucide-react';

export interface ArrivalHandshakeScreenProps {
  readonly onBack: () => void;
  readonly pinCode?: string;
  readonly doctorName?: string;
  readonly doctorTitle?: string;
  readonly vehiclePlate?: string;
  readonly petName?: string;
  readonly addressText?: string;
  readonly onStartExamination?: () => void;
}

export const ArrivalHandshakeScreen: React.FC<ArrivalHandshakeScreenProps> = ({
  onBack,
  pinCode = '4819',
  doctorName = 'Д-р Романов К. В.',
  doctorTitle = 'Ветврач-терапевт, хирург • Стаж 11 лет',
  vehiclePlate = 'Е 742 ТХ 198',
  petName = 'Норд',
  addressText = 'г. Санкт-Петербург, ул. Ленина, д. 28',
  onStartExamination,
}) => {
  const { user } = useAuth();

  // Internal Active Examination view state
  const [isExamActive, setIsExamActive] = useState<boolean>(false);

  // Split pin code into 4 digits
  const pinDigits = pinCode.padEnd(4, '0').slice(0, 4).split('');

  const [copied, setCopied] = useState<boolean>(false);
  const [isIntercomOpening, setIsIntercomOpening] = useState<boolean>(false);
  const [intercomOpened, setIntercomOpened] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 3 of 3 checklist items
  const [checklist, setChecklist] = useState<{
    item1: boolean;
    item2: boolean;
    item3: boolean;
  }>({
    item1: true,
    item2: true,
    item3: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(pinCode).catch(() => {});
    setCopied(true);
    showToast(`Код ${pinCode} скопирован в буфер обмена`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeakPin = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Код приема: 4, 8, 1, 9');
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    }
    showToast('Озвучивание кода: Четыре — Восемь — Один — Девять');
  };

  const handleOpenIntercom = () => {
    setIsIntercomOpening(true);
    setTimeout(() => {
      setIsIntercomOpening(false);
      setIntercomOpened(true);
      showToast('Сигнал на открытие парадной отправлен в систему «Умный Дом СПб»');
    }, 1000);
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

  const completedCount = [checklist.item1, checklist.item2, checklist.item3].filter(Boolean).length;

  const handleStartExam = () => {
    if (onStartExamination) {
      onStartExamination();
    } else {
      setIsExamActive(true);
    }
  };

  // Mount ActiveExaminationScreen when exam is initiated
  if (isExamActive) {
    return (
      <ActiveExaminationScreen
        onBack={() => setIsExamActive(false)}
        doctorName={doctorName}
        doctorTitle={doctorTitle}
        petName={petName}
        addressText={addressText}
      />
    );
  }

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* A. STICKY HEADER & STATUS RIBBON                          */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к списку записей"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                Записи и вызовы
              </h1>
              <div className="flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-bold text-emerald-800 truncate">
                  СПб ВетСлужба 24/7 • ФГИС «ВетИС» (Хорриот)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & User Avatar */}
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href="tel:+78124201503"
              aria-label="Связаться с диспетчером"
              className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
            </a>

            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
        {/* B. LIVE CREW ARRIVAL BANNER                               */}
        {/* ========================================================= */}
        <div className="bg-emerald-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-emerald-600/20 space-y-3 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                    ЭКИПАЖ ПРИБЫЛ
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-black leading-tight mt-0.5">
                  Ветеринарный экипаж у парадной • Звонок в домофон
                </h2>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/60 flex items-center justify-between text-xs text-emerald-100 flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
              <span>{addressText}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px]">
              Врач прибыл • Подготовка укладки у входа
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* C. CLINICAL HANDSHAKE 4-DIGIT PIN CODE CONTAINER          */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-blue-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Код подтверждения начала приема
              </h2>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              ВетИС • 152-ФЗ
            </span>
          </div>

          {/* 4 Oversized Numeric Digit Boxes */}
          <div className="space-y-1.5 text-center">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-xs mx-auto">
              {pinDigits.map((digit, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="h-16 rounded-2xl bg-slate-50 border-2 border-blue-600/60 shadow-xs flex items-center justify-center text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tighter">
                    {digit}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    PIN {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Notice Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs leading-relaxed space-y-1">
            <div className="font-extrabold text-blue-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Правило клинического хэндшейка:</span>
            </div>
            <p className="text-[11px] text-blue-900/90 pl-5">
              Назовите этот 4-значный код ветеринарному врачу при входе. Только после ввода кода врачом в клиническом приложении начнется официальный прием, активируется договор эскроу и запустится таймер осмотра.
            </p>
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyPin}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-blue-600 hover:bg-slate-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Скопировать код {pinCode}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSpeakPin}
              className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
            >
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span>Озвучить код</span>
            </button>
          </div>

          {/* Primary Action: Transition to Active Clinical Examination */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartExam}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-[0.99] group cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform shrink-0" />
              <span>Начать клинический осмотр (Тест/Ввод PIN) →</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
              Инициализация осмотра у постели пациента • Экран назначения процедур и информированного согласия
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* D. DOCTOR IDENTIFICATION & REMOTE ACCESS CONTROLS         */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Идентификация врача
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              СПбГУВМ • Россельхознадзор
            </span>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
              {doctorName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                {doctorName}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
                {doctorTitle}
              </p>
              <div className="text-[11px] text-slate-600 mt-1 flex items-center space-x-1.5">
                <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-800">Renault Duster (ВетСлужба)</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                  {vehiclePlate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
            Экипаж укомплектован: сертифицированный термобокс (+2..+8°C) для вакцин Nobivac, чип-сканер ISO 11784, реанимационный набор.
          </div>

          {/* Tactile Interactive Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={isIntercomOpening}
              onClick={handleOpenIntercom}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.99] ${
                intercomOpened
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Key className="w-4 h-4 shrink-0" />
              <span>
                {isIntercomOpening
                  ? 'Открытие домофона...'
                  : intercomOpened
                  ? 'Домофон открыт ✓'
                  : 'Открыть домофон из приложения'}
              </span>
            </button>

            <a
              href="tel:+78124201503"
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Позвонить ветврачу (MTS Exolve)</span>
            </a>
            <p className="text-[10px] text-slate-400 text-center leading-tight">
              Защищенный подменный номер • Без передачи персональных данных (152-ФЗ)
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* E. PET PREPARATION & BIOSECURITY CHECKLIST                */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Подготовка питомца и зообезопасность
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              {completedCount} из 3 готово
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Checklist Item 1 */}
            <button
              type="button"
              onClick={() => setChecklist((prev) => ({ ...prev, item1: !prev.item1 }))}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-start space-x-2.5"
            >
              <span className="mt-0.5 shrink-0 text-blue-600">
                {checklist.item1 ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-snug">
                  1. Фиксация пациента: Хаски {petName}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  3 года, кобель, 28.4 кг, чип ISO 643098100234567. Стресс на чужих: надет мягкий нейлоновый намордник и поводок.
                </p>
              </div>
            </button>

            {/* Checklist Item 2 */}
            <button
              type="button"
              onClick={() => setChecklist((prev) => ({ ...prev, item2: !prev.item2 }))}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-start space-x-2.5"
            >
              <span className="mt-0.5 shrink-0 text-blue-600">
                {checklist.item2 ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-snug">
                  2. Зона клинического осмотра
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Подготовлен чистый стол/пол с одноразовой впитывающей пеленкой, достаточное освещение, миска со свежей водой.
                </p>
              </div>
            </button>

            {/* Checklist Item 3 */}
            <button
              type="button"
              onClick={() => setChecklist((prev) => ({ ...prev, item3: !prev.item3 }))}
              className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-start space-x-2.5"
            >
              <span className="mt-0.5 shrink-0 text-blue-600">
                {checklist.item3 ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-snug">
                  3. Ветпаспорт и вакцинация
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Международный ветеринарный паспорт с отметками Nobivac DHPPi+L подготовлен у входа.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* F. PRIVACY DISCLAIMER & DISPATCH HOTLINE                  */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-800">Конфиденциальность локации:</strong> Согласно ст. 70 Федерального закона № 323-ФЗ и регламенту Управления ветеринарии СПб, трансляция GPS-координат прекращается при прибытии по адресу для защиты приватности жилого помещения.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs space-y-1">
            <div className="font-extrabold text-emerald-900 flex items-center justify-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Эскроу-депозит 2 800 ₽ активен</span>
            </div>
            <p className="text-[10px] text-emerald-800">
              Средства будут списаны только после завершения осмотра и подписания протокола в приложении.
            </p>
          </div>

          <div className="text-center pt-2 space-y-1">
            <a
              href="tel:+78124201503"
              className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Круглосуточный диспетчерский пульт СПб: 8 (812) 420-15-03</span>
            </a>
            <p className="text-[10px] text-slate-400">
              Закон РФ № 4979-1 «О ветеринарии» • 152-ФЗ
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
