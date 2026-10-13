import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  Video,
  Coffee,
  CheckCircle2,
  ShieldCheck,
  Percent,
  Save,
  CreditCard,
  Sliders,
  AlertCircle,
} from 'lucide-react';

export interface DoctorShiftTariffScreenProps {
  readonly onBack: () => void;
}

interface DaySchedule {
  readonly id: string;
  readonly label: string;
  readonly full: string;
  active: boolean;
}

export const DoctorShiftTariffScreen: React.FC<DoctorShiftTariffScreenProps> = ({
  onBack,
}) => {
  const [days, setDays] = useState<DaySchedule[]>([
    { id: 'mon', label: 'Пн', full: 'Понедельник', active: true },
    { id: 'tue', label: 'Вт', full: 'Вторник', active: true },
    { id: 'wed', label: 'Ср', full: 'Среда', active: true },
    { id: 'thu', label: 'Чт', full: 'Четверг', active: true },
    { id: 'fri', label: 'Пт', full: 'Пятница', active: true },
    { id: 'sat', label: 'Сб', full: 'Суббота', active: false },
    { id: 'sun', label: 'Вс', full: 'Воскресенье', active: false },
  ]);

  const [shiftStart, setShiftStart] = useState<string>('09:00');
  const [shiftEnd, setShiftEnd] = useState<string>('21:00');

  // Channel splits
  const [inPersonStart, setInPersonStart] = useState<string>('10:00');
  const [inPersonEnd, setInPersonEnd] = useState<string>('18:00');
  const [telehealthStart, setTelehealthStart] = useState<string>('18:30');
  const [telehealthEnd, setTelehealthEnd] = useState<string>('21:00');
  const [breakStart, setBreakStart] = useState<string>('13:00');
  const [breakEnd, setBreakEnd] = useState<string>('14:00');

  // Tariffs
  const [priceInPerson, setPriceInPerson] = useState<number>(2800);
  const [priceEmergency, setPriceEmergency] = useState<number>(3500);
  const [priceVideoUrgent, setPriceVideoUrgent] = useState<number>(1200);
  const [priceVideoPlanned, setPriceVideoPlanned] = useState<number>(1500);

  // Settings
  const [autoSbpPayout, setAutoSbpPayout] = useState<boolean>(true);
  const [emergencyBufferActive, setEmergencyBufferActive] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleDay = (id: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3500);
  };

  // NPD 4% tax calculations
  const calculateNet = (price: number) => {
    const tax = Math.round(price * 0.04);
    const net = price - tax;
    return { tax, net };
  };

  const inPersonCalc = calculateNet(priceInPerson);
  const emergencyCalc = calculateNet(priceEmergency);
  const videoUrgentCalc = calculateNet(priceVideoUrgent);
  const videoPlannedCalc = calculateNet(priceVideoPlanned);

  const activeDaysCount = days.filter((d) => d.active).length;

  return (
    <div className="min-h-full pb-28 font-sans bg-slate-50/70">
      {/* Sticky Header */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Смена и базовые тарифы
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              График дежурств, каналы приёма и прейскурант 422-ФЗ
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          422-ФЗ НПД
        </span>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Success Toast */}
        {isSaved && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2.5 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="leading-snug">
                Настройки смены и тарифы успешно сохранены!
              </p>
              <p className="text-[10px] text-emerald-700 font-normal mt-0.5">
                Параметры доступности обновлены на радаре диспетчерской службы СПб.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Weekly Schedule & Shift Window */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Дни дежурства на неделе
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              {activeDaysCount} из 7 дней активно
            </span>
          </div>

          {/* Days buttons */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`py-3 px-1 rounded-2xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  day.active
                    ? 'bg-blue-600 text-white font-black shadow-xs ring-2 ring-blue-600/20'
                    : 'bg-slate-50 text-slate-400 font-semibold border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs">{day.label}</span>
                <span className="text-[9px] mt-0.5 opacity-80">
                  {day.active ? 'Вкл' : 'Вых'}
                </span>
              </button>
            ))}
          </div>

          {/* Shift Time Window */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Общее окно рабочего дня:</span>
              </span>
              <span className="text-blue-700 font-mono font-black">
                {shiftStart} — {shiftEnd} (12 ч)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Начало смены
                </label>
                <input
                  type="time"
                  value={shiftStart}
                  onChange={(e) => setShiftStart(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Конец смены
                </label>
                <input
                  type="time"
                  value={shiftEnd}
                  onChange={(e) => setShiftEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Channel Allocation Splits */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Распределение каналов приёма
              </h2>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
              Сплит-график
            </span>
          </div>

          {/* In-Person House Calls Window */}
          <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900">
                  Очные выезды на дом (экипаж)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                Слоты по 45 мин
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">С</span>
                <input
                  type="time"
                  value={inPersonStart}
                  onChange={(e) => setInPersonStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">До</span>
                <input
                  type="time"
                  value={inPersonEnd}
                  onChange={(e) => setInPersonEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Telemedicine & Video Window */}
          <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900">
                  Телемедицина и видео-триаж
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-200">
                Слоты по 20 мин
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">С</span>
                <input
                  type="time"
                  value={telehealthStart}
                  onChange={(e) => setTelehealthStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">До</span>
                <input
                  type="time"
                  value={telehealthEnd}
                  onChange={(e) => setTelehealthEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Break & Emergency Reserve */}
          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900">
                  Перерыв и резерв экстренных вызовов
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                Резерв 60 мин
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">С</span>
                <input
                  type="time"
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">До</span>
                <input
                  type="time"
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Emergency buffer toggle */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <div className="pr-3">
              <span className="font-bold text-slate-900 block">
                Авто-резерв времени на дорожные пробки
              </span>
              <span className="text-[10px] text-slate-500">
                Увеличивает окно между вызовами на 20 мин при трафике от 7 баллов
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEmergencyBufferActive(!emergencyBufferActive)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                emergencyBufferActive ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  emergencyBufferActive ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 3: Base Tariff Customizer with 4% NPD Tax Preview */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Базовые тарифы и налог 4% НПД
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <Percent className="w-3 h-3 text-emerald-600" />
              <span>422-ФЗ Авто-чек</span>
            </span>
          </div>

          {/* Tariff 1: Planned House Call */}
          <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Очный плановый вызов ветврача
                </span>
                <span className="text-[10px] text-slate-500">
                  Базовый осмотр, термометрия, сбор анамнеза
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step={100}
                  min={1000}
                  value={priceInPerson}
                  onChange={(e) => setPriceInPerson(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-mono font-black text-slate-900"
                />
                <span className="text-xs font-bold text-slate-600">₽</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono">
              <span className="text-slate-500">
                Налог НПД 4%: <strong className="text-slate-700">{inPersonCalc.tax} ₽</strong>
              </span>
              <span className="text-emerald-700 font-bold">
                Врачу на руки: {inPersonCalc.net.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Tariff 2: Urgent Emergency Triage */}
          <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Срочный триаж / экстренный выезд (до 20 мин)
                </span>
                <span className="text-[10px] text-slate-500">
                  Приоритетная диспетчеризация экипажа
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step={100}
                  min={1000}
                  value={priceEmergency}
                  onChange={(e) => setPriceEmergency(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-mono font-black text-slate-900"
                />
                <span className="text-xs font-bold text-slate-600">₽</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono">
              <span className="text-slate-500">
                Налог НПД 4%: <strong className="text-slate-700">{emergencyCalc.tax} ₽</strong>
              </span>
              <span className="text-emerald-700 font-bold">
                Врачу на руки: {emergencyCalc.net.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Tariff 3: Urgent Video Consultation */}
          <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Срочная видеоконсультация 24/7 (20 мин)
                </span>
                <span className="text-[10px] text-slate-500">
                  Мгновенное подключение к видеосвязи
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step={100}
                  min={500}
                  value={priceVideoUrgent}
                  onChange={(e) => setPriceVideoUrgent(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-mono font-black text-slate-900"
                />
                <span className="text-xs font-bold text-slate-600">₽</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono">
              <span className="text-slate-500">
                Налог НПД 4%: <strong className="text-slate-700">{videoUrgentCalc.tax} ₽</strong>
              </span>
              <span className="text-emerald-700 font-bold">
                Врачу на руки: {videoUrgentCalc.net.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Tariff 4: Planned Video Consultation */}
          <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Плановая видеоконсультация (30 мин)
                </span>
                <span className="text-[10px] text-slate-500">
                  Разбор анализов, коррекция терапии
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step={100}
                  min={500}
                  value={priceVideoPlanned}
                  onChange={(e) => setPriceVideoPlanned(Number(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right text-xs font-mono font-black text-slate-900"
                />
                <span className="text-xs font-bold text-slate-600">₽</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 font-mono">
              <span className="text-slate-500">
                Налог НПД 4%: <strong className="text-slate-700">{videoPlannedCalc.tax} ₽</strong>
              </span>
              <span className="text-emerald-700 font-bold">
                Врачу на руки: {videoPlannedCalc.net.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          {/* Tax Information Banner */}
          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-950 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Федеральный закон № 422-ФЗ (Налог на профессиональный доход)</span>
            </div>
            <p className="leading-relaxed">
              Чеки самозанятого формируются автоматически в реестре ФНС РФ через открытый API «Мой налог». 
              Платформа не взимает скрытых комиссий с базового тарифа врача.
            </p>
          </div>

          {/* SBP Auto-Payout Setting */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <div className="pr-3">
              <span className="font-bold text-slate-900 block">
                Мгновенный вывод на СБП по завершении визита
              </span>
              <span className="text-[10px] text-slate-500">
                Автоматическое зачисление на карту Тинькофф (+7 911 289-40-12)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoSbpPayout(!autoSbpPayout)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                autoSbpPayout ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  autoSbpPayout ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Regulatory footer note */}
        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-[10px] text-slate-500 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-tight">
            Все изменения тарифов регистрируются в смарт-контракте эскроу ЮKassa и синхронизируются с диспетчерским сервером экстренного реагирования по Санкт-Петербургу.
          </p>
        </div>

        {/* Action Save Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Сохранить настройки смены и тарифов</span>
          </button>
        </div>
      </div>
    </div>
  );
};
