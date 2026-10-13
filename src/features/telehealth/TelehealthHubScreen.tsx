import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import { TelehealthRepository } from '@/dal/telehealth.repository';
import { VideoConsultationOrder } from '@/shared/types/telehealth';
import { TelehealthBookingModal } from './TelehealthBookingModal';
import { VideoConsultationRoomScreen } from './VideoConsultationRoomScreen';
import {
  ArrowLeft,
  Video,
  ShieldCheck,
  RotateCcw,
  FileText,
  X,
} from 'lucide-react';

export interface TelehealthHubScreenProps {
  readonly onBack?: () => void;
  readonly onProfileClick?: () => void;
  readonly telehealthRepo?: TelehealthRepository;
}

export const TelehealthHubScreen: React.FC<TelehealthHubScreenProps> = ({
  onBack,
  onProfileClick,
  telehealthRepo,
}) => {
  const { user } = useAuth();
  const repo = useMemo(() => telehealthRepo ?? new TelehealthRepository(), [telehealthRepo]);

  // Tab State: 'active' | 'completed' | 'cancelled'
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  // Repository Data
  const [activeCalls, setActiveCalls] = useState<readonly VideoConsultationOrder[]>([]);
  const [completedCalls, setCompletedCalls] = useState<readonly VideoConsultationOrder[]>([]);
  const [cancelledCalls, setCancelledCalls] = useState<readonly VideoConsultationOrder[]>([]);

  // Modal & Video Room State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [activeVideoCall, setActiveVideoCall] = useState<VideoConsultationOrder | null>(null);
  const [selectedProtocolCall, setSelectedProtocolCall] = useState<VideoConsultationOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAllConsultations = async () => {
    const activeRes = await repo.getActiveConsultations();
    if (activeRes.success) setActiveCalls(activeRes.data);

    const compRes = await repo.getCompletedConsultations();
    if (compRes.success) setCompletedCalls(compRes.data);

    const cancRes = await repo.getCancelledConsultations();
    if (cancRes.success) setCancelledCalls(cancRes.data);
  };

  useEffect(() => {
    loadAllConsultations();
  }, [repo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelCall = async (orderId: string) => {
    const res = await repo.cancelConsultation(orderId, 'Отменено пользователем до дедлайна');
    if (res.success) {
      showToast('Видеоконсультация отменена. 100% средств разблокировано на карте МИР (0 ₽ штрафа).');
      loadAllConsultations();
      setActiveTab('cancelled');
    }
  };

  const handleBookingComplete = async (newOrder: VideoConsultationOrder) => {
    await repo.createConsultation(newOrder);
    await loadAllConsultations();
    showToast('Заказ видеоконсультации успешно оформлен! Эскроу авторизован.');

    if (newOrder.callFormat === 'urgent') {
      setActiveVideoCall(newOrder);
    } else {
      setActiveTab('active');
    }
  };

  const handleEndVideoCall = async (completedOrder?: VideoConsultationOrder) => {
    if (completedOrder) {
      await repo.createConsultation(completedOrder);
      await loadAllConsultations();
    }
    setActiveVideoCall(null);
    setActiveTab('completed');
    showToast('Видеоконсультация завершена. Заключение и рецепт сохранены в архив.');
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

  // If entering video call room, mount full-screen consultation room
  if (activeVideoCall) {
    return (
      <VideoConsultationRoomScreen
        consultation={activeVideoCall}
        onEndCall={handleEndVideoCall}
      />
    );
  }

  return (
    <div className="min-h-full pb-28 text-slate-900 bg-slate-50/60 font-sans">
      {/* ========================================================= */}
      {/* A. STICKY HEADER & QUICK ACTION TRIGGER                   */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Назад"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                Телеветеринария СПб 24/7
              </h1>
              <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                Защищенный контур видеосвязи • ГОСТ Р 34.12
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Профиль пользователя"
            className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 cursor-pointer"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Аватар'}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </button>
        </div>

        {/* Quick Action Button: Create Video Consultation */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
          >
            <Video className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Заказать видеоконсультацию 24/7</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* B. THREE-TAB SUB-NAVIGATION                               */}
        {/* ========================================================= */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1">
          {/* Tab 1: Active and Planned */}
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Активные</span>
            {activeCalls.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center ml-0.5">
                {activeCalls.length}
              </span>
            )}
          </button>

          {/* Tab 2: Completed */}
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Завершенные</span>
            {completedCalls.length > 0 && (
              <span className="text-[11px] text-slate-500 font-normal">
                ({completedCalls.length})
              </span>
            )}
          </button>

          {/* Tab 3: Cancelled */}
          <button
            type="button"
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Отмененные</span>
            {cancelledCalls.length > 0 && (
              <span className="text-[11px] text-slate-500 font-normal">
                ({cancelledCalls.length})
              </span>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ACTIVE AND PLANNED CALLS                           */}
        {/* ========================================================= */}
        {activeTab === 'active' && (
          <div className="space-y-4 animate-fadeIn">
            {activeCalls.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">
                    Нет активных видеоконсультаций
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Вы можете оформить срочный вопрос дежурному врачу за 1 200 ₽ или запланировать консультацию.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
                >
                  Заказать видеосвязь
                </button>
              </div>
            ) : (
              activeCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-blue-600/40 shadow-md space-y-3.5"
                >
                  {/* Status Pill & Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                          Видеокабинет готов к подключению
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                        {call.callFormat === 'urgent'
                          ? 'Срочный видеовопрос 24/7'
                          : `Онлайн-прием: ${(call as any).appointmentDateText ?? 'Сегодня'}`}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-slate-900">{call.priceRubles} ₽</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold block mt-0.5">
                        Эскроу активен
                      </span>
                    </div>
                  </div>

                  {/* Attending Doctor Profile */}
                  <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {call.doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-slate-900 truncate">
                        {call.doctor.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {call.doctor.specialization} • {call.doctor.accreditation}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-emerald-700 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{call.doctor.licenseNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Patient Context Block */}
                  <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-blue-950 font-bold">
                      <span>Пациент: {call.pet.name} ({call.pet.breed})</span>
                      <span>{call.pet.weightKg} кг</span>
                    </div>
                    <p className="text-[11px] text-blue-900/90 leading-relaxed">
                      Причина: {call.chiefComplaint}
                    </p>
                  </div>

                  {/* Primary Trigger: Enter Video Room */}
                  <button
                    type="button"
                    onClick={() => setActiveVideoCall(call)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-emerald-300" />
                    <span>Войти в видеокабинет (ГОСТ Р 34.12)</span>
                  </button>

                  {/* Secondary Actions: Reschedule or Cancel */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => showToast('Перенос времени доступен через диспетчера или меню записи')}
                      className="text-slate-600 hover:text-slate-900 font-bold text-[11px]"
                    >
                      Перенести слот
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelCall(call.id)}
                      className="text-red-600 hover:text-red-700 font-bold text-[11px]"
                    >
                      Отменить консультацию (0 ₽ штрафа)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COMPLETED TELEMEDICINE PROTOCOLS                   */}
        {/* ========================================================= */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-fadeIn">
            {completedCalls.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 text-slate-500 text-xs">
                Завершенных видеоконсультаций пока нет.
              </div>
            ) : (
              completedCalls.map((call) => (
                <div
                  key={call.id}
                  onClick={() => setSelectedProtocolCall(call)}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3.5 hover:border-blue-400 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {call.diagnosticSummary?.completedAtText ?? '12 окт 2026, 15:10'}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 leading-snug mt-0.5">
                        {call.diagnosticSummary?.primaryDiagnosis ?? 'Клинический осмотр онлайн'}
                      </h3>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      {call.priceRubles} ₽
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 text-[11px] flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Назначения лечащего врача:</span>
                    </div>
                    <ul className="text-[11px] text-slate-700 space-y-1 pl-5 list-disc">
                      {call.diagnosticSummary?.recommendations.map((rec, rIdx) => (
                        <li key={rIdx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 flex-wrap gap-2">
                    <span className="font-mono text-[10px] text-emerald-800 font-bold">
                      {call.diagnosticSummary?.doctorUkepSignature ?? 'УКЭП подтверждена'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProtocolCall(call);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 text-[11px] cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Открыть протокол приема →</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CANCELLED CALLS & 100% ESCROW REFUNDS              */}
        {/* ========================================================= */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4 animate-fadeIn">
            {cancelledCalls.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 text-slate-500 text-xs">
                Отмененных звонков нет.
              </div>
            ) : (
              cancelledCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {call.cancellationRecord?.cancelledAtText ?? 'Отменено'}
                      </span>
                      <h3 className="text-xs font-black text-slate-900 leading-snug mt-0.5">
                        Отмена видеоприема: {call.doctor.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 line-through">
                      {call.priceRubles} ₽
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center space-x-1.5 text-[11px]">
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% средств разблокировано на карте (0 ₽ штрафа)</span>
                    </div>
                    <p className="text-[10px] text-emerald-800">
                      {call.cancellationRecord?.refundCardMasked ?? 'Карта МИР •••• 4412'} • Причина: {call.cancellationRecord?.reason ?? 'По инициативе владельца'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detailed Clinical Protocol Modal */}
      {selectedProtocolCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Электронный протокол телеконсилиума
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {selectedProtocolCall.diagnosticSummary?.completedAtText ?? '12 окт 2026'} • УКЭП #ВЕТ-63ФЗ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProtocolCall(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 overflow-y-auto text-xs text-slate-700">
              {/* Doctor & Patient Identity */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900">
                    {selectedProtocolCall.doctor.name}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {selectedProtocolCall.doctor.specialization}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5 flex items-center justify-between">
                  <span>Пациент: <strong>{selectedProtocolCall.pet.name}</strong> ({selectedProtocolCall.pet.breed}, {selectedProtocolCall.pet.weightKg} кг)</span>
                  <span>Сессия: <strong>#{selectedProtocolCall.id}</strong></span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Клинический диагноз
                </span>
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 font-bold text-slate-900 text-xs">
                  {selectedProtocolCall.diagnosticSummary?.primaryDiagnosis ?? 'Клинический осмотр онлайн'}
                </div>
              </div>

              {/* Objective Vitals */}
              {selectedProtocolCall.diagnosticSummary?.objectiveVitals && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Объективный статус при видеоосмотре
                  </span>
                  <p className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                    {selectedProtocolCall.diagnosticSummary.objectiveVitals}
                  </p>
                </div>
              )}

              {/* Prescriptions & Recommendations */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Назначения и терапия</span>
                  <span className="text-emerald-700 font-bold font-mono text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ФГИС ВетИС Хорриот
                  </span>
                </span>
                <div className="space-y-2">
                  {selectedProtocolCall.diagnosticSummary?.prescribedMedications && selectedProtocolCall.diagnosticSummary.prescribedMedications.length > 0 ? (
                    selectedProtocolCall.diagnosticSummary.prescribedMedications.map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{p.drugName}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{p.dosage} • {p.frequency}</div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                          {p.durationDays} дн.
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                      {selectedProtocolCall.diagnosticSummary?.recommendations.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Legal UKEP Stamp */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start space-x-2 text-[10px] text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">
                    {selectedProtocolCall.diagnosticSummary?.doctorUkepSignature ?? 'Подписано УКЭП врача'}
                  </div>
                  <p className="text-emerald-800">
                    Сертификат аккредитован Минцифры РФ. Заключение имеет юридическую силу по Закону РФ № 4979-1.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 flex items-center space-x-2 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  showToast('Официальный протокол с УКЭП (PDF) сохранен в память устройства');
                  setSelectedProtocolCall(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Скачать протокол (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProtocolCall(null)}
                className="py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      <TelehealthBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingComplete={handleBookingComplete}
      />

      {/* Toast Notification */}
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
