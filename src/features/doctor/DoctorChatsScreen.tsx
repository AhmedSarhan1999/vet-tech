import React, { useState } from 'react';
import {
  MessageSquare,
  Video,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  X,
  User,
  Search,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Download,
  ArrowRight,
} from 'lucide-react';
import { DoctorChatRoomModal } from './DoctorChatRoomModal';

export type ChatSubTab = 'CHATS' | 'VIDEO' | 'ARCHIVE';
export type VideoFilter = 'ALL' | 'URGENT' | 'PLANNED' | 'COMPLETED';

export interface DoctorChatsScreenProps {
  readonly onOpenVisit?: (visitId: string) => void;
  readonly initialSubTab?: ChatSubTab;
  readonly onChatOpenChange?: (isOpen: boolean) => void;
}

interface ChatChannel {
  readonly id: string;
  readonly patientName: string;
  readonly breed: string;
  readonly ageWeight: string;
  readonly chipId: string;
  readonly ownerName: string;
  readonly proxyPhone: string;
  readonly topic: string;
  readonly lastMessagePreview: string;
  readonly timestamp: string;
  readonly unreadCount?: number;
  readonly statusText: string;
  readonly hasPrescription?: boolean;
  readonly isPendingReview?: boolean;
}

interface VideoAppointment {
  readonly id: string;
  readonly patientName: string;
  readonly breed: string;
  readonly ageWeight: string;
  readonly chipId: string;
  readonly ownerName: string;
  readonly reason: string;
  readonly scheduledTime: string;
  readonly status: 'UPCOMING_HERO' | 'URGENT_STANDBY' | 'PLANNED';
  readonly escrowAmount: number;
  readonly timeRemaining?: string;
  readonly durationMin: number;
}

interface ArchiveItem {
  readonly id: string;
  readonly patientName: string;
  readonly breed: string;
  readonly ownerName: string;
  readonly consultDate: string;
  readonly protocolNumber: string;
  readonly diagnosis: string;
  readonly escrowAmount: number;
  readonly ukepStatus: string;
}

export const DoctorChatsScreen: React.FC<DoctorChatsScreenProps> = ({
  onOpenVisit: _onOpenVisit,
  initialSubTab = 'CHATS',
  onChatOpenChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ChatSubTab>(initialSubTab);
  const [videoFilter, setVideoFilter] = useState<VideoFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Chat Room state (Dedicated Full-Page Takeover)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Interactive Modals State
  const [isVideoManagerModalOpen, setIsVideoManagerModalOpen] = useState<boolean>(false);
  const [activeWebRtcRoom, setActiveWebRtcRoom] = useState<VideoAppointment | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  // Reschedule Modal State
  const [reschedulingAppointment, setReschedulingAppointment] = useState<VideoAppointment | null>(null);
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('Сегодня, 18:30');

  // Patient Card Inspection State
  const [inspectedPatient, setInspectedPatient] = useState<VideoAppointment | null>(null);

  // Escrow Cancellation Modal State
  const [cancellingAppointment, setCancellingAppointment] = useState<VideoAppointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Channels Dataset
  const channels: ChatChannel[] = [
    {
      id: 'ch-1',
      patientName: 'Хаски Норд',
      breed: 'Сибирский хаски',
      ageWeight: '3 года, 28.4 кг',
      chipId: '643098100234567',
      ownerName: 'Александр В.',
      proxyPhone: '+7 (812) 200-78-19',
      topic: 'Поствакцинальный контроль и термометрия (Nobivac DHPPi)',
      lastMessagePreview: 'Передал замер температуры: 38.6°C (норма) и фото места инъекции на лопатке.',
      timestamp: '14:17',
      unreadCount: 1,
      statusText: 'Окно курации открыто до 22:00',
    },
    {
      id: 'ch-2',
      patientName: 'Кот Маркиз',
      breed: 'Скоттиш-фолд',
      ageWeight: '4 года, 4.6 кг',
      chipId: '643098100554102',
      ownerName: 'Екатерина М.',
      proxyPhone: '+7 (812) 200-44-88',
      topic: 'Динамика приема суспензии и аппетит',
      lastMessagePreview: 'Рвота прекратилась, порцию влажного корма съел полностью. Стул оформлен.',
      timestamp: '13:42',
      statusText: 'Вет-Rx #СПБ-842 прикреплен',
      hasPrescription: true,
    },
    {
      id: 'ch-3',
      patientName: 'Французский бульдог Арчи',
      breed: 'Французский бульдог',
      ageWeight: '2 года, 11.2 кг',
      chipId: '643098100771249',
      ownerName: 'Елена С.',
      proxyPhone: '+7 (812) 200-91-03',
      topic: 'Осмотр ушной раковины по фото',
      lastMessagePreview: 'День 2 из 7 курса ушных капель Суролан. Выделений меньше, но трясет головой.',
      timestamp: '12:05',
      statusText: 'Ожидает ответа врача',
      isPendingReview: true,
    },
    {
      id: 'ch-4',
      patientName: 'Золотистый ретривер Рич',
      breed: 'Голден-ретривер',
      ageWeight: '5 лет, 34.0 кг',
      chipId: '643098100982341',
      ownerName: 'Дмитрий К.',
      proxyPhone: '+7 (812) 200-33-12',
      topic: 'Плановый осмотр после удаления клеща',
      lastMessagePreview: 'Температура 38.4°C, вялости нет, аппетит в норме. Моча светлая.',
      timestamp: '10:30',
      statusText: 'Рекомендации выданы • Контроль через 48 ч',
    },
  ];

  // Video Appointments Dataset
  const heroAppointment: VideoAppointment = {
    id: 'vid-hero',
    patientName: 'Кот Маркиз',
    breed: 'Скоттиш-фолд',
    ageWeight: '4 года, 4.6 кг',
    chipId: '643098100554102',
    ownerName: 'Екатерина М.',
    reason: 'Контроль динамики гастрита и корректировка дозировки омепразола',
    scheduledTime: 'Сегодня, 16:00',
    status: 'UPCOMING_HERO',
    escrowAmount: 1500,
    timeRemaining: 'Начало через 14 минут',
    durationMin: 30,
  };

  const videoAppointments: VideoAppointment[] = [
    {
      id: 'vid-1',
      patientName: 'Корги Барни',
      breed: 'Вельш-корги пемброк',
      ageWeight: '8 мес, 9.5 кг',
      chipId: '643098100883219',
      ownerName: 'Ольга П.',
      reason: 'Подозрение на инородное тело ЖКТ (проглотил часть резиновой игрушки)',
      scheduledTime: 'Срочно (24/7)',
      status: 'URGENT_STANDBY',
      escrowAmount: 1200,
      timeRemaining: 'Ожидание подключения (5 мин standby)',
      durationMin: 20,
    },
    {
      id: 'vid-2',
      patientName: 'Мейн-кун Ася',
      breed: 'Мейн-кун',
      ageWeight: '2 года, 6.2 кг',
      chipId: '643098100319482',
      ownerName: 'Максим С.',
      reason: 'Стойкий кожный зуд и первичный дерматологический сбор анамнеза',
      scheduledTime: 'Сегодня, 17:30',
      status: 'PLANNED',
      escrowAmount: 1500,
      durationMin: 30,
    },
    {
      id: 'vid-3',
      patientName: 'Джек-рассел Майло',
      breed: 'Джек-рассел терьер',
      ageWeight: '3 года, 7.8 кг',
      chipId: '643098100418591',
      ownerName: 'Наталья Б.',
      reason: 'Ортопедический контроль после растяжения скакательного сустава',
      scheduledTime: 'Завтра, 11:00',
      status: 'PLANNED',
      escrowAmount: 1200,
      durationMin: 20,
    },
  ];

  // Archive Dataset
  const archiveItems: ArchiveItem[] = [
    {
      id: 'arch-1',
      patientName: 'Хаски Норд',
      breed: 'Сибирский хаски',
      ownerName: 'Александр В.',
      consultDate: 'Вчера, 18:20',
      protocolNumber: 'ТЕЛЕДОК-2026-104',
      diagnosis: 'Поствакцинальная адаптация без осложнений (Nobivac DHPPi)',
      escrowAmount: 1200,
      ukepStatus: 'УКЭП КриптоПро CSP 5.0 (ГОСТ Р 34.10-2012) • ВСД закрыт',
    },
    {
      id: 'arch-2',
      patientName: 'Кот Симба',
      breed: 'Британская КШ',
      ownerName: 'Марина И.',
      consultDate: '10 окт 2026',
      protocolNumber: 'ТЕЛЕДОК-2026-088',
      diagnosis: 'Коррекция лечебной диетотерапии при ранней стадии ХБП',
      escrowAmount: 1500,
      ukepStatus: 'УКЭП подтвержден • Электронный рецепт ВетИС отправлен',
    },
    {
      id: 'arch-3',
      patientName: 'Бигль Дейзи',
      breed: 'Бигль',
      ownerName: 'Сергей Л.',
      consultDate: '08 окт 2026',
      protocolNumber: 'ТЕЛЕДОК-2026-074',
      diagnosis: 'Оценка хромоты после бега • Разрыв связок исключен',
      escrowAmount: 1200,
      ukepStatus: 'УКЭП подтвержден • Выдано направление на рентген',
    },
  ];

  const filteredChannels = channels.filter((ch) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.patientName.toLowerCase().includes(q) ||
      ch.breed.toLowerCase().includes(q) ||
      ch.ownerName.toLowerCase().includes(q) ||
      ch.topic.toLowerCase().includes(q)
    );
  });

  const filteredVideoAppointments = videoAppointments.filter((item) => {
    if (videoFilter === 'URGENT') return item.status === 'URGENT_STANDBY';
    if (videoFilter === 'PLANNED') return item.status === 'PLANNED';
    if (videoFilter === 'COMPLETED') return false;
    return true;
  });

  const handleConfirmReschedule = () => {
    if (!reschedulingAppointment) return;
    showToast(`Сессия для ${reschedulingAppointment.patientName} перенесена на "${rescheduleSlot}". Клиенту направлено СМС-уведомление.`);
    setReschedulingAppointment(null);
  };

  const handleConfirmCancellation = () => {
    if (!cancellingAppointment) return;
    showToast(`Запись отменена. Эскроу ${cancellingAppointment.escrowAmount} ₽ возвращен владельцу (${cancellingAppointment.ownerName}) по правилам 54-ФЗ.`);
    setCancellingAppointment(null);
    setCancellationReason('');
  };

  if (selectedChatId) {
    const channel = channels.find((c) => c.id === selectedChatId) || channels[0]!;
    return (
      <div className="relative w-full h-full min-h-[100dvh] bg-white flex flex-col max-w-[440px] mx-auto">
        <DoctorChatRoomModal
          channelId={channel.id}
          patientName={channel.patientName}
          breed={channel.breed}
          ageWeight={channel.ageWeight}
          chipId={channel.chipId}
          ownerName={channel.ownerName}
          proxyPhone={channel.proxyPhone}
          topic={channel.topic}
          onClose={() => {
            setSelectedChatId(null);
            if (onChatOpenChange) onChatOpenChange(false);
          }}
          onOpenPrescription={() => {
            showToast('Переход к генерации рецепта ВетИС...');
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-full pb-24 font-sans bg-slate-50/70 max-w-[440px] mx-auto w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-slate-700 animate-fadeIn max-w-[90%]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: STICKY HEADER & CHANNEL STATUS */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-slate-900 leading-tight">
                Вет-консультации и чаты
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                4979-1-ФЗ
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5 flex items-center space-x-1.5">
              <span>Телемедицина СПб • ГОСТ Р 34.12 (Шифрование)</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>На связи до 22:00</span>
              </span>
            </p>
          </div>

          {/* Primary Top Action Button */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('VIDEO');
              setIsVideoManagerModalOpen(true);
            }}
            className="flex items-center space-x-2 py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>Служба видеоприема (Расписание)</span>
          </button>
        </div>

        {/* SECTION 2: SEGMENTED VIEW CONTROLLER */}
        <div className="flex items-center space-x-1.5 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x">
          <button
            type="button"
            onClick={() => setActiveSubTab('CHATS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'CHATS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Курация и вет-чаты (4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('VIDEO')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'VIDEO'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 shrink-0" />
            <span>Видеоконсультации (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ARCHIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              activeSubTab === 'ARCHIVE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>Архив телемедицины</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Search Bar for Channels / Consultations */}
        {activeSubTab !== 'ARCHIVE' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по кличке, породе, владельцу или теме консультации..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 shadow-2xs"
            />
          </div>
        )}

        {/* TAB 1: ACTIVE PATIENT DIALOGUE CHANNELS */}
        {activeSubTab === 'CHATS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Активные каналы наблюдения ({filteredChannels.length})</span>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Защита L3/L4 MTS Exolve
              </span>
            </div>

            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/90 hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black text-slate-900">
                        {channel.patientName}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold">
                        ({channel.breed}, {channel.ageWeight})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">{channel.ownerName}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        Чип: {channel.chipId}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">
                      {channel.timestamp}
                    </span>
                    {channel.unreadCount && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-black text-white bg-blue-600 rounded-full shadow-2xs">
                        {channel.unreadCount} новое
                      </span>
                    )}
                    {channel.hasPrescription && (
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 rounded">
                        Вет-Rx
                      </span>
                    )}
                    {channel.isPendingReview && (
                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-800 bg-amber-50 border border-amber-200 rounded">
                        Ответить
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic & Last Message Preview */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{channel.topic}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                    {channel.lastMessagePreview}
                  </p>
                </div>

                {/* Card Footer Status & Action */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-semibold text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{channel.statusText}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChatId(channel.id);
                      if (onChatOpenChange) onChatOpenChange(true);
                    }}
                    className="flex items-center space-x-1 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-transparent text-xs font-black transition-all cursor-pointer"
                  >
                    <span>Открыть диалог</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: INTEGRATED VIDEO CONSULTATION SCHEDULE & LOG */}
        {activeSubTab === 'VIDEO' && (
          <div className="space-y-4">
            {/* Telemedicine Room Quick Launcher Hero Card */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-5 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-700/60 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                    Ближайшая защищенная видеокомната
                  </span>
                </div>
                <span className="text-xs font-black bg-blue-700/80 px-2.5 py-1 rounded-xl border border-blue-500/60 text-white font-mono">
                  {heroAppointment.timeRemaining}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-black">{heroAppointment.patientName}</h2>
                  <span className="text-xs text-blue-200">
                    ({heroAppointment.breed}, {heroAppointment.ageWeight})
                  </span>
                </div>
                <p className="text-xs text-blue-100 font-medium">
                  Владелец: {heroAppointment.ownerName} • {heroAppointment.scheduledTime} ({heroAppointment.durationMin} мин)
                </p>
                <p className="text-xs text-blue-200/90 leading-relaxed pt-1">
                  Причина: {heroAppointment.reason}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center space-x-3 text-xs text-blue-200 font-medium">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Эскроу: {heroAppointment.escrowAmount} ₽</span>
                  </span>
                  <span>•</span>
                  <span>WebRTC HD 1080p</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveWebRtcRoom(heroAppointment)}
                  className="w-full sm:w-auto py-2.5 px-5 bg-white text-blue-900 hover:bg-blue-50 rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Video className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Войти в защищенную видеокомнату (WebRTC) →</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters for Video Calls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x">
                <button
                  type="button"
                  onClick={() => setVideoFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    videoFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Все звонки
                </button>
                <button
                  type="button"
                  onClick={() => setVideoFilter('URGENT')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    videoFilter === 'URGENT'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Срочные (24/7)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoFilter('PLANNED')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    videoFilter === 'PLANNED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Плановые
                </button>
                <button
                  type="button"
                  onClick={() => setVideoFilter('COMPLETED')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    videoFilter === 'COMPLETED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Завершенные
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-400">
                Записей: {filteredVideoAppointments.length}
              </span>
            </div>

            {/* Video Appointments List */}
            <div className="space-y-3">
              {filteredVideoAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/90 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-black text-slate-900">{appt.patientName}</h3>
                        <span className="text-[10px] text-slate-500 font-bold">
                          ({appt.breed}, {appt.ageWeight})
                        </span>
                        {appt.status === 'URGENT_STANDBY' && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                            Срочный триаж 24/7
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Владелец: <span className="font-semibold text-slate-900">{appt.ownerName}</span> • Чип ISO: {appt.chipId}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                        {appt.escrowAmount} ₽ в эскроу
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1 font-bold">
                        {appt.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                      {appt.reason}
                    </p>
                    {appt.timeRemaining && (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center space-x-1 pl-1">
                        <Clock className="w-3 h-3" />
                        <span>{appt.timeRemaining}</span>
                      </span>
                    )}
                  </div>

                  {/* Organization Actions Per Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setReschedulingAppointment(appt);
                        }}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        Перенести время звонка
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setInspectedPatient(appt);
                        }}
                        className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        Открыть веткарту пациента
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCancellingAppointment(appt);
                      }}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    >
                      Отменить с возвратом эскроу
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ARCHIVE OF TELEMEDICINE WITH UKEP */}
        {activeSubTab === 'ARCHIVE' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Завершенные удаленные приемы с УКЭП ({archiveItems.length})</span>
              <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                ГОСТ Р 34.10-2012
              </span>
            </div>

            {archiveItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/90 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-black text-slate-900">{item.patientName}</h3>
                      <span className="text-[10px] text-slate-500 font-bold">({item.breed})</span>
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {item.protocolNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Владелец: {item.ownerName} • Дата: {item.consultDate}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                    +{item.escrowAmount} ₽
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    Клиническое заключение
                  </span>
                  <p className="text-xs font-medium text-slate-800">{item.diagnosis}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-teal-900 font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{item.ukepStatus}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => showToast(`Скачивание протокола #${item.protocolNumber} с цифровой подписью УКЭП...`)}
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Скачать PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 2: WEBRTC VIDEO CONSULTATION ROOM (CONFINED TO MOBILE SHELL) */}
      {activeWebRtcRoom && (
        <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col font-sans w-full h-full overflow-hidden max-w-[440px] mx-auto">
          {/* Top Video Room Bar */}
          <div className="p-4 bg-slate-900/80 backdrop-blur-md flex items-center justify-between text-white shrink-0 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-black leading-tight">
                  {activeWebRtcRoom.patientName} • WebRTC HD Консультация
                </h3>
                <span className="text-[10px] text-slate-400">
                  Владелец: {activeWebRtcRoom.ownerName} • Шифрование DTLS-SRTP (ГОСТ Р 34.12)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-slate-800 px-2.5 py-1 rounded-xl text-emerald-400 border border-slate-700">
                08:42 • 1080p
              </span>
            </div>
          </div>

          {/* Main Video Stage */}
          <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
            {/* Remote Patient Video Placeholder */}
            <div className="w-full max-w-sm h-[60vh] rounded-3xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-6 text-slate-300 relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mb-3">
                <Video className="w-8 h-8" />
              </div>
              <p className="text-sm font-black text-white">{activeWebRtcRoom.patientName}</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-relaxed">
                Трансляция со смартфона владельца ({activeWebRtcRoom.ownerName}) активна. Задержка 22 мс, потеря пакетов 0.0%.
              </p>

              {/* PiP Clinician Self View */}
              <div className="absolute bottom-3 right-3 w-28 h-22 rounded-2xl bg-slate-950 border-2 border-slate-700 shadow-xl flex flex-col items-center justify-center text-center p-1.5">
                <span className="text-[9px] font-black text-emerald-400">Д-р Романов К. В.</span>
                <span className="text-[8px] text-slate-400">Выездной врач</span>
                {isVideoOff && (
                  <span className="text-[8px] text-rose-400 font-bold mt-0.5">Камера выкл</span>
                )}
              </div>
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="p-3.5 bg-slate-900/90 backdrop-blur-md flex items-center justify-center space-x-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isMicMuted ? 'Включить микрофон' : 'Выключить микрофон'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Включить камеру' : 'Выключить камеру'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                showToast('Консультация успешно завершена. Протокол сформирован для подписания УКЭП.');
                setActiveWebRtcRoom(null);
              }}
              className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <PhoneOff className="w-4 h-4 shrink-0" />
              <span>Завершить и УКЭП</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: RESCHEDULE SLOT DIALOG (CONFINED TO MOBILE SHELL) */}
      {reschedulingAppointment && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 max-w-[440px] mx-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Перенос времени видеоприема
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Выберите новый интервал для пациента{' '}
              <span className="font-bold text-slate-900">{reschedulingAppointment.patientName}</span>{' '}
              ({reschedulingAppointment.ownerName}):
            </p>

            <div className="space-y-2">
              {['Сегодня, 18:30', 'Сегодня, 19:30', 'Завтра, 10:00', 'Завтра, 12:30'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setRescheduleSlot(slot)}
                  className={`w-full p-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                    rescheduleSlot === slot
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{slot}</span>
                  {rescheduleSlot === slot && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setReschedulingAppointment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Подтвердить перенос
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PATIENT CARD INSPECTION (CONFINED TO MOBILE SHELL) */}
      {inspectedPatient && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 max-w-[440px] mx-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Электронная веткарта пациента (ВетИС)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPatient(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1">
              <h4 className="text-sm font-black text-blue-950">{inspectedPatient.patientName}</h4>
              <p className="text-xs text-blue-800">
                {inspectedPatient.breed} • {inspectedPatient.ageWeight} • Чип: {inspectedPatient.chipId}
              </p>
              <p className="text-[11px] text-blue-700">
                Владелец: {inspectedPatient.ownerName}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-900 block mb-1">
                  Анамнез и вакцинации (Хорриот):
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nobivac DHPPi + Rabies (действует до 15.11.2026). Аллергические реакции на бета-лактамы не зафиксированы.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-900 block mb-1">Причина текущей записи:</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{inspectedPatient.reason}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectedPatient(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Закрыть веткарту
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ESCROW CANCELLATION DIALOG (CONFINED TO MOBILE SHELL) */}
      {cancellingAppointment && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 max-w-[440px] mx-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Отмена сессии и возврат эскроу
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCancellingAppointment(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Вы отменяете сессию для{' '}
              <span className="font-bold text-slate-900">{cancellingAppointment.patientName}</span>. Захолдированная сумма{' '}
              <span className="font-mono font-bold text-slate-900">{cancellingAppointment.escrowAmount} ₽</span> будет мгновенно разблокирована на карте владельца в соответствии с 54-ФЗ.
            </p>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Клиническое обоснование отмены:
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Укажите причину (например: состояние стабилизировалось / перенаправлен в стационар)..."
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 h-24 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingAppointment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Подтвердить возврат средств
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: VIDEO MANAGER DRAWER / MODAL (CONFINED TO MOBILE SHELL) */}
      {isVideoManagerModalOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 max-w-[440px] mx-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Служба видеоприема и телемедицинский журнал
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoManagerModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-950 font-bold space-y-1">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Защищенный видеокабинет WebRTC готов к работе</span>
              </div>
              <p className="text-[11px] text-blue-800 font-medium">
                Все сессии видеосвязи защищены сквозным шифрованием по ГОСТ Р 34.12. Записи консультаций архивируются с протоколом УКЭП в соответствии с требованиями Закона РФ № 4979-1.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Запланированные сессии на сегодня
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">16:00 • Кот Маркиз</span>
                    <span className="text-[10px] text-slate-500 block">Динамика гастрита (1 500 ₽)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsVideoManagerModalOpen(false);
                      setActiveWebRtcRoom(heroAppointment);
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                  >
                    Подключиться
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">17:30 • Мейн-кун Ася</span>
                    <span className="text-[10px] text-slate-500 block">Дерматологический осмотр (1 500 ₽)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">Ожидает</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsVideoManagerModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Закрыть окно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
