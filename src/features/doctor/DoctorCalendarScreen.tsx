import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Coffee,
  Video,
  Car,
  Check,
} from 'lucide-react';

export interface DoctorCalendarScreenProps {
  readonly onBack: () => void;
  readonly onSelectVisit?: (visitId: string) => void;
}

interface CalendarDay {
  readonly dateStr: string;
  readonly dayOfWeek: string;
  readonly dayNumber: number;
  readonly isToday: boolean;
  readonly slotsCount: number;
  readonly maxSlots: number;
  readonly isDisinfectionDay?: boolean;
}

const WEEK_DAYS: readonly CalendarDay[] = [
  { dateStr: '2026-10-12', dayOfWeek: 'Пн', dayNumber: 12, isToday: false, slotsCount: 6, maxSlots: 8 },
  { dateStr: '2026-10-13', dayOfWeek: 'Вт', dayNumber: 13, isToday: true, slotsCount: 5, maxSlots: 8 },
  { dateStr: '2026-10-14', dayOfWeek: 'Ср', dayNumber: 14, isToday: false, slotsCount: 4, maxSlots: 8 },
  { dateStr: '2026-10-15', dayOfWeek: 'Чт', dayNumber: 15, isToday: false, slotsCount: 7, maxSlots: 8 },
  { dateStr: '2026-10-16', dayOfWeek: 'Пт', dayNumber: 16, isToday: false, slotsCount: 2, maxSlots: 8, isDisinfectionDay: true },
];

export const DoctorCalendarScreen: React.FC<DoctorCalendarScreenProps> = ({
  onBack,
  onSelectVisit,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-13');
  const [acceptUrgentDuringBreaks, setAcceptUrgentDuringBreaks] = useState<boolean>(true);
  const [triageDecisions, setTriageDecisions] = useState<Record<string, 'ACCEPTED' | 'DECLINED' | 'CONDITIONAL'>>({});

  const handleTriageAction = (reqId: string, decision: 'ACCEPTED' | 'DECLINED' | 'CONDITIONAL') => {
    setTriageDecisions((prev) => ({ ...prev, [reqId]: decision }));
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
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
            <h1 className="text-base font-black text-slate-900 leading-tight">График Выездов • ВетСлужба</h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Смена дежурства: Заполнено 5 из 8 слотов (75% загрузка)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedDate('2026-10-13')}
          className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
        >
          Сегодня
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Toggle: Accept urgent calls during breaks */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-slate-900 block">
              Срочные вызовы: Принимаю в перерывах
            </span>
            <p className="text-[10px] text-slate-500">
              Приоритет экстренной помощи СПб при наличии интервала более 30 мин
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={acceptUrgentDuringBreaks}
            onClick={() => setAcceptUrgentDuringBreaks(!acceptUrgentDuringBreaks)}
            className={`w-12 h-7 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
              acceptUrgentDuringBreaks ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Horizontal Date Selector (Week 42) */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDate(day.dateStr)}
                className={`flex-1 min-w-[62px] p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <span className={`text-[10px] block font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {day.dayOfWeek}
                </span>
                <span className="text-base font-black block my-0.5">
                  {day.dayNumber}
                </span>
                <span className={`text-[9px] font-mono font-bold block ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {day.slotsCount}/{day.maxSlots}
                </span>
                {day.isDisinfectionDay && (
                  <span className={`text-[8px] font-black uppercase mt-1 block px-1 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
                  }`}>
                    Дез.бокс
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Incoming Call Triage & Clinician Protection Section */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Новые заявки на согласование (Триаж & Защита)</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              2 запроса
            </span>
          </div>

          {/* Request 1 (Standard): Video consultation Corgi Barney */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900">Корги Барни (1.5 года)</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Видеоконсилиум
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Запрос на 18:30 • Консультация по анализу кала на простейшие
                </p>
              </div>
              <span className="text-xs font-mono font-black text-slate-900">1 200 ₽</span>
            </div>

            {triageDecisions['req-corgi'] ? (
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Заявка подтверждена и внесена в расписание</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleTriageAction('req-corgi', 'ACCEPTED')}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Принять вызов
                </button>
                <button
                  type="button"
                  onClick={() => alert('Предложить клиенту свободный слот 19:30')}
                  className="py-2 px-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Перенести
                </button>
                <button
                  type="button"
                  onClick={() => handleTriageAction('req-corgi', 'DECLINED')}
                  className="py-2 px-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Отклонить
                </button>
              </div>
            )}
          </div>

          {/* Request 2: High Risk Animal Safety Warning (Cane Corso Grom) */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border-2 border-rose-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-rose-950">Кане-корсо Гром (3 года, 46.2 кг)</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                    Высокий риск
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 font-semibold">
                  Темперамент: Агрессивен к чужим (рейтинг зообезопасности 3.4 / 5.0)
                </p>
              </div>
              <span className="text-xs font-mono font-black text-slate-900">5 800 ₽</span>
            </div>

            {/* Prior incident alert */}
            <div className="p-2.5 rounded-xl bg-white/80 border border-rose-200 text-xs text-rose-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong>Предупреждение системы:</strong> Предыдущий визит 14 августа: попытка нападения на выездного врача без намордника. Требуется строгая фиксация до входа персонала.
              </div>
            </div>

            {/* Statutory Protection Notice */}
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200 text-[10px] text-slate-600 leading-tight">
              <strong>Правовая гарантия безопасности (ст. 70 и ст. 9 Закона РФ № 4979-1):</strong> Ветеринарный врач вправе отказаться от оказания услуг при непредоставлении владельцем безопасных условий фиксации животного.
            </div>

            {triageDecisions['req-corso'] === 'DECLINED' ? (
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center space-x-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Вызов отклонен по соображениям клинической безопасности</span>
              </div>
            ) : triageDecisions['req-corso'] === 'CONDITIONAL' ? (
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-amber-700" />
                <span>Принят с обязательным условием жесткой фиксации и намордника</span>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTriageAction('req-corso', 'DECLINED')}
                  className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Отклонить выезд (Риск безопасности)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriageAction('req-corso', 'CONDITIONAL')}
                  className="w-full py-2 px-3 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Принять с условием жесткой фиксации
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Time Schedule */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Почасовой таймлайн дежурства</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">13 октября 2026</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Slot 1: 12:00 Completed */}
            <div className="flex items-start space-x-3 opacity-60">
              <span className="font-mono font-bold text-slate-400 w-12 pt-0.5">12:00</span>
              <div className="flex-1 p-2.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Осмотр лабрадора Бони</span>
                  <span className="text-[10px] text-slate-500">Завершено • Протокол #ВЕТ-7039</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            </div>

            {/* Slot 2: 14:00 Completed */}
            <div className="flex items-start space-x-3 opacity-60">
              <span className="font-mono font-bold text-slate-400 w-12 pt-0.5">14:00</span>
              <div className="flex-1 p-2.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Вакцинация котенка Симбы</span>
                  <span className="text-[10px] text-slate-500">Завершено • Протокол #ВЕТ-7040</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            </div>

            {/* Slot 3: 15:30 Restocking window */}
            <div className="flex items-start space-x-3">
              <span className="font-mono font-bold text-amber-600 w-12 pt-0.5">15:30</span>
              <div className="flex-1 p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950 block">Логистический перерыв и дозаправка</span>
                    <span className="text-[10px] text-amber-800">Пополнение боксов экспресс-тестов (30 мин)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slot 4: 16:00 Video Consultation */}
            <div className="flex items-start space-x-3">
              <span className="font-mono font-bold text-indigo-600 w-12 pt-0.5">16:00</span>
              <div className="flex-1 p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-black text-indigo-950">Телемед: Кот Маркиз</span>
                  </div>
                  <span className="text-[10px] text-indigo-700 block mt-0.5">Острый гастрит • HD Видео</span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-900">1 200 ₽</span>
              </div>
            </div>

            {/* Slot 5: 17:00 House call */}
            <div className="flex items-start space-x-3">
              <span className="font-mono font-bold text-blue-600 w-12 pt-0.5">17:00</span>
              <div
                onClick={() => onSelectVisit?.('ВЕТ-7041')}
                className="flex-1 p-3 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-100/80 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-black text-blue-950">Выезд: Хаски Норд</span>
                  </div>
                  <span className="text-[10px] text-blue-700 block mt-0.5">ул. Ленина 28 • Гастроэнтерит</span>
                </div>
                <span className="text-xs font-mono font-black text-blue-950">4 700 ₽</span>
              </div>
            </div>

            {/* Slot 6: 19:00 - 21:00 Free Emergency Reserve */}
            <div className="flex items-start space-x-3">
              <span className="font-mono font-bold text-slate-400 w-12 pt-0.5">19:00</span>
              <div className="flex-1 p-3 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Резерв экстренной помощи</span>
                  <span className="text-[10px] text-emerald-700">Свободное окно для экстренных вызовов скорой</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Доступен
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Break Management Action */}
        <button
          type="button"
          onClick={() => alert('Интервал отдыха заблокирован в диспетчерском расписании')}
          className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          <span>+ Добавить перерыв / Заблокировать интервал отдыха</span>
        </button>
      </div>
    </div>
  );
};
