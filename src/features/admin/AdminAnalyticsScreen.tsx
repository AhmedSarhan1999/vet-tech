import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Star,
  Users,
  Car,
  FileSpreadsheet,
  FileCode,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

export interface AdminAnalyticsScreenProps {
  readonly onOpenSafety?: () => void;
}

export type EntitySegment = 'ALL' | 'DOCTORS' | 'PETS' | 'CLINICS';

export const AdminAnalyticsScreen: React.FC<AdminAnalyticsScreenProps> = ({
  onOpenSafety,
}) => {
  const [activeSegment, setActiveSegment] = useState<EntitySegment>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-slate-50/60 min-h-full">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2.5 shadow-xl animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: EXECUTIVE KPI DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Financial Turnover & GMV */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Финансовый оборот (GMV)
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-slate-900">
              5 480 200 ₽
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 ml-2">
              +21.4%
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Комиссия платформы (12%):</span>
              <strong className="font-mono text-slate-900">657 624 ₽</strong>
            </div>
            <div className="flex justify-between">
              <span>Выплаты врачам (СБП):</span>
              <strong className="font-mono text-slate-900">4 822 596 ₽</strong>
            </div>
            <div className="flex justify-between">
              <span>Средний чек вызова:</span>
              <strong className="font-mono text-blue-700">3 865 ₽</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Operational Quality & SLA */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Операционное качество & SLA
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-slate-900">
              19.4 мин
            </span>
            <span className="text-[11px] font-semibold text-slate-500 ml-2">
              средний доезд
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Zero-Phobia метрика:</span>
              <strong className="font-mono text-emerald-700">99.2% без стресса</strong>
            </div>
            <div className="flex justify-between">
              <span>Оценка врачей:</span>
              <strong className="font-mono text-slate-900 flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>4.97 (318 отзывов)</span>
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Нарушения регламентов:</span>
              <strong className="font-mono text-emerald-700">0 инцидентов</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Patient Retention & Adherence */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Удержание пациентов (LTV)
            </span>
            <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-slate-900">
              72.4%
            </span>
            <span className="text-[11px] font-semibold text-slate-500 ml-2">
              повторные визиты
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Комплаентность вакцин:</span>
              <strong className="font-mono text-teal-700">91% по графику</strong>
            </div>
            <div className="flex justify-between">
              <span>Пациентов на мониторинге:</span>
              <strong className="font-mono text-slate-900">640 питомцев</strong>
            </div>
            <div className="flex justify-between">
              <span>ВетИС точность синхронизации:</span>
              <strong className="font-mono text-emerald-700">100%</strong>
            </div>
          </div>
        </div>

        {/* Card 4: District Workload & Fleet Distribution */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Районная загрузка флота
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <Car className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-slate-900">
              88.3%
            </span>
            <span className="text-[11px] font-semibold text-slate-500 ml-2">
              общая утилизация
            </span>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span>Приморский: 94% (18 экип.)</span>
              <span>Петроградский: 88% (12 экип.)</span>
            </div>
            <div className="flex justify-between">
              <span>Василеостровский: 92% (10 экип.)</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-amber-800 font-bold">Выборгский: дефицит 3 экипажа</span>
              <button
                type="button"
                onClick={() => showToast('Диспетчерский запрос на привлечение 3 дежурных экипажей передан в чат врачей Выборгского сектора.')}
                className="text-[10px] font-black text-blue-700 hover:underline cursor-pointer"
              >
                Привлечь дежурных →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: UNIFIED ENTITY REGISTRY CONTROLS & FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              Единый реестр субъектов учета ФГИС «ВетИС» (Хорриот & Меркурий)
            </h3>
            <p className="text-[10px] text-slate-500 font-semibold">
              Сводная база пациентов, врачей и партнерских ветклиник Санкт-Петербурга
            </p>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Выгрузка реестра в формате XLSX (Excel) сформирована.')}
              className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Выгрузить XLSX</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Пакет ветеринарных документов (Меркурий XML) сформирован.')}
              className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Сформировать ВСД (Меркурий XML)</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Форма регистрации нового ветспециалиста открыта.')}
              className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Зарегистрировать ветспециалиста</span>
            </button>
          </div>
        </div>

        {/* Entity Segmented Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'ALL', label: 'Все субъекты (3 840)' },
              { id: 'DOCTORS', label: 'Ветврачи-терапевты и хирурги (48)' },
              { id: 'PETS', label: 'Питомцы и кураторы (3 792)' },
              { id: 'CLINICS', label: 'Вет-клиники партнеры (16)' },
            ].map((seg) => (
              <button
                key={seg.id}
                type="button"
                onClick={() => setActiveSegment(seg.id as EntitySegment)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSegment === seg.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по кличке, чипу, ФИО..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* SECTION 3: LIVE MASTER DATA GRID */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3.5">Субъект / Куратор</th>
                <th className="py-3 px-3.5">Идентификация (Чип / Паспорт / ВетИС)</th>
                <th className="py-3 px-3.5">Клинический статус и терапия</th>
                <th className="py-3 px-3.5">Темперамент & Зообезопасность</th>
                <th className="py-3 px-3.5">Статус Вет-Эскроу</th>
                <th className="py-3 px-3.5 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {/* Row 1: Husky Nord */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-3.5">
                  <div className="font-black text-slate-900 text-xs">Сибирский Хаски Норд</div>
                  <div className="text-[11px] text-slate-500">Кобель, 3 года, 28.4 кг</div>
                  <div className="text-[10px] text-slate-400">Куратор: Александр В. Иванов (Петроградский)</div>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">Чип: 643098100234567</div>
                  <div className="text-slate-500">Паспорт: #ВЕТ-491-СПб</div>
                  <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                    Хорриот верифицирован
                  </span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-900 block">Плановая вакцинация Nobivac DHPPi+RL</span>
                  <span className="text-[11px] text-slate-500">Октябрь 2026 • Термометрия 39.4°C</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-800 block">Спокойный</span>
                  <span className="text-[11px] text-slate-500">Легкий стресс при термометрии • Намордник надет</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block w-fit">
                    Оплачено 3 200 ₽
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Чек #ОД-9811 (54-ФЗ)</span>
                </td>
                <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => showToast('Ветпаспорт Хаски Норда открыт.')}
                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Ветпаспорт
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Электронное ВСД Меркурий открыто.')}
                    className="py-1 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    ВСД Меркурий
                  </button>
                </td>
              </tr>

              {/* Row 2: Dr. Romanov */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-3.5">
                  <div className="font-black text-slate-900 text-xs">Д-р Романов Дмитрий С.</div>
                  <div className="text-[11px] text-teal-800 font-bold">СПбГУВМ • 9 лет стажа • Экипаж №04</div>
                  <div className="text-[10px] text-slate-400">Лицензия УВ-78-102 • Рено Дастер #14</div>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">УКЭП ГОСТ Р 34.10-2012</div>
                  <div className="text-slate-500">ВетИС #VET-78-01948</div>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                    На смене онлайн
                  </span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-900 block">28 выездов в октябре</span>
                  <span className="text-[11px] text-slate-500">Петроградский / Василеостровский</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <div className="flex items-center space-x-1 text-slate-800 font-bold">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>5.0 (42 отзыва)</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Аттестован по зообезопасности</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit">
                    Доход: 94 600 ₽
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">НПД 4% подтвержден</span>
                </td>
                <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => showToast('Профиль ветврача открыт.')}
                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Профиль ветврача
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Опись укладки биопрепаратов открыта.')}
                    className="py-1 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Укладка биопрепаратов
                  </button>
                </td>
              </tr>

              {/* Row 3: Cat Marquis */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-3.5">
                  <div className="font-black text-slate-900 text-xs">Шотландская вислоухая Маркиза</div>
                  <div className="text-[11px] text-slate-500">Самка, 4 года, 3.8 кг</div>
                  <div className="text-[10px] text-slate-400">Куратор: Екатерина М. (Крестовский о-в)</div>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">Чип: 643-0982-6411-9881</div>
                  <div className="text-slate-500">Паспорт: #ВЕТ-8120-СПб</div>
                  <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                    Хорриот ОК
                  </span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-900 block">Острый гастрит</span>
                  <span className="text-[11px] text-slate-500">Синулокс RTU + диетотерапия Gastrointestinal</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-800 block">Ласковая</span>
                  <span className="text-[11px] text-slate-500">Ноль агрессии • Стресс при пальпации живота</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block w-fit">
                    Холд: 4 200 ₽
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ЮKassa Эскроу</span>
                </td>
                <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => showToast('История терапии открыта.')}
                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    История терапии
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Чат телемедицины открыт.')}
                    className="py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Телемед чат
                  </button>
                </td>
              </tr>

              {/* Row 4: BLACKLIST RED FLAG - Pitbull Tyson */}
              <tr className="bg-rose-50/40 hover:bg-rose-50/70 border-l-4 border-rose-500 transition-colors">
                <td className="py-3.5 px-3.5">
                  <div className="font-black text-rose-950 text-xs flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Питбультерьер Тайсон (ЧЕРНЫЙ СПИСОК)</span>
                  </div>
                  <div className="text-[11px] text-rose-900 font-semibold">Кобель, 4 года, некастрированный, 34 кг</div>
                  <div className="text-[10px] text-slate-500">Владелец: Игорь К. (ул. Савушкина, 42)</div>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px]">
                  <div className="font-black text-rose-700">БЕЗ ЧИПА • НАРУШЕНИЕ</div>
                  <div className="text-slate-500">Отказ от бешенства (ст. 18 №4979-1)</div>
                  <span className="text-[9px] font-black uppercase text-rose-800 bg-rose-100 px-1 py-0.2 rounded border border-rose-300">
                    Карантинный флаг
                  </span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-black text-rose-950 block">ОТКАЗ В ОБСЛУЖИВАНИИ</span>
                  <span className="text-[11px] text-rose-800">Угроза нападения животного на ветврача</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-black text-rose-700 block">ВЫСОКАЯ АГРЕССИЯ</span>
                  <span className="text-[11px] text-slate-600">Отказ от изоляции • Угрозы физической силой</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-mono font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 block w-fit">
                    ПОЛНЫЙ БАН
                  </span>
                  <span className="text-[10px] text-slate-500">Выезд строго с ГБР</span>
                </td>
                <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={onOpenSafety || (() => showToast('SOS-протокол запущен.'))}
                    className="py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black cursor-pointer shadow-2xs"
                  >
                    SOS-протокол
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Документы направлены в Управление ветеринарии Санкт-Петербурга.')}
                    className="py-1 px-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    В Управление СПб
                  </button>
                </td>
              </tr>

              {/* Row 5: Rabbit Clover */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-3.5">
                  <div className="font-black text-slate-900 text-xs">Карликовый кролик Клевер</div>
                  <div className="text-[11px] text-slate-500">Самец, 1.5 года, 1.6 кг, экзотический пациент</div>
                  <div className="text-[10px] text-slate-400">Куратор: Михаил С. (Васильевский о-в)</div>
                </td>
                <td className="py-3.5 px-3.5 font-mono text-[11px]">
                  <div className="font-bold text-slate-800">Чип: 643-0192-8821</div>
                  <div className="text-slate-500">Паспорт: #ВЕТ-9021-СПб</div>
                  <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                    Верифицирован
                  </span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-900 block">Стоматологическая коррекция</span>
                  <span className="text-[11px] text-slate-500">Стрижка резцов выполнена на дому</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-bold text-slate-800 block">Пугливый</span>
                  <span className="text-[11px] text-slate-500">Фиксация полотенцем (Towel restraint)</span>
                </td>
                <td className="py-3.5 px-3.5">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block w-fit">
                    Оплачено 1 800 ₽
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Чек 54-ФЗ</span>
                </td>
                <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => showToast('Карточка приема кролика Клевера открыта.')}
                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Карточка приема
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 4: PAGINATION BAR & REGULATORY LEGAL FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="text-slate-500">
            Показано: <strong>5</strong> из <strong>3 840</strong> субъектов учета • Страница <strong>{currentPage}</strong> из <strong>768</strong>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">1</span>
            <span className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">2</span>
            <span className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">3</span>
            <span className="px-2 py-1 text-slate-400">...</span>
            <span className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">768</span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-[10px] text-slate-500 leading-tight">
          Правовые реквизиты реестра: Закон РФ № 4979-1 «О ветеринарии», ГОСТ Р 58435-2019 (Ситуационные центры и диспетчеризация), Приказ Минсельхоза РФ № 161, экспорт данных в ФГИС «ВетИС» (Меркурий/Хорриот) и ст. 860.7 Гражданского кодекса РФ (Счет эскроу).
        </div>
      </div>
    </div>
  );
};
