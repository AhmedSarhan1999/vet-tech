import React, { useState, useEffect } from 'react';
import {
  VideoConsultationOrder,
  TelehealthPrescriptionItem,
} from '@/shared/types/telehealth';
import {
  ShieldCheck,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  FileText,
  MessageSquare,
  Camera,
  Send,
  RefreshCw,
  Check,
  ChevronDown,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface VideoConsultationRoomScreenProps {
  readonly consultation: VideoConsultationOrder;
  readonly onEndCall: (completedRecord?: VideoConsultationOrder) => void;
}

interface ChatMessage {
  readonly id: string;
  readonly sender: 'doctor' | 'user';
  readonly text: string;
  readonly time: string;
  readonly isAttachment?: boolean;
}

export const VideoConsultationRoomScreen: React.FC<VideoConsultationRoomScreenProps> = ({
  consultation,
  onEndCall,
}) => {
  // Call timer: starting at 00:00 and counting upwards
  const [secondsElapsed, setSecondsElapsed] = useState<number>(14 * 60 + 25); // initialized at 14:25 as referenced in spec
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Hardware controls state
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [isCameraFront, setIsCameraFront] = useState<boolean>(true);

  // Overlay Drawer State (Chat & Prescriptions)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'chat' | 'prescriptions'>('prescriptions');

  // Real-time dynamic prescriptions drafted by the doctor during call
  const [draftPrescriptions] = useState<readonly TelehealthPrescriptionItem[]>([
    {
      drugName: 'Синулокс 250 мг (Synulox)',
      dosage: '1.5 таблетки (355 мг)',
      frequency: '2 раза в день после кормления',
      durationDays: 7,
    },
    {
      drugName: 'Энтеросгель ветеринарный',
      dosage: '15 г пасты в 30 мл воды',
      frequency: '3 раза в день за 1.5 ч до еды',
      durationDays: 3,
    },
  ]);

  // In-call chat messages
  const [chatMessages, setChatMessages] = useState<readonly ChatMessage[]>([
    {
      id: 'c1',
      sender: 'doctor',
      text: 'Здравствуйте! Вижу Норда на видео. Покажите, пожалуйста, ближе десны и конъюнктиву глаза.',
      time: '14:12',
    },
    {
      id: 'c2',
      sender: 'user',
      text: 'Добрый день! Показываю десны, они бледно-розовые, влажные.',
      time: '14:14',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  const handleAttachPhoto = () => {
    const photoMsg: ChatMessage = {
      id: `photo-${Date.now()}`,
      sender: 'user',
      text: 'Фото ротовой полости и слизистых загружено для осмотра в высоком разрешении',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isAttachment: true,
    };
    setChatMessages((prev) => [...prev, photoMsg]);
    showToast('Фотография слизистых прикреплена к телеконсилиуму');
  };

  const handleFinishConsultation = () => {
    const completedOrder: VideoConsultationOrder = {
      ...consultation,
      status: 'completed',
      diagnosticSummary: {
        primaryDiagnosis: 'Острый алиментарный гастроэнтерит (купируемый)',
        objectiveVitals: 'Слизистые бледно-розовые, СНК 1.5 сек, одышка отсутствует, сознание ясное',
        recommendations: [
          'Телемедицинская экспресс-оценка завершена: острый хирургический живот исключен',
          'Соблюдение лечебной диеты Gastrointestinal в течение 14 дней',
          'Контроль термометрии в чате курации до 22:00',
        ],
        prescribedMedications: draftPrescriptions,
        doctorUkepSignature: 'УКЭП #78-VET-4190-ROMANOV • ГОСТ Р 34.12',
        vetIsHorriotRecordNumber: 'ВЕТИС #78-9042',
        completedAtText: 'Сегодня, 16:55',
      },
    };
    onEndCall(completedOrder);
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] md:min-h-0 bg-slate-950 text-white flex flex-col overflow-hidden select-none font-sans max-w-[440px] mx-auto">
      {/* ========================================================= */}
      {/* 1. TOP STATUS BAR (GOST R 34.12 & ENCRYPTED TELEMETRY)    */}
      {/* ========================================================= */}
      <header className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono font-bold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ГОСТ Р 34.12 • ЗАЩИЩЕНО</span>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold backdrop-blur-md">
            <Clock className="w-3 h-3 text-blue-300" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinishConsultation}
          className="py-1.5 px-3 rounded-full bg-red-600/90 hover:bg-red-700 text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>Завершить</span>
        </button>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN VIEWPORT: DOCTOR VIDEO STREAM SIMULATION          */}
      {/* ========================================================= */}
      <main className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Clinician Virtual Video Scene */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
          {/* Animated Video Stream Mesh */}
          <div className="relative">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 p-1 shadow-2xl animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {consultation.doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
              </div>
            </div>

            {/* Live Audio Telemetry Wave Indicator */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-center space-x-1">
              <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-7 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              {consultation.doctor.name}
            </h2>
            <p className="text-xs text-blue-200 font-medium">
              {consultation.doctor.specialization} • {consultation.doctor.accreditation}
            </p>
            <div className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
              <Check className="w-3 h-3" />
              <span>Лицензия ВетИС верифицирована</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PICTURE-IN-PICTURE: PATIENT CAMERA (HUSKY NORD)        */}
        {/* ========================================================= */}
        <aside
          aria-label="Предпросмотр камеры пациента"
          className="absolute bottom-24 right-4 z-20 w-28 h-40 sm:w-36 sm:h-48 rounded-2xl bg-slate-900/90 border-2 border-white/20 shadow-2xl overflow-hidden flex flex-col justify-between p-2 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
            <span className="font-bold truncate">{consultation.pet.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="my-auto text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 mx-auto flex items-center justify-center text-blue-300 mb-1">
              <VideoIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-300 block font-semibold">
              Камера питомца
            </span>
          </div>

          <div className="text-[9px] text-slate-400 text-center font-mono">
            {consultation.pet.breed} • {consultation.pet.weightKg} кг
          </div>
        </aside>

        {/* Real-time prescription notification badge floating */}
        {!isDrawerOpen && (
          <button
            type="button"
            onClick={() => {
              setDrawerTab('prescriptions');
              setIsDrawerOpen(true);
            }}
            className="absolute top-20 right-4 z-20 bg-blue-600/90 hover:bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg border border-blue-400/40 flex items-center space-x-2 text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Рецепт обновлен ({draftPrescriptions.length})</span>
          </button>
        )}
      </main>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE CLINICAL OVERLAY DRAWER (DRAWER TABS)      */}
      {/* ========================================================= */}
      {isDrawerOpen && (
        <section
          aria-label="Панель клинических назначений и чата"
          className="absolute inset-x-0 bottom-20 z-40 bg-slate-900/95 border-t border-slate-700/80 rounded-t-3xl shadow-2xl backdrop-blur-xl max-h-[60vh] flex flex-col animate-slideUp"
        >
          {/* Drawer Handle & Tab Switcher */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDrawerTab('prescriptions')}
                className={`py-1.5 px-3 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  drawerTab === 'prescriptions' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Э-Рецепт ({draftPrescriptions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDrawerTab('chat')}
                className={`py-1.5 px-3 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  drawerTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Чат и Фото ({chatMessages.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
            {drawerTab === 'prescriptions' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>Предварительный протокол телемедицины</span>
                  <span className="text-emerald-400 font-mono font-bold">УКЭП активна</span>
                </div>

                <div className="space-y-2">
                  {draftPrescriptions.map((rx, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1"
                    >
                      <div className="flex items-start justify-between">
                        <strong className="text-white text-xs font-bold">{rx.drugName}</strong>
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded">
                          {rx.durationDays} дней
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Дозировка: <strong>{rx.dosage}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">{rx.frequency}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-[10px] text-blue-200 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    Назначения автоматически синхронизируются с Ветпаспортом после завершения видеозвонка.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col h-full">
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        m.sender === 'doctor'
                          ? 'bg-slate-800 text-slate-100 self-start'
                          : 'bg-blue-600 text-white ml-auto'
                      }`}
                    >
                      <div className="text-[9px] opacity-70 mb-0.5">
                        {m.sender === 'doctor' ? consultation.doctor.name : 'Вы'} • {m.time}
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleAttachPhoto}
                    title="Прикрепить фото"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Написать врачу..."
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={handleSendChatMessage}
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 5. BOTTOM CONTROLS BAR                                    */}
      {/* ========================================================= */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-around z-30 select-none">
        {/* Toggle Microphone */}
        <button
          type="button"
          onClick={() => {
            setIsMicMuted((prev) => !prev);
            showToast(isMicMuted ? 'Микрофон включен' : 'Микрофон выключен');
          }}
          aria-label={isMicMuted ? 'Включить микрофон' : 'Выключить микрофон'}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isMicMuted ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Toggle Video */}
        <button
          type="button"
          onClick={() => {
            setIsVideoMuted((prev) => !prev);
            showToast(isVideoMuted ? 'Камера включена' : 'Камера выключена');
          }}
          aria-label={isVideoMuted ? 'Включить камеру' : 'Выключить камеру'}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isVideoMuted ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
        </button>

        {/* Flip Camera */}
        <button
          type="button"
          onClick={() => {
            setIsCameraFront((prev) => !prev);
            showToast(isCameraFront ? 'Переключено на заднюю камеру' : 'Переключено на фронтальную камеру');
          }}
          aria-label="Переключить камеру"
          className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Open Prescriptions / Notes Drawer */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label="Открыть назначения"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isDrawerOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          type="button"
          onClick={handleFinishConsultation}
          aria-label="Завершить консультацию"
          className="w-12 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </footer>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="absolute top-16 inset-x-4 z-50 flex justify-center pointer-events-none animate-slideDown">
          <div className="bg-slate-800/95 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
