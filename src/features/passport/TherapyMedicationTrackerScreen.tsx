import React, { useState } from 'react';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import { TherapyDay, TherapyDose } from '@/shared/types/therapy';
import { useDragScroll } from '@/shared/lib/use-drag-scroll';
import {
  ArrowLeft,
  Pill,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Thermometer,
  Droplets,
  Activity,
  Info,
  X,
  Dog,
  Cat,
  PawPrint,
  Calendar,
} from 'lucide-react';

export interface TherapyMedicationTrackerScreenProps {
  readonly pet: DigitalVetPassport;
  readonly onBack: () => void;
}

export const TherapyMedicationTrackerScreen: React.FC<TherapyMedicationTrackerScreenProps> = ({
  pet,
  onBack,
}) => {
  const daysCarouselRef = useDragScroll<HTMLDivElement>();

  // Days 1 through 10 initial state
  const initialDays: TherapyDay[] = [
    {
      dayNumber: 1,
      dateText: '12 окт',
      fullDateText: '12 октября 2026',
      isToday: true,
      doses: [
        {
          id: 'd1-1',
          doseNumber: 1,
          timeScheduled: '08:30',
          doseAmount: '1.5 таблетки (375 мг)',
          instruction: 'С влажным кормом / паштетом',
          status: 'completed',
          administeredAtText: '08:35',
          administeredBy: 'Владелец Александр',
        },
        {
          id: 'd1-2',
          doseNumber: 2,
          timeScheduled: '20:30',
          doseAmount: '1.5 таблетки (375 мг)',
          instruction: 'С влажным кормом / таблеткодаватель',
          status: 'pending',
          timeWindowText: '20:15 – 21:00',
        },
      ],
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      dayNumber: i + 2,
      dateText: `${13 + i} окт`,
      fullDateText: `${13 + i} октября 2026`,
      isToday: false,
      doses: [
        {
          id: `d${i + 2}-1`,
          doseNumber: 1,
          timeScheduled: '08:30',
          doseAmount: '1.5 таблетки (375 мг)',
          instruction: 'С влажным кормом',
          status: 'pending' as const,
        },
        {
          id: `d${i + 2}-2`,
          doseNumber: 2,
          timeScheduled: '20:30',
          doseAmount: '1.5 таблетки (375 мг)',
          instruction: 'С влажным кормом',
          status: 'pending' as const,
        },
      ],
    })),
  ];

  const [days, setDays] = useState<TherapyDay[]>(initialDays);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Vitals State
  const [rectalTemp, setRectalTemp] = useState<number>(38.6);
  const [tempMeasuredAt, setTempMeasuredAt] = useState<string>('13:00');
  const [isTempModalOpen, setIsTempModalOpen] = useState<boolean>(false);
  const [tempInputValue, setTempInputValue] = useState<string>('38.6');

  // Hydration State
  const [waterCurrentMl, setWaterCurrentMl] = useState<number>(1100);
  const waterTargetMl = 1500;

  // Missed Dose Modal State
  const [isMissedModalOpen, setIsMissedModalOpen] = useState<boolean>(false);
  const [targetDoseToMiss, setTargetDoseToMiss] = useState<TherapyDose | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Selected Day Object
  const currentDay = days.find((d) => d.dayNumber === selectedDayNumber) ?? days[0]!;

  // Dynamic Progress & Adherence
  const allDoses = days.flatMap((d) => d.doses);
  const totalDosesCount = allDoses.length;
  const completedDosesCount = allDoses.filter((d) => d.status === 'completed').length;
  const missedDosesCount = allDoses.filter((d) => d.status === 'missed').length;
  const progressPercent = Math.round((completedDosesCount / totalDosesCount) * 100);

  // Adherence: completed out of (completed + missed)
  const scheduledSoFar = completedDosesCount + missedDosesCount;
  const adherencePercent = scheduledSoFar === 0 ? 100 : Math.round((completedDosesCount / scheduledSoFar) * 100);

  // Dose Actions
  const handleMarkDoseCompleted = (doseId: string) => {
    const nowTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        doses: day.doses.map((d) =>
          d.id === doseId
            ? {
                ...d,
                status: 'completed',
                administeredAtText: nowTime,
                administeredBy: 'Владелец Александр',
              }
            : d
        ),
      }))
    );
    showToast('✓ Дача антибиотика Синулокс (1.5 таб) зафиксирована в истории болезни');
  };

  const handlePostponeDose = (doseId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        doses: day.doses.map((d) =>
          d.id === doseId
            ? {
                ...d,
                timeWindowText: '20:45 – 21:15 (+15 мин)',
              }
            : d
        ),
      }))
    );
    showToast('Прием препарата отложен на 15 минут. Таймер напоминания обновлен');
  };

  const handleOpenMissedConfirmation = (dose: TherapyDose) => {
    setTargetDoseToMiss(dose);
    setIsMissedModalOpen(true);
  };

  const handleConfirmMissedDose = () => {
    if (!targetDoseToMiss) return;
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        doses: day.doses.map((d) =>
          d.id === targetDoseToMiss.id
            ? {
                ...d,
                status: 'missed',
                missedReason: 'Пропущено владельцем',
              }
            : d
        ),
      }))
    );
    setIsMissedModalOpen(false);
    setTargetDoseToMiss(null);
    showToast('Пропуск приема зарегистрирован в аудит-логе. Следующую дозу НЕ удваивать!');
  };

  const handleSaveTemperature = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempInputValue.replace(',', '.'));
    if (!isNaN(val) && val >= 35 && val <= 43) {
      setRectalTemp(val);
      setTempMeasuredAt(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
      setIsTempModalOpen(false);
      showToast(`Температура ${val.toFixed(1)}°C успешно внесена в клиническую карту`);
    } else {
      showToast('Укажите корректную температуру (от 35.0 до 43.0 °C)');
    }
  };

  const handleAddWater = () => {
    setWaterCurrentMl((prev) => Math.min(2000, prev + 200));
    showToast('+200 мл выпитой фильтрованной воды добавлено в трекер');
  };

  const renderPetIcon = () => {
    switch (pet.speciesCategory) {
      case 'canine':
        return <Dog className="w-5 h-5 text-blue-600" />;
      case 'feline':
        return <Cat className="w-5 h-5 text-amber-600" />;
      default:
        return <PawPrint className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/70 font-sans">
      {/* ========================================================= */}
      {/* 1. STICKY CLINICAL HEADER & REGULATORY SUBTITLE           */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к ветпаспорту"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                Интерактивный вет-трекер терапии
              </h1>
              <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                СПб ВетСлужба 24/7 • ФГИС «ВетИС» (Хорриот)
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            {renderPetIcon()}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* ========================================================= */}
        {/* 2. PATIENT IDENTITY CAPSULE                               */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {pet.petName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-black text-slate-900 truncate">{pet.petName}</h2>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                  {pet.weightKg} кг
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {pet.breedNameRu} • {pet.isSterilized ? 'Кастрирован' : 'Интактный'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono text-[10px] font-bold text-slate-500 block">
              {pet.passportSeriesNumber}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
              Чип #{pet.microchip?.chipNumber.slice(-6) ?? '100234'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ACTIVE DIAGNOSIS & COURSE PROGRESS OVERVIEW            */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-3xl p-5 text-white shadow-lg space-y-4 border border-slate-800">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                Клинический диагноз
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-white mt-0.5 leading-snug">
                Острый бактериальный трахеобронхит (Питомниковый кашель)
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Назначил: Д-р Романов Д. С. • СПбГУВМ • Визит #ВЕТ-491
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 font-mono text-[10px] border border-teal-500/30 shrink-0">
              ВетИС #78-491
            </span>
          </div>

          {/* Course Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-white text-[11px] sm:text-xs">
                  Синулокс (Амоксициллин + клавуланат) • День {selectedDayNumber} из 10
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Приверженность: {adherencePercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{completedDosesCount} из {totalDosesCount} приемов выполнено ({progressPercent}%)</span>
              <span>Курс: 12 окт – 21 окт</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. INTERACTIVE THERAPY DAYS CAROUSEL                      */}
        {/* ========================================================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Дни курса терапии (10 дней)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              2 приема в сутки (каждые 12 ч)
            </span>
          </div>

          <div
            ref={daysCarouselRef}
            style={{ touchAction: 'pan-x' }}
            className="flex space-x-2.5 overflow-x-auto no-scrollbar py-1 select-none"
          >
            {days.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              const completedCountInDay = day.doses.filter((d) => d.status === 'completed').length;
              const hasMissed = day.doses.some((d) => d.status === 'missed');
              const allDone = completedCountInDay === day.doses.length;

              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`py-2.5 px-3 rounded-2xl flex flex-col items-center min-w-[72px] shrink-0 transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-blue-300'
                  }`}
                >
                  <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    День {day.dayNumber}
                  </span>
                  <span className="text-xs font-black mt-0.5">{day.dateText}</span>

                  <div className="mt-1 flex items-center space-x-1">
                    {allDone ? (
                      <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-teal-200' : 'text-emerald-500'}`} />
                    ) : hasMissed ? (
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                    ) : (
                      <span className={`text-[9px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {completedCountInDay}/2
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. DAILY DOSE ADMINISTRATION & MISSED DOSE ENGINE         */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-900">
              Приемы: {currentDay.fullDateText}
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {currentDay.doses.filter((d) => d.status === 'completed').length} из {currentDay.doses.length} выполнено
            </span>
          </div>

          <div className="space-y-3">
            {currentDay.doses.map((dose) => {
              const isMorning = dose.doseNumber === 1;
              const isCompleted = dose.status === 'completed';
              const isMissed = dose.status === 'missed';

              return (
                <div
                  key={dose.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all space-y-3 ${
                    isCompleted
                      ? 'border-emerald-200/90 shadow-2xs'
                      : isMissed
                      ? 'border-red-200/90 bg-red-50/20 shadow-2xs'
                      : 'border-blue-600/30 shadow-md ring-1 ring-blue-500/20'
                  }`}
                >
                  {/* Dose Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isMissed
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-black text-slate-900">
                            {isMorning ? '1-й прием (Утро)' : '2-й прием (Вечер)'} • {dose.timeScheduled}
                          </h4>
                          {isCompleted && (
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Выполнено
                            </span>
                          )}
                          {isMissed && (
                            <span className="text-[9px] font-black text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                              Пропущено
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                          Дозировка: <strong>{dose.doseAmount}</strong> ({pet.weightKg} кг)
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      #{dose.id}
                    </span>
                  </div>

                  {/* Status / Window Detail */}
                  {isCompleted ? (
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-[11px]">
                          Принято в {dose.administeredAtText} • {dose.administeredBy}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-700">✓ ВетИС</span>
                    </div>
                  ) : isMissed ? (
                    <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="font-semibold text-[11px]">
                          {dose.missedReason ?? 'Пропущено владельцем'} • Внесено в историю
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dose.timeWindowText && (
                        <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                          <span className="font-bold text-[11px] flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span>Окно приема: {dose.timeWindowText}</span>
                          </span>
                          <span className="text-[10px] text-blue-800 font-medium">Интервал 12 ч</span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-center space-x-2">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Рекомендация: с паштетом, влажным кормом или использовать таблеткодаватель.</span>
                      </div>

                      {/* Action Controls */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleMarkDoseCompleted(dose.id)}
                          className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>✓ Отметить дачу препарата (1.5 таб)</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handlePostponeDose(dose.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Отложить на 15 мин
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenMissedConfirmation(dose)}
                            className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] border border-red-200 transition-colors cursor-pointer"
                          >
                            Пропустил прием / Забыл дать
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. SPB VETERINARY SUPERVISION REGULATIONS (LAW NO. 4979-1)*/}
        {/* ========================================================= */}
        <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-amber-950 space-y-2.5 shadow-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
              Вет-надзор СПб • Правила антибиотикотерапии (№ 4979-1)
            </h4>
          </div>

          <ul className="text-xs space-y-1.5 pl-5 list-disc text-amber-900 leading-relaxed font-medium">
            <li>
              <strong>Не прерывать курс досрочно:</strong> Даже при полном исчезновении кашля продолжайте прием все 10 дней для предотвращения бактериальной резистентности и рецидива пневмонии.
            </li>
            <li>
              <strong>Категорический запрет человеческих НПВС:</strong> Парацетамол, Ибупрофен, Аспирин смертельно опасны для собак и вызывают острую печеночную и почечную недостаточность.
            </li>
          </ul>
        </div>

        {/* ========================================================= */}
        {/* 7. SUPPORTIVE CARE & CLINICAL VITALS LOG                  */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <span className="text-xs font-black text-slate-900 px-1 block">
            Симптоматическая терапия и витальные показатели
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Vitals Card: Rectal Temperature */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Термометрия
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {rectalTemp.toFixed(1)} °C
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTempModalOpen(true)}
                  className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 transition-colors cursor-pointer"
                >
                  + Замер t°
                </button>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-1.5 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">● Нормотермия</span>
                <span>Замер в {tempMeasuredAt}</span>
              </div>
            </div>

            {/* Hydration Tracker */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Гидратация
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {waterCurrentMl} / {waterTargetMl} мл
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddWater}
                  className="py-1.5 px-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[10px] border border-teal-200 transition-colors cursor-pointer"
                >
                  +200 мл
                </button>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((waterCurrentMl / waterTargetMl) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Supportive Meds & Regimen Cards */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Отхаркивающий сироп (Бронхолитин / Амброксол вет)
                </div>
                <p className="text-[11px] text-slate-600">
                  Разовая доза: 5 мл 2 раза в день после еды (курс 5 дней для разжижения мокроты).
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2.5 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Режим прогулок и защита трахеи
                </div>
                <p className="text-[11px] text-slate-600">
                  Ограничить активные игры и бег. Прогулки до 15 минут строго на анатомической шлейке (исключить ошейники во избежание давления на воспаленную трахею).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8. MODAL: LOG TEMPERATURE DIALOG                          */}
      {/* ========================================================= */}
      {isTempModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xs w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Thermometer className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Замер температуры</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTempModalOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemperature} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Ректальная температура (°C)
                </label>
                <input
                  type="text"
                  value={tempInputValue}
                  onChange={(e) => setTempInputValue(e.target.value)}
                  placeholder="38.5"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Норма для собак: 37.5 – 39.0 °C
                </span>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Сохранить замер
                </button>
                <button
                  type="button"
                  onClick={() => setIsTempModalOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. MODAL: CONFIRM MISSED DOSE LOGIC                       */}
      {/* ========================================================= */}
      {isMissedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Зафиксировать пропуск приема?</h3>
                <p className="text-[10px] text-slate-500">
                  Аудит-лог терапии по Закону РФ № 4979-1
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-red-50/80 border border-red-200 text-xs text-red-950 space-y-1.5 leading-relaxed font-medium">
              <p>
                <strong>Критически важно:</strong> Если прием пропущен, категорически запрещено давать двойную дозу в следующий раз.
              </p>
              <p className="text-[11px] text-red-900">
                Пропуск дозы снизит показатель приверженности лечению и будет отображен в карте для лечащего врача СПбГУВМ.
              </p>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmMissedDose}
                className="flex-1 py-3 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Да, зафиксировать пропуск
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMissedModalOpen(false);
                  setTargetDoseToMiss(null);
                }}
                className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. TOAST NOTIFICATION                                    */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 z-50 flex justify-center pointer-events-none animate-slideUp">
          <div className="bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-slate-700 max-w-sm text-center">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
