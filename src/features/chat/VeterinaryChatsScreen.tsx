import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useDragScroll } from '@/shared/lib/use-drag-scroll';
import {
  ArrowLeft,
  Search,
  Bell,
  ShieldCheck,
  Lock,
  Video,
  Camera,
  Thermometer,
  Clock,
  PhoneCall,
  Check,
  Send,
  FileText,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

export interface ChatMessage {
  readonly id: string;
  readonly sender: 'doctor' | 'user' | 'system';
  readonly senderName: string;
  readonly text: string;
  readonly timestamp: string;
  readonly attachmentType?: 'photo' | 'thermometry' | 'document';
  readonly attachmentData?: string;
  readonly signatureVerified?: boolean;
}

export interface VeterinaryChatsScreenProps {
  readonly onBack?: () => void;
  readonly initialChatId?: string | null;
  readonly onProfileClick?: () => void;
  readonly onNavigateToPassport?: (petId?: string) => void;
  readonly onOpenTelehealth?: () => void;
}

export const VeterinaryChatsScreen: React.FC<VeterinaryChatsScreenProps> = ({
  onBack,
  initialChatId = null,
  onProfileClick,
  onNavigateToPassport,
  onOpenTelehealth,
}) => {
  const { user } = useAuth();

  // Scroll ref for filter pills
  const dragScrollRef = useDragScroll<HTMLDivElement>();

  // State management
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
  const [activeFilter, setActiveFilter] = useState<'all' | 'nord' | 'marquis'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Video Modal Simulation
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [videoConnecting, setVideoConnecting] = useState<boolean>(false);

  // Messages in Nord curatorship thread
  const [messages, setMessages] = useState<readonly ChatMessage[]>([
    {
      id: 'm1',
      sender: 'doctor',
      senderName: 'Д-р Романов К. В.',
      text: 'Как самочувствие Норда после вакцинации? Проверьте температуру электронным термометром и прикрепите фото места инъекции. Аппетит восстановился?',
      timestamp: '15:42',
      signatureVerified: true,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      senderName: user?.displayName ?? 'Владелец',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    showToast('Сообщение передано по защищенному каналу ВетИС');

    // Simulated doctor response after 2 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-doc-${Date.now()}`,
          sender: 'doctor',
          senderName: 'Д-р Романов К. В.',
          text: 'Принято. Показатели в норме, продолжайте наблюдение за аппетитом. При любых изменениях пишите сюда.',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          signatureVerified: true,
        },
      ]);
    }, 2000);
  };

  const handleQuickThermometry = () => {
    const tempMsg: ChatMessage = {
      id: `m-temp-${Date.now()}`,
      sender: 'user',
      senderName: user?.displayName ?? 'Владелец',
      text: 'Замер температуры: 38.5°C (в пределах нормы). Место укола без отека.',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      attachmentType: 'thermometry',
      attachmentData: '38.5°C',
    };
    setMessages((prev) => [...prev, tempMsg]);
    showToast('Данные термометрии 38.5°C отправлены врачу ✓');
  };

  const handleQuickPhoto = () => {
    const photoMsg: ChatMessage = {
      id: `m-photo-${Date.now()}`,
      sender: 'user',
      senderName: user?.displayName ?? 'Владелец',
      text: 'Фото места инъекции в области левой лопатки: гиперемии и уплотнений нет.',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      attachmentType: 'photo',
      attachmentData: 'photo_injection_site.jpg',
    };
    setMessages((prev) => [...prev, photoMsg]);
    showToast('Фото места инъекции прикреплено к протоколу курации ✓');
  };

  const handleStartVideoCall = () => {
    setIsVideoModalOpen(true);
    setVideoConnecting(true);
    setTimeout(() => {
      setVideoConnecting(false);
    }, 2500);
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

  // =========================================================================
  // VIEW B: ACTIVE CHAT THREAD ROOM (DR. ROMANOV & NORD)
  // =========================================================================
  if (selectedChatId === 'nord-curatorship' || selectedChatId === 'active-chat') {
    return (
      <div className="min-h-full pb-20 text-slate-900 bg-slate-50 flex flex-col font-sans">
        {/* Thread Header */}
        <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedChatId(null)}
                aria-label="Назад к списку чатов"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
              </button>

              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  РК
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-sm font-black text-slate-900 truncate leading-tight">
                    Д-р Романов К. В.
                  </h1>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Онлайн
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  Курация: Норд (Хаски, 28.4 кг) • До 22:00
                </p>
              </div>
            </div>

            {/* Quick Actions in Thread */}
            <div className="flex items-center space-x-1 shrink-0">
              <a
                href="tel:+78124201503"
                aria-label="Позвонить лечащему врачу"
                className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleStartVideoCall}
                aria-label="Начать видеосвязь"
                className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secure Channel Badge */}
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center space-x-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>ГОСТ Р 34.12 • Шифрование ВетИС</span>
            </span>
            <span>Сессия #CUR-7841</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
          {/* Patient Context Pill */}
          <div className="p-2.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-center space-y-0.5">
            <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">
              Пациент: Норд • Сибирский хаски (28.4 кг)
            </span>
            <p className="text-[11px] text-blue-950 font-medium">
              Поствакцинальный контроль (Nobivac DHPPi) • Чип #643098100234567
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isDoctor = msg.sender === 'doctor';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDoctor ? 'items-start' : 'items-end'} space-y-1 animate-fadeIn`}
              >
                <span className="text-[10px] font-bold text-slate-400 px-1">
                  {msg.senderName} • {msg.timestamp}
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                    isDoctor
                      ? 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
                      : 'bg-blue-600 text-white rounded-tr-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Doctor digital signature footer */}
                  {msg.signatureVerified && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center space-x-1 text-[9px] text-emerald-700 font-bold font-mono">
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                      <span>УКЭП врача подтверждена (ВетИС #78-VET)</span>
                    </div>
                  )}

                  {/* Attachment indicators */}
                  {msg.attachmentType === 'thermometry' && (
                    <div className="mt-2 p-1.5 rounded-lg bg-blue-700 text-white font-mono font-bold text-[10px] flex items-center space-x-1">
                      <Thermometer className="w-3 h-3 text-amber-300" />
                      <span>Температура: {msg.attachmentData}</span>
                    </div>
                  )}

                  {msg.attachmentType === 'photo' && (
                    <div className="mt-2 p-1.5 rounded-lg bg-blue-700 text-white font-mono font-bold text-[10px] flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-cyan-300" />
                      <span>Фотоприложение сохранено в веткарте</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Diagnostic Triggers */}
        <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={handleQuickThermometry}
            className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>Термометрия (38.5°C)</span>
          </button>

          <button
            type="button"
            onClick={handleQuickPhoto}
            className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Фото места укола</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-slate-200/80 px-4 py-2.5 sticky bottom-0 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={handleQuickPhoto}
              aria-label="Прикрепить фотографию"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Сообщение лечащему врачу..."
              className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Отправить сообщение"
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-xs ${
                inputText.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW A: MAIN VETERINARY CHATS HUB
  // =========================================================================
  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/60 font-sans">
      {/* ========================================================= */}
      {/* A. STICKY HEADER & REGULATORY BANNER                      */}
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
                Ветеринарные чаты
              </h1>
              <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                Телеветеринария и курация питомцев СПб
              </p>
            </div>
          </div>

          {/* Quick Action Icons & User Avatar */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {onOpenTelehealth && (
              <button
                type="button"
                onClick={onOpenTelehealth}
                aria-label="Телемед-Хаб видеоприемов"
                className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer border border-blue-200"
                title="Телемед-Хаб видеоприемов"
              >
                <Video className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Поиск диалогов"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isSearchOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => showToast('Новых системных уведомлений нет • Все каналы активны')}
              aria-label="Уведомления"
              className="relative w-8 h-8 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            </button>

            <button
              type="button"
              onClick={onProfileClick}
              aria-label="Профиль пользователя"
              className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ml-0.5 cursor-pointer"
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
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="pt-2.5 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по врачам, диагнозам или питомцам..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Regulatory Ribbon */}
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center space-x-1 font-bold text-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>ФГИС «ВетИС» (Хорриот)</span>
          </div>
          <span className="text-slate-400 font-medium">Закон РФ № 4979-1 «О ветеринарии»</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* B. SECURE TELE-CONSILIUM INFO BANNER (GOST R 34.12)       */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-lg shadow-blue-950/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-blue-300">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black text-white">
                Защищенный ветеринарный телеконсилиум
              </h2>
            </div>
            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30">
              ВЕТИС ГОСТ Р 34.12
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-blue-100/90">
            Консультации аккредитованных ветеринарных врачей СПбГУВМ. Фотофиксация динамики, загрузка анализов и результатов экспресс-тестов (Парво/Панлейкопения), ветеринарные назначения с УКЭП врача передаются в электронный ветпаспорт животного.
          </p>
        </div>

        {/* ========================================================= */}
        {/* C. CONTEXTUAL CONVERSATION FILTER PILLS                   */}
        {/* ========================================================= */}
        <div
          ref={dragScrollRef}
          className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5"
        >
          {/* Tab 1: All */}
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`py-2 px-3.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
            }`}
          >
            Все диалоги (3)
          </button>

          {/* Tab 2: Nord Therapy */}
          <button
            type="button"
            onClick={() => setActiveFilter('nord')}
            className={`py-2 px-3.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
              activeFilter === 'nord'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>● Терапия: Норд (Хаски)</span>
          </button>

          {/* Tab 3: Marquis Gastro */}
          <button
            type="button"
            onClick={() => setActiveFilter('marquis')}
            className={`py-2 px-3.5 rounded-2xl text-xs font-black transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
              activeFilter === 'marquis'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Гастроэнтерология: Маркиз</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* D. ACTIVE CLINICAL DIALOGUES LIST                         */}
        {/* ========================================================= */}
        <div className="space-y-3.5">
          {/* DIALOGUE 1: DR. ROMANOV & NORD (PRIMARY ACTIVE CURATORSHIP) */}
          {(activeFilter === 'all' || activeFilter === 'nord') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-blue-600/30 shadow-md space-y-3 hover:border-blue-600 transition-all">
              {/* Doctor Header & Timestamp */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-3">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                      РК
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        Д-р Романов К. В.
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Онлайн
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ветврач-терапевт, хирург • СПбГУВМ
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">15:42</span>
                  <div className="mt-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                      ● 1 новое
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Context Capsule */}
              <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-950 font-medium flex items-center justify-between flex-wrap gap-1">
                <span>Пациент: <strong>Норд</strong> (Сибирский хаски, 3 года, 28.4 кг)</span>
                <span className="font-mono text-[10px] text-blue-800">Чип: ISO 643098100234567</span>
              </div>

              {/* Clinical Topic */}
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Поствакцинальный контроль и термометрия (Nobivac DHPPi)</span>
              </div>

              {/* Message Excerpt Quote */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs italic text-slate-700 leading-relaxed border-l-4 border-l-blue-600">
                «Как самочувствие Норда после вакцинации? Проверьте температуру электронным термометром и прикрепите фото места инъекции. Аппетит восстановился?»
              </div>

              {/* Operational & Working Hours Pills */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2 pt-1">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[10px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Канал курации открыт до 22:00</span>
                </span>

                <span className="text-[10px] text-slate-400">
                  УКЭП подтверждена
                </span>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChatId('nord-curatorship');
                    handleQuickPhoto();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span className="truncate">Фото и замер</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChatId('nord-curatorship')}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer active:scale-98"
                >
                  <span>Ответить</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DIALOGUE 2: DR. SMIRNOVA & MARQUIS (FOLLOW-UP GASTROENTEROLOGY) */}
          {(activeFilter === 'all' || activeFilter === 'marquis') && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3 hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                    СЕ
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                        Д-р Смирнова Е. А.
                      </h3>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Телекурация
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ветеринарный гастроэнтеролог
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-400">Вчера, 18:20</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex items-center justify-between">
                <span>Пациент: <strong>Маркиз</strong> (Скоттиш-фолд, 4 года, 4.6 кг)</span>
                <span className="font-mono text-[10px] text-slate-500">Ветпаспорт #ВЕТ-108</span>
              </div>

              <div className="text-xs font-bold text-slate-900">
                Обострение гастрита • Диета Gastrointestinal
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed italic border-l-4 border-l-teal-600">
                «Результаты биохимии и УЗИ проверены. Дозировку суспензии скорректировала под вес. Диету продолжайте 14 дней.»
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 flex-wrap gap-2">
                <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                  ✓ ВСД Меркурий • Рецепт в веткарте ↗
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToPassport) {
                      onNavigateToPassport('marquis');
                    } else {
                      showToast('Рецепт и назначения синхронизированы в Ветпаспорте Маркиза');
                    }
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Открыть диалог</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* DIALOGUE 3: EMERGENCY NIGHT CONSILIUM ARCHIVE */}
          {activeFilter === 'all' && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3 opacity-95">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      Северо-Западный дежурный телемед-пост
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Экстренная ночная служба 24/7
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-slate-400">8 окт</span>
              </div>

              <div className="text-xs font-bold text-slate-900">
                Пациент: Норд (Хаски) • Ночной телеконсилиум
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed italic">
                «Экстренная онлайн-консультация завершена: исключен заворот желудка. Рекомендован очный дневной осмотр...»
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[10px]">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Сессия завершена (УКЭП активна)</span>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Протокол ночного телеконсилиума от 8 окт (PDF) сформирован')}
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Протокол осмотра (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* E. 24/7 URGENT VIDEO CONSULTATION HERO CARD               */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-5 text-white shadow-xl shadow-blue-600/20 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-xs">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">
                  ТЕЛЕМЕДИЦИНА 24/7
                </span>
                <h2 className="text-sm sm:text-base font-black leading-tight text-white mt-0.5">
                  Срочный видеовопрос ветврачу 24/7
                </h2>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-xs text-white font-black text-xs shrink-0 border border-white/20">
              от 1 200 ₽
            </span>
          </div>

          <p className="text-xs leading-relaxed text-blue-100">
            Дежурный ветеринар подключится по защищенному видеоканалу за 5 минут. Экспресс-оценка состояния питомца (слизистые, одышка, рвота, болевой синдром), назначение доврачебной помощи.
          </p>

          <button
            type="button"
            onClick={() => {
              if (onOpenTelehealth) {
                onOpenTelehealth();
              } else {
                handleStartVideoCall();
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
          >
            <Video className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Начать ветеринарную видеоконсультацию 24/7</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* F. ROSSELKHOZNADZOR GATEWAY FOOTER & HOTLINE              */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Шлюз передачи данных сертифицирован Россельхознадзором и Управлением ветеринарии СПб. Фиксация сообщений и фото-видео материалов регламентирована Законом РФ № 4979-1 «О ветеринарии» и ст. 9 ФЗ-152.
            </p>
          </div>

          <div className="text-center pt-2 space-y-1">
            <a
              href="tel:+78124201503"
              className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>8 (812) 420-15-03 • Диспетчерская выездной ветслужбы СПб 24/7</span>
            </a>
            <p className="text-[10px] text-slate-400">
              ГОСТ Р 34.12 • Единый контур телеветеринарии Санкт-Петербурга
            </p>
          </div>
        </div>
      </div>

      {/* Video Call Modal Simulation */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="relative mx-auto w-20 h-20 rounded-full bg-blue-600/30 flex items-center justify-center border-2 border-blue-500">
              <Video className="w-10 h-10 text-blue-400 animate-pulse" />
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black">
                {videoConnecting ? 'Защищенное соединение...' : 'Дежурный ветврач на связи!'}
              </h3>
              <p className="text-xs text-slate-400">
                {videoConnecting
                  ? 'Поиск свободного аккредитованного специалиста СПбГУВМ (ETA ~15 сек)...'
                  : 'Канал защищен шифрованием ГОСТ Р 34.12 • Видеопоток активен'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              ВетЭскроу: 1 200 ₽ заблокировано до завершения онлайн-приема.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Завершить вызов
              </button>
            </div>
          </div>
        </div>
      )}

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
