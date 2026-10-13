import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  AlertTriangle,
  PhoneCall,
  Volume2,
  BellRing,
  MapPin,
  CheckCircle2,
  Radio,
  Thermometer,
  BatteryCharging,
  Building,
  Check,
  MessageSquare,
  X,
} from 'lucide-react';

export interface AdminSupportScreenProps {
  readonly onOpenSafety?: () => void;
}

export type SupportQueueFilter = 'ALL' | 'CLINICIANS' | 'OWNERS' | 'ARCHIVE';

interface SupportTicket {
  readonly id: string;
  readonly title: string;
  readonly subject: string;
  readonly author: string;
  readonly category: 'CLINICIANS' | 'OWNERS';
  readonly timeRemaining: string;
  readonly priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  readonly isResolved?: boolean;
}

export const AdminSupportScreen: React.FC<AdminSupportScreenProps> = ({
  onOpenSafety,
}) => {
  // SLA Timer Countdown state (starts at 3 min 17 sec)
  const [secondsLeft, setSecondsLeft] = useState<number>(197);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [slotExtended, setSlotExtended] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active call modal / simulation
  const [activeCallType, setActiveCallType] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('ticket-1');
  const [filter, setFilter] = useState<SupportQueueFilter>('ALL');

  useEffect(() => {
    if (isResolved || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isResolved, secondsLeft]);

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResolveIssue = () => {
    setIsResolved(true);
    showToast('Инцидент успешно закрыт: Консьерж открыл электрозамок калитки. Врач вошел в парадную.');
  };

  const handleExtendSlot = () => {
    setSlotExtended(true);
    setSecondsLeft((prev) => prev + 300);
    showToast('Слот визита продлен на +5 минут. Врачу компенсирована задержка без штрафа по SLA.');
  };

  const tickets: SupportTicket[] = [
    {
      id: 'ticket-1',
      title: 'Логистический барьер: Закрытый двор',
      subject: 'Чкаловский пр., д. 15, кв. 8 • Хаски Норд',
      author: 'Д-р Соколова В. А. (Борт Вет-04)',
      category: 'CLINICIANS',
      timeRemaining: formatCountdown(secondsLeft),
      priority: 'HIGH',
    },
    {
      id: 'ticket-2',
      title: 'Повторная выгрузка ВСД в Меркурий XML',
      subject: 'Семья Ивановых • Nobivac Rabies',
      author: 'Александр И. (Куратор)',
      category: 'OWNERS',
      timeRemaining: '14:20',
      priority: 'MEDIUM',
    },
    {
      id: 'ticket-3',
      title: 'Проверка аудиоканала телемедицины WebRTC',
      subject: 'Кот Маркиз • Плановая консультация',
      author: 'Екатерина М. (Владелец)',
      category: 'OWNERS',
      timeRemaining: '28:45',
      priority: 'NORMAL',
    },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    if (filter === 'CLINICIANS') return t.category === 'CLINICIANS';
    if (filter === 'OWNERS') return t.category === 'OWNERS';
    return false;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-slate-50/60 min-h-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2.5 shadow-xl animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Call Overlay Modal */}
      {activeCallType && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-blue-600 animate-pulse" />
                <h3 className="text-sm font-black text-slate-900">
                  {activeCallType}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCallType(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-slate-900">
                Соединение через корпоративную ВАТС МегаФон / MTS Exolve
              </p>
              <p className="text-[11px] text-slate-500">
                Линия активна • 00:14 • Запись разговора включена (152-ФЗ)
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveCallType(null);
                showToast('Разговор завершен. Консьерж подтвердил открытие калитки.');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Завершить вызов
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: EMERGENCY SUPPORT CALLOUT HEADER */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-black text-slate-900 leading-tight">
                  Логистический барьер доступа • Закрытый двор и домофон не отвечает
                </h1>
                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                  Тикет #СПБ-ВЕТ-2026-904
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Оперативный хелпдеск зообезопасности и координации выездных экипажей 24/7
              </p>
            </div>
          </div>

          {/* SLA Countdown Badge */}
          <div className="flex items-center space-x-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black flex items-center space-x-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-rose-600 animate-spin" />
              <span>SLA ТАЙМЕР: {formatCountdown(secondsLeft)}</span>
              <span className="text-[10px] text-rose-600 font-normal">(из 05:00 мин)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Статус экипажа: Врач ожидает у калитки ворот
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 font-bold">Вызов #ВЕТ-7042</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Норматив регламента доезда: до 20 минут
          </span>
        </div>
      </div>

      {/* SECTION 2 & 3: TWO-COLUMN WORK AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Doctor & Location Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
            {/* Doctor & Patient Info */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Выездной специалист на адресе:
                </span>
                <h2 className="text-sm font-black text-slate-900 leading-tight">
                  Д-р Соколова В. А. (Экипаж №04, Петроградский кластер)
                </h2>
                <p className="text-xs text-slate-600">
                  Ветеринарный терапевт / хирург • Renault Duster #14
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Пациент на приеме:
                </span>
                <span className="text-xs font-black text-slate-900">
                  Хаски Норд (3 года, 28.4 кг)
                </span>
              </div>
            </div>

            {/* Target Address Capsule */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>г. Санкт-Петербург, Чкаловский пр., д. 15, кв. 8</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">Подъезд 2, этаж 4</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Куратор: Смирнов А. Н. • Домофон 8# (сбрасывает соединение)
              </p>
            </div>

            {/* Field Message from Doctor's Tablet */}
            <div className="p-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/50 rounded-2xl border-l-4 border-amber-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>Сообщение с носимого планшета врача в поле:</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">14:38:12 МСК</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed italic">
                «Код домофона 8# сбрасывает вызов. Ворота во двор закрыты на электрозамок. Владелец собаки занят подготовкой питомца к фиксации (намордник надет, хаски изолирован в холле). Стою у калитки с термоконтейнером вакцин (+4.2°C) и портативным RFID-сканером. Нужен удаленный звонок консьержу!»
              </p>
            </div>

            {/* Biosecurity Cold-Chain & Hardware Status Telemetry */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Термобокс</span>
                  <span className="font-mono font-black text-emerald-700">+4.2°C Норма</span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center space-x-2">
                <BatteryCharging className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Планшет врача</span>
                  <span className="font-mono font-black text-blue-700">89% заряд</span>
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-200 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">ГЛОНАСС точка</span>
                  <span className="font-mono font-black text-teal-700">У калитки ворот</span>
                </div>
              </div>
            </div>

            {/* OPERATIONAL DISPATCH ACTIONS (3 Tactile Triggers) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Оперативные триггеры диспетчерского реагирования:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Action 1: Call Concierge via VATS */}
                <button
                  type="button"
                  onClick={() => setActiveCallType('Звонок в ТСЖ / Консьержу дома (+7 812 235-••-90)')}
                  className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-xs transition-all flex flex-col items-center justify-center text-center space-y-1 cursor-pointer active:scale-98"
                >
                  <Building className="w-4 h-4 shrink-0" />
                  <span>Позвонить в ТСЖ через ВАТС</span>
                  <span className="text-[9px] font-normal opacity-80">Пост охраны: +7 812 235-••-90</span>
                </button>

                {/* Action 2: Urgent Client Push Alert */}
                <button
                  type="button"
                  onClick={() => {
                    showToast('Экстренный звуковой пуш-алерт направлен на iPhone куратора в обход Silent Mode.');
                  }}
                  className="py-3 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-black shadow-xs transition-all flex flex-col items-center justify-center text-center space-y-1 cursor-pointer active:scale-98"
                >
                  <BellRing className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>Экстренный звуковой пуш</span>
                  <span className="text-[9px] font-normal opacity-80">Обход беззвучного режима</span>
                </button>

                {/* Action 3: Doctor Radio Intercom */}
                <button
                  type="button"
                  onClick={() => setActiveCallType('Защищенный радиоканал с экипажем Д-ра Соколовой')}
                  className="py-3 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xs transition-all flex flex-col items-center justify-center text-center space-y-1 cursor-pointer active:scale-98"
                >
                  <Volume2 className="w-4 h-4 shrink-0" />
                  <span>Открыть радиоканал</span>
                  <span className="text-[9px] font-normal opacity-80">Шифрованный MTS Exolve</span>
                </button>
              </div>
            </div>

            {/* Resolution Console Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleResolveIssue}
                  disabled={isResolved}
                  className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{isResolved ? 'Проблема решена • Доступ открыт' : 'Проблема решена + Доступ обеспечен'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExtendSlot}
                  disabled={slotExtended}
                  className="py-3 px-4 bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {slotExtended ? 'Слот продлен (+5 мин)' : '+5 мин к слоту (без штрафа ветврачу)'}
                </button>
              </div>

              {onOpenSafety && (
                <button
                  type="button"
                  onClick={onOpenSafety}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Эскалация в службу зоо-безопасности (SOS) →</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Support Queue Sidebar & Channel Health (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Support Queue Sidebar */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Очередь тикетов помощи ({tickets.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Диспетчерский пул
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'Все (3)' },
                { id: 'CLINICIANS', label: 'Врачи (1)' },
                { id: 'OWNERS', label: 'Клиенты (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id as SupportQueueFilter)}
                  className={`py-1 px-2.5 rounded-xl text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                    filter === f.id
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div className="space-y-2">
              {filteredTickets.map((t) => {
                const isSelected = selectedTicketId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {t.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          t.priority === 'HIGH'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {t.timeRemaining}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate">
                      {t.subject}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>{t.author}</span>
                      <span className="font-bold text-blue-700">В работе</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Telephony & Channel Health Indicators */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Каналы телефонии и связи
              </h3>
              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Норма
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">ВАТС МегаФон:</span>
                <span className="font-bold text-emerald-700">12 операторов online</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">Шлюз ВетИС Хорриот:</span>
                <span className="font-bold text-emerald-700">Синхронизация 0.4 сек</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">WebRTC Opus кодек:</span>
                <span className="font-bold text-emerald-700">Пинг 18 мс, 48 kHz</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-snug">
              Журнал событий: 14:39:04 — Диспетчер Кузнецов И. В. инициировал соединение с постом ТСЖ дома №15.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
