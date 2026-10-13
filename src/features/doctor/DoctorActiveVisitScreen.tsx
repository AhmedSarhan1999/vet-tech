import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Plus,
  PhoneCall,
  RefreshCw,
  FileText,
  Check,
  KeyRound,
  X,
} from 'lucide-react';

export interface DoctorActiveVisitScreenProps {
  readonly onBack: () => void;
  readonly onCompleteVisit?: () => void;
  readonly onOpenProcedures?: (tab?: 'procedures' | 'medications') => void;
  readonly onProceedToReport?: () => void;
  readonly initialPhase?: VisitPhase;
  readonly onPhaseChange?: (phase: VisitPhase) => void;
  readonly pendingProcedureNotice?: string | null;
}

export type VisitPhase = 'HANDSHAKE_PIN' | 'IN_EXAM_MONITOR';

export const DoctorActiveVisitScreen: React.FC<DoctorActiveVisitScreenProps> = ({
  onBack,
  onCompleteVisit,
  onOpenProcedures,
  onProceedToReport,
  initialPhase = 'HANDSHAKE_PIN',
  onPhaseChange,
  pendingProcedureNotice,
}) => {
  const [phase, setPhase] = useState<VisitPhase>(initialPhase);

  // Sync with initialPhase prop if it changes
  useEffect(() => {
    if (initialPhase === 'IN_EXAM_MONITOR') {
      setPhase('IN_EXAM_MONITOR');
    }
  }, [initialPhase]);

  // PIN Handshake state
  const [pin, setPin] = useState<string[]>(['4', '8', '1', '9']);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(true);

  // Dead-Man timer state (in seconds, 11 min 39 sec = 699 sec)
  const [timerSeconds, setTimerSeconds] = useState<number>(699);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);

  // Disarm Modal state
  const [isDisarmModalOpen, setIsDisarmModalOpen] = useState<boolean>(false);
  const [disarmPin, setDisarmPin] = useState<string[]>(['1', '2', '3', '4']);
  const [disarmFeedback, setDisarmFeedback] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phase === 'IN_EXAM_MONITOR' && isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, isTimerActive, timerSeconds]);

  const handleStartExam = () => {
    setPhase('IN_EXAM_MONITOR');
    if (onPhaseChange) {
      onPhaseChange('IN_EXAM_MONITOR');
    }
  };

  const handleResetTimer = () => {
    setTimerSeconds(900); // 15:00
    setIsSosActive(false);
    setIsTimerActive(true);
  };

  const handleSos = () => {
    setIsSosActive(true);
    setIsTimerActive(false);
  };

  const handleConfirmDisarm = () => {
    const entered = disarmPin.join('');
    if (entered.length === 4) {
      setTimerSeconds(900); // Reset to 15:00
      setIsTimerActive(true);
      setIsSosActive(false);
      setDisarmFeedback('Защитный статус подтвержден. Таймер сброшен на 15:00.');
      setTimeout(() => {
        setIsDisarmModalOpen(false);
        setDisarmFeedback(null);
      }, 1200);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-slate-900 leading-tight">
                {phase === 'HANDSHAKE_PIN' ? 'Прибытие и Handshake PIN' : 'Клинический осмотр #ВЕТ-7041'}
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Петроградский р-н
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Пациент: Хаски Норд • Врач: Д-р Романов К. В.
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-mono font-bold text-xs">
          4979-1
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* PHASE 1: ARRIVAL VERIFICATION & PIN HANDSHAKE */}
        {phase === 'HANDSHAKE_PIN' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Geofence Active Pill */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/90 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                <span className="font-bold">±5m Geofence активен (Прибытие на адрес подтверждено)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">GPS lock</span>
            </div>

            {/* Target Address Card */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Адрес вызова бригады
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>г. Санкт-Петербург, ул. Ленина, д. 28, кв. 42</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Подъезд 2, этаж 4, домофон 42# • Куратор: Смирнов А. Н.
                  </p>
                </div>
              </div>

              {/* Temperament check */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-snug">
                  <strong>Протокол зообезопасности:</strong> Хаски Норд, волнение при термометрии. Мягкий намордник подготовлен владельцем.
                </div>
              </div>
            </div>

            {/* 4-Digit Handshake PIN Input (Screen 71991235bcf5451daf40202dd439f39a) */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-blue-200 space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">
                  Двусторонняя верификация контакта
                </span>
                <h3 className="text-base font-black text-slate-900 pt-1">
                  Введите 4-значный PIN-код владельца
                </h3>
                <p className="text-xs text-slate-500">
                  Клиент видит этот код на экране своего смартфона
                </p>
              </div>

              {/* 4 Distinct Individually Styled Digit Boxes with Indicator Underlines */}
              <div className="flex justify-center items-center space-x-3.5 py-3">
                {pin.map((digit, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-2">
                    <input
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newPin = [...pin];
                        newPin[idx] = e.target.value;
                        setPin(newPin);
                        setIsPinVerified(newPin.join('') === '4819');
                      }}
                      className="w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-2 border-blue-400 bg-blue-50/40 text-center font-mono font-black text-2xl text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-all"
                    />
                    <div
                      className={`w-8 h-1 rounded-full transition-all ${
                        digit ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Validation confirmation */}
              {isPinVerified && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1 text-left animate-fadeIn">
                  <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Код совпал: Взаимный контакт подтвержден</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-tight">
                    Холд средств ЮKassa активирован • Электронный чек 54-ФЗ сформирован в ОФД
                  </p>
                </div>
              )}

              {/* Pre-inspection safety checklist (3/3 Active) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Предвизитный чек-лист безопасности (3/3 активно):
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dead-Man's Switch: 15-минутный защитный таймер готов к запуску</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Сканер микрочипа RFID ISO 11784/85 подключен по Bluetooth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Маскирование домашних GPS-координат активно по 152-ФЗ РФ</span>
                  </div>
                </div>
              </div>

              {/* Primary action -> Transitions permanently to Phase 2 */}
              <button
                type="button"
                onClick={handleStartExam}
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>Начать клинический осмотр и чипирование →</span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: LIVE IN-EXAM MONITOR & CLINICIAN SAFETY */}
        {phase === 'IN_EXAM_MONITOR' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Patient Quick Card */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-slate-900">Хаски Норд (3 года, 28.4 кг)</h3>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      ВЕТ-7041
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Температура: <strong className="text-rose-600 font-mono">T 39.4°C</strong> • Подозрение на ларинготрахеит
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Холд ЮKassa активен
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Намордник надет владельцем. Фиксация стабильна.</span>
              </div>
            </div>

            {/* Luminous Dead-Man Safety Checkpoint (Restyled in Crisp Light Theme - ZERO DARK SLABS) */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Dead-Man Checkpoint (Защита ветперсонала)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Активен
                </span>
              </div>

              {/* Circular / Countdown Timer Graphic */}
              <div className="p-4 bg-gradient-to-b from-emerald-50/60 to-white rounded-2xl border border-emerald-200 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-emerald-500 bg-white shadow-xs">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                    <span className="text-2xl font-black font-mono text-slate-900 block tracking-tight">
                      {formatTimer(timerSeconds)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      До отметки
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Обязательное подтверждение безопасности врача каждые 15 минут.
                </p>
              </div>

              {/* Safety Action Buttons with Secondary "Ввести PIN отмены" */}
              <div className="space-y-2.5">
                {/* Large tactile green reset button */}
                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  <span>Я В БЕЗОПАСНОСТИ • СБРОСИТЬ (15 МИН)</span>
                </button>

                {/* Secondary Row: Emergency Panic + Cancel PIN Disarm Button */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSos}
                    className="py-3 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>SOS / ТРЕВОГА</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDisarmModalOpen(true)}
                    className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>Ввести PIN отмены</span>
                  </button>
                </div>
              </div>

              {isSosActive && (
                <div className="p-3 bg-rose-100 rounded-2xl border border-rose-300 text-xs text-rose-950 font-bold space-y-1 animate-fadeIn">
                  <div className="flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Сигнал тревоги передан дежурному диспетчеру СПб!</span>
                  </div>
                  <p className="text-[11px] font-normal leading-tight">
                    Координаты экипажа и экстренный аудиоканал переданы в службу оперативного реагирования.
                  </p>
                </div>
              )}
            </div>

            {/* In-Exam Medical Actions Card (Cleaned up per Sprint 0.24 directive) */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Клинические манипуляции визита
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  Приказ Минсельхоза № 161
                </span>
              </div>

              {/* Pending Procedure Notice Badge if Dispatched */}
              {pendingProcedureNotice && (
                <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200 text-xs text-blue-950 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold block">Запрос на манипуляцию отправлен владельцу</span>
                      <span className="text-[10px] text-blue-800">{pendingProcedureNotice}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    Push доставлен
                  </span>
                </div>
              )}

              {/* Verified RFID Chip status container */}
              <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Radio className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      RFID-сканер чипа ISO 11784/85
                    </span>
                    <span className="text-[10px] text-slate-500">Чип: 643094100294182 (Сверен и верифицирован)</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Верифицирован
                </span>
              </div>

              {/* Dual triggers: Manipulations / Diagnostics (Blue) & Bedside Medications (Emerald) */}
              {onOpenProcedures && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenProcedures('procedures')}
                    className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>+ Манипуляция / анализ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenProcedures('medications')}
                    className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>+ Препарат / медикамент</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary completion button -> Navigates to DoctorCreateReportScreen */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onProceedToReport || onCompleteVisit || onBack}
                className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Завершить осмотр и перейти к ветпротоколу →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dead-Man Safety Disarm Modal */}
      {isDisarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Снятие с охраны / PIN
                  </h3>
                  <p className="text-xs text-slate-500">
                    Персональный защитный код врача
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDisarmModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Введите 4-значный PIN безопасности ветврача для сброса тревожного таймера или подтверждения ложного срабатывания.
            </p>

            {/* 4 Digit Boxes for Disarm PIN */}
            <div className="flex justify-center space-x-3 py-2">
              {disarmPin.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...disarmPin];
                    next[idx] = e.target.value;
                    setDisarmPin(next);
                  }}
                  className="w-12 h-14 rounded-xl border-2 border-slate-300 text-center font-mono font-black text-xl text-slate-900 focus:outline-none focus:border-emerald-600 bg-slate-50"
                />
              ))}
            </div>

            {disarmFeedback && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold text-center">
                {disarmFeedback}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmDisarm}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-98"
              >
                Подтвердить безопасность и сбросить таймер (15:00)
              </button>

              <button
                type="button"
                onClick={() => setIsDisarmModalOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
