import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Video,
  MapPin,
  Car,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  ExternalLink,
  FileText,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export interface DoctorPatientsScreenProps {
  readonly onOpenCalendar: () => void;
  readonly onSelectVisit: (visitId: string) => void;
  readonly onOpenChat?: (chatId: string) => void;
  readonly onOpenTelehealth?: () => void;
  readonly onOpenShiftTariffs?: () => void;
}

export type PatientFilterType = 'ALL' | 'HOUSE_CALL' | 'TELEHEALTH';

export const DoctorPatientsScreen: React.FC<DoctorPatientsScreenProps> = ({
  onOpenCalendar,
  onSelectVisit,
  onOpenChat,
  onOpenTelehealth,
  onOpenShiftTariffs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PatientFilterType>('ALL');

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-black text-slate-900 leading-tight">Пациенты и вызовы</h1>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              ВетИС 4979-1-ФЗ
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
            Экипаж Вет-04 • Петроградский + Приморский кластеры
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenShiftTariffs && (
            <button
              type="button"
              onClick={onOpenShiftTariffs}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Смена и тарифы</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>График</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Поиск по кличке, номеру чипа или заказу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200/90 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Shift Operational Status Ribbon */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900">Бригада Вет-04 (VW Caddy Maxi)</span>
                <p className="text-[10px] text-slate-400">Маршрут: Петроградская сторона — Озерки</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
              3 завершено
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Активные вызовы</span>
              <span className="font-black text-blue-700">2 в очереди</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Кураторские чаты</span>
              <span className="font-black text-emerald-700">1 новое сообщение</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 select-none">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Все вызовы (4)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('HOUSE_CALL')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'HOUSE_CALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Очные выезды на дом (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('TELEHEALTH')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === 'TELEHEALTH'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Телемедицина (1)
          </button>
        </div>

        {/* Section 1: Active Video Consultation Card */}
        {(activeFilter === 'ALL' || activeFilter === 'TELEHEALTH') && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-indigo-200/90 space-y-3.5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  <Video className="w-3 h-3 shrink-0 mr-1 text-indigo-600" />
                  Видеоконсилиум WebRTC HD
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  Кот Маркиз (Шотландский вислоухий, 3 года)
                </h3>
                <p className="text-xs text-slate-600 leading-tight">
                  Обострение острого гастрита после смены корма • Куратор: Смирнова О. В.
                </p>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 block">
                  16:00
                </span>
                <span className="text-[9px] font-bold text-rose-600 block animate-pulse">
                  Старт через 14 мин
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-950">
              <span className="text-[11px] font-medium">
                Безопасный видеоканал ГОСТ Р 34.12 • Запись протокола в медкарту
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenTelehealth}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Войти в видеокабинет (WebRTC HD) →</span>
            </button>
          </div>
        )}

        {/* Section 2: Active House-Call Card (Husky Nord) */}
        {(activeFilter === 'ALL' || activeFilter === 'HOUSE_CALL') && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3.5">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900">17:00 — 18:30 • Выезд на дом</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    #ВЕТ-7041
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-1">
                  Хаски Норд (кобель, 4 года, 26 кг)
                </h3>
                <p className="text-xs text-slate-600">
                  Подозрение на острый гастроэнтерит, рвота, дегидратация 1-й степени
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-slate-500">2.6 км</span>
                <span className="text-[10px] text-blue-600 block mt-0.5 font-bold">~12 мин в пути</span>
              </div>
            </div>

            {/* Address & Biosecurity details */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>г. Санкт-Петербург, ул. Ленина, д. 28, кв. 42</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Подъезд 2, этаж 4, домофон 42# • Шлагбаум открывается звонком на охрану дома
              </p>
            </div>

            {/* Temperament Warning */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/90 flex items-start space-x-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <strong>Оценка зообезопасности:</strong> Питомец проявляет волнение при ректальной термометрии. Мягкий намордник наготове у владельца (Закон РФ № 4979-1).
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href="https://yandex.ru/maps"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center space-x-1.5 transition-colors text-center"
              >
                <span>Маршрут (Яндекс.Карты)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => onSelectVisit('ВЕТ-7041')}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Веткарта и PIN-код</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Curatorship & Chat Supervision Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Кураторство и пост-визитный чат</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Активное ведение
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">Арчи (Французский бульдог, 2 года)</h4>
                <p className="text-[11px] text-slate-500">
                  День 2 из 7 курса ушных капель Отибиовет • Ожидает оценки фото ушной раковины
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 italic">
              «Константин Васильевич, добрый день! Краснота спадает, отправляю фото ушка на осмотр...»
            </div>

            <button
              type="button"
              onClick={() => onOpenChat?.('chat-archi')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Ответить в вет-чате (1 новое сообщение)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Completed Visits Brief Accordion */}
        <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Завершено за сегодня: <strong>3 визита</strong> (протоколы ВетИС закрыты)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">11 400 ₽</span>
        </div>
      </div>
    </div>
  );
};
