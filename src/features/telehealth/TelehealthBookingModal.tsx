import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useDragScroll } from '@/shared/lib/use-drag-scroll';
import {
  VideoCallFormat,
  VideoConsultationOrder,
  UrgentVideoConsultationOrder,
  ScheduledVideoConsultationOrder,
} from '@/shared/types/telehealth';
import {
  X,
  ArrowLeft,
  Video,
  Calendar,
  Lock,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export interface TelehealthBookingModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onBookingComplete: (order: VideoConsultationOrder) => void;
}

export const TelehealthBookingModal: React.FC<TelehealthBookingModalProps> = ({
  isOpen,
  onClose,
  onBookingComplete,
}) => {
  const { user } = useAuth();
  const dateScrollRef = useDragScroll<HTMLDivElement>();

  // Wizard Step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedFormat, setSelectedFormat] = useState<VideoCallFormat>('urgent');
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('16:30 - 17:00');
  const [chiefComplaint, setChiefComplaint] = useState<string>(
    'Оценка общего состояния, рвота желчью, снижение активности'
  );
  const [isConsentChecked, setIsConsentChecked] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Сегодня', day: '13 окт', active: true },
    { label: 'Завтра', day: '14 окт', active: false },
    { label: 'Среда', day: '15 окт', active: false },
    { label: 'Четверг', day: '16 окт', active: false },
    { label: 'Пятница', day: '17 окт', active: false },
  ];

  const timeSlots = ['10:00 - 10:30', '11:00 - 11:30', '14:00 - 14:30', '16:30 - 17:00', '19:00 - 19:30'];

  const priceRubles = selectedFormat === 'urgent' ? 1200 : 1500;

  const handleProceedToStep2 = () => {
    setCurrentStep(2);
  };

  const handleProceedToStep3 = () => {
    setCurrentStep(3);
  };

  const handleConfirmBooking = () => {
    if (!isConsentChecked) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (selectedFormat === 'urgent') {
        const urgentOrder: UrgentVideoConsultationOrder = {
          id: `tele-urg-${Date.now()}`,
          userId: user?.uid ?? 'user-spb-nord',
          callFormat: 'urgent',
          isImmediate: true,
          standbyCountdownSeconds: 300,
          emergencySymptoms: ['Рвота', 'Снижение активности'],
          status: 'waiting_room',
          pet: {
            id: 'pet-nord-01',
            name: 'Норд',
            breed: 'Сибирский хаски',
            weightKg: 28.4,
            chipNumber: '643098100234567',
          },
          doctor: {
            id: 'doc-duty-01',
            name: 'Дежурный ветврач-терапевт СПбГУВМ',
            specialization: 'Врач интенсивной терапии / Триаж 24/7',
            accreditation: 'СПбГУВМ • Россельхознадзор',
            licenseNumber: 'ФГИС «ВетИС» #RU-78/VET-EMERGENCY',
            experienceYears: 9,
            rating: 4.97,
          },
          chiefComplaint,
          priceRubles: 1200,
          escrowPaymentId: `escrow-yoo-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        onBookingComplete(urgentOrder);
      } else {
        const scheduledOrder: ScheduledVideoConsultationOrder = {
          id: `tele-sch-${Date.now()}`,
          userId: user?.uid ?? 'user-spb-nord',
          callFormat: 'scheduled',
          status: 'scheduled',
          appointmentDateText: `${dates[selectedDateIndex]?.label ?? 'Сегодня'}, ${dates[selectedDateIndex]?.day ?? '13 окт'}`,
          timeSlot: selectedTimeSlot,
          cancellationDeadlineText: 'Бесплатная отмена за 2 часа до начала',
          canFreeCancel: true,
          pet: {
            id: 'pet-nord-01',
            name: 'Норд',
            breed: 'Сибирский хаски',
            weightKg: 28.4,
            chipNumber: '643098100234567',
          },
          doctor: {
            id: 'doc-romanov-01',
            name: 'Д-р Романов Дмитрий С.',
            specialization: 'Ветврач-терапевт, хирург',
            accreditation: 'СПбГУВМ • Россельхознадзор',
            licenseNumber: 'ФГИС «ВетИС» #RU-78/VET-4190',
            experienceYears: 11,
            rating: 4.98,
          },
          chiefComplaint,
          priceRubles: 1500,
          escrowPaymentId: `escrow-yoo-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        onBookingComplete(scheduledOrder);
      }
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">
                Заказ видеоконсультации 24/7
              </h2>
              <span className="text-[10px] text-slate-500 font-bold">
                Шаг {currentStep} из 3 • ГОСТ Р 34.12
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* ========================================================= */}
          {/* STEP 1: FORMAT SELECTOR                                   */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-3.5 animate-fadeIn">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                Выберите формат видеосвязи с врачом:
              </span>

              {/* Option A: Urgent Video Call */}
              <div
                onClick={() => setSelectedFormat('urgent')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  selectedFormat === 'urgent'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        Срочный видеовопрос 24/7
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Врач подключится в течение 5 минут для триажа
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-blue-700 shrink-0">
                    1 200 ₽
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-1 text-[10px] text-emerald-700 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Дежурный ветеринар онлайн • Экспресс-оценка</span>
                </div>
              </div>

              {/* Option B: Scheduled Online Consultation */}
              <div
                onClick={() => setSelectedFormat('scheduled')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  selectedFormat === 'scheduled'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        Запланировать онлайн-прием
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Детальная 30-минутная консультация специалиста
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-indigo-700 shrink-0">
                    1 500 ₽
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-1 text-[10px] text-indigo-800 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Выбор даты и времени • Анализ истории болезни</span>
                </div>
              </div>

              {/* Patient Capsule */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-800 text-[11px]">
                  Пациент: Норд (Сибирский хаски, 28.4 кг)
                </div>
                <p className="text-[10px] text-slate-500">
                  Ветпаспорт #ВЕТ-491 • История предыдущих вызовов синхронизирована
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Продолжить</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: DYNAMIC SCHEDULING LOGIC                          */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {selectedFormat === 'urgent' ? (
                /* Urgent Standby View: Calendars completely bypassed */
                <div className="p-4 rounded-3xl bg-blue-50/80 border border-blue-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg">
                    <Video className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-slate-900">
                      Экстренный режим: Подключение за 5 минут
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-xs mx-auto">
                      Выбор даты не требуется. Дежурный врач готов войти в видеокабинет сразу после холдирования средств.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-blue-200 text-[11px] font-mono text-blue-900 font-bold">
                    Таймер ожидания подключения: ~04:59
                  </div>
                </div>
              ) : (
                /* Scheduled Calendar & Slots View */
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Выберите дату приема:
                  </span>

                  <div
                    ref={dateScrollRef}
                    className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5"
                  >
                    {dates.map((d, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`p-2.5 rounded-2xl text-center shrink-0 transition-all cursor-pointer min-w-[70px] ${
                          selectedDateIndex === idx
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="text-[10px] block opacity-80">{d.label}</span>
                        <span className="text-xs font-black block mt-0.5">{d.day}</span>
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block pt-2">
                    Доступные 30-минутные слоты:
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-800 hover:border-blue-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chief Complaint Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  Причина обращения / симптомы:
                </label>
                <textarea
                  rows={2}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleProceedToStep3}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Перейти к холдированию ({priceRubles} ₽)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: YOOKASSA ESCROW PRE-AUTHORIZATION & CONSENT       */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Financial Breakdown Card */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span>
                    {selectedFormat === 'urgent'
                      ? 'Срочный видеовопрос 24/7 (5 мин)'
                      : `Онлайн-прием (${selectedTimeSlot})`}
                  </span>
                  <span className="font-bold text-slate-900">{priceRubles} ₽</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Комиссия сервиса VetTech OS:</span>
                  <span className="font-bold text-emerald-600">0 ₽ (0%)</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">Сумма холдирования:</span>
                  <span className="font-black text-base text-blue-700">{priceRubles} ₽</span>
                </div>
              </div>

              {/* Payment Instrument (MIR Card Selector) */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-[10px]">
                    МИР
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      Карта МИР •••• 4412
                    </span>
                    <span className="text-[10px] text-slate-500">Сбербанк • Подключена</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Активна
                </span>
              </div>

              {/* Legal Informed Consent & Escrow Clause */}
              <label className="flex items-start space-x-2.5 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConsentChecked}
                  onChange={(e) => setIsConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-blue-950 leading-relaxed">
                  Подтверждаю согласие с правилами холдирования средств: <strong>{priceRubles} ₽ блокируются на карте и списываются только после фактического завершения видеоприема</strong> врачом (Закон РФ № 4979-1, 54-ФЗ и 152-ФЗ).
                </span>
              </label>

              {/* Confirm & Pre-Authorize Trigger */}
              <button
                type="button"
                disabled={!isConsentChecked || isSubmitting}
                onClick={handleConfirmBooking}
                className={`w-full py-4 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer ${
                  isConsentChecked && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  {isSubmitting
                    ? 'Холдирование в ЮKassa...'
                    : `Авторизовать ${priceRubles} ₽ и перейти в видеокабинет`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
