import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Check,
  Database,
  Award,
} from 'lucide-react';

export interface AdminAccreditationScreenProps {
  readonly onBackToDispatch?: () => void;
}

export type CandidateFilter = 'ALL' | 'SURGEONS' | 'THERAPISTS';

interface Candidate {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly category: 'SURGEONS' | 'THERAPISTS';
  readonly experienceYears: number;
  readonly checksPassed: number;
  readonly totalChecks: number;
  readonly waitTimeMin: number;
  readonly status: 'READY' | 'WARNING' | 'PENDING';
  readonly statusText: string;
}

export const AdminAccreditationScreen: React.FC<AdminAccreditationScreenProps> = () => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('cand-1');
  const [filter, setFilter] = useState<CandidateFilter>('ALL');
  const [decisionToast, setDecisionToast] = useState<string | null>(null);
  const [approvedCandidates, setApprovedCandidates] = useState<string[]>([]);

  const candidates: Candidate[] = [
    {
      id: 'cand-1',
      name: 'Д-р Смирнова Анна Сергеевна',
      role: 'Ветеринарный хирург, радиолог',
      category: 'SURGEONS',
      experienceYears: 8,
      checksPassed: 5,
      totalChecks: 5,
      waitTimeMin: 18,
      status: 'READY',
      statusText: 'Все 5 реестров пройдены',
    },
    {
      id: 'cand-2',
      name: 'Д-р Романов Константин Васильевич',
      role: 'Ветеринарный терапевт, кардиолог',
      category: 'THERAPISTS',
      experienceYears: 6,
      checksPassed: 5,
      totalChecks: 5,
      waitTimeMin: 42,
      status: 'READY',
      statusText: 'Аттестация Меркурий подтверждена',
    },
    {
      id: 'cand-3',
      name: 'Д-р Кузнецов Игорь Михайлович',
      role: 'Ветеринарный хирург-ортопед',
      category: 'SURGEONS',
      experienceYears: 11,
      checksPassed: 4,
      totalChecks: 5,
      waitTimeMin: 65,
      status: 'WARNING',
      statusText: 'Требуется продление ключа УКЭП',
    },
    {
      id: 'cand-4',
      name: 'Д-р Новикова Елена Андреевна',
      role: 'Ветеринарный врач-дерматолог',
      category: 'THERAPISTS',
      experienceYears: 4,
      checksPassed: 4,
      totalChecks: 5,
      waitTimeMin: 90,
      status: 'PENDING',
      statusText: 'Ожидает справку МВД',
    },
  ];

  const showToast = (msg: string) => {
    setDecisionToast(msg);
    setTimeout(() => setDecisionToast(null), 4000);
  };

  const handleApprove = () => {
    setApprovedCandidates((prev) => [...prev, selectedCandidateId]);
    showToast('Кандидат успешно аккредитован! Выдан цифровой сертификат допуска на выездную линию Санкт-Петербурга.');
  };

  const handleRequestMore = () => {
    showToast('Направлен официальный запрос в личный кабинет врача: предоставить доп. выписку ВетИС.');
  };

  const handleReject = () => {
    showToast('Заявка на аккредитацию отклонена с фиксацией мотивированного отказа в реестре СПбГУВМ.');
  };

  const filteredCandidates = candidates.filter((c) => {
    if (filter === 'ALL') return true;
    return c.category === filter;
  });

  const isApproved = approvedCandidates.includes(selectedCandidateId);

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-slate-50/60 min-h-full">
      {/* Toast Alert */}
      {decisionToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2.5 shadow-xl animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{decisionToast}</span>
        </div>
      )}

      {/* SECTION 1: SITUATIONAL ACCREDITATION HEADER */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-black text-slate-900 leading-tight">
                  СПб ВетСлужба 24/7 • ЦЕНТР ВЕТИС СПБ
                </h1>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  СПбГУВМ Аттестация
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Федеральный шлюз государственной аккредитации выездных ветеринарных врачей • Закон РФ № 4979-1
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              ГОСТ Р 34.10-2012
            </span>
            <span className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
              Гл. инспектор: Проф. Лебедев Д. Н. (СПбГУВМ)
            </span>
          </div>
        </div>

        {/* Live Gateway Metrics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-0.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">Смена вет-инспектора активна</span>
            <span className="text-slate-400">•</span>
            <span>34 экипажа на линии</span>
          </div>
          <span className="text-emerald-700 font-bold font-mono text-[11px]">
            SLA верификации кандидатов: 99.4%
          </span>
        </div>
      </div>

      {/* SECTION 2 & 3: TWO-COLUMN WORK AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Active Candidate Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Candidate Profile Capsule */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    ID #78-VET-04981
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>5 из 5 проверок пройдены</span>
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  Д-р Смирнова Анна Сергеевна
                </h2>
                <p className="text-xs text-slate-600">
                  Ветеринарный хирург, радиолог • Стаж: <strong>8 лет практики</strong> • Высшая квалификационная категория
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Альма-матер:
                </span>
                <span className="text-xs font-black text-slate-900">
                  СПбГУВМ (2018 г.)
                </span>
              </div>
            </div>

            {/* Credentials Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">СНИЛС</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">142-890-312 88</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">ИНН НПД (422-ФЗ)</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">781402941102</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Телефон связи</span>
                <span className="font-mono font-bold text-slate-900 text-[11px]">+7 921 441-28-85</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">ВетИС профиль</span>
                <span className="font-mono font-bold text-teal-700 text-[11px]">Хорриот активен</span>
              </div>
            </div>

            {/* State Registry Verification Checklist (5 of 5) */}
            <div className="space-y-2.5 pt-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Чек-лист государственной верификации реестров (5/5 подтверждено)
              </h3>

              {/* Check 1 */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">
                      1. Высшее ветеринарное образование (СПбГУВМ)
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ФРДО ОК
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Диплом с отличием #107824 091823 верифицирован через Федеральный реестр документов об образовании (Рособрнадзор). Специальность: Ветеринария.
                  </p>
                </div>
              </div>

              {/* Check 2 */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">
                      2. Аттестация ФГИС «ВетИС» (Меркурий & Хорриот)
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      До 28.06.2028
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Авторизован выпуск электронных ветеринарных сопроводительных документов (ВСД), регистрация идентификационных меток чипов ISO и внесение вакцинаций против бешенства.
                  </p>
                </div>
              </div>

              {/* Check 3 */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">
                      3. Усиленная квалифицированная электронная подпись (УКЭП)
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ГОСТ Р 34.10-2012
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    КриптоПро CSP v5.0, квалифицированный сертификат ФНС/УЦ проверен на валидность через онлайн-реестр корневых сертификатов Минцифры РФ (активен до 07.2027).
                  </p>
                </div>
              </div>

              {/* Check 4 */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">
                      4. Справка МВД РФ и допуск к обороту анестетиков
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      МВД #СПБ-0321
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Справка ГУ МВД по СПб и ЛО подтверждает отсутствие судимости. Оформлен допуск к подконтрольным ветеринарным наркотическим и психотропным препаратам (Приказ МВД/Минсельхоза).
                  </p>
                </div>
              </div>

              {/* Check 5 */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">
                      5. Оснащение мобильной укладки и налог НПД (422-ФЗ)
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      СанПиН + ФНС
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    RFID-сканер микрочипов ISO 11784/85, лампа Вуда 365 нм, термоконтейнер с телеметрией (+2..+8°C) и зарегистрированный статус плательщика налога на профессиональный доход.
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Decision Controls */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950">
                <strong>Заключение аттестационной комиссии:</strong> Все государственные реестры пройдены успешно. Врач квалифицирован для оказания экстренной ветеринарной помощи и плановых выездов по Санкт-Петербургу и Ленинградской области.
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproved}
                  className="py-3 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>
                    {isApproved
                      ? 'Допуск на линию выдан (Сертификат #АКК-78-091)'
                      : 'Одобрить и выдать допуск на линию СПб'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestMore}
                  className="py-3 px-4 bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Запросить доп. сертификаты ВетИС
                </button>

                <button
                  type="button"
                  onClick={handleReject}
                  className="py-3 px-4 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Отклонить заявку
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Queue Sidebar & Latency Dashboard (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Candidate Queue Sidebar */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Очередь соискателей ({candidates.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                СПбГУВМ пул
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'Все (6)' },
                { id: 'SURGEONS', label: 'Вет-хирурги (4)' },
                { id: 'THERAPISTS', label: 'Вет-терапевты (4)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id as CandidateFilter)}
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

            {/* Candidates List */}
            <div className="space-y-2">
              {filteredCandidates.map((c) => {
                const isSelected = selectedCandidateId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidateId(c.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {c.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0 ml-1">
                        {c.waitTimeMin} мин
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate">
                      {c.role} • {c.experienceYears} лет
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span
                        className={`font-bold ${
                          c.status === 'READY'
                            ? 'text-emerald-700'
                            : c.status === 'WARNING'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {c.statusText}
                      </span>
                      <span className="font-mono font-bold text-slate-600">
                        {c.checksPassed}/{c.totalChecks}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Federal Gateway Ping Latency Dashboard */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Пинг шлюзов госсервисов
                </h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Online
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">ВетИС / Меркурий (ВСД):</span>
                <span className="font-mono font-black text-emerald-700">0.4 сек</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">Россельхознадзор Хорриот (Чипы):</span>
                <span className="font-mono font-black text-emerald-700">0.8 сек</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">Рособрнадзор ФРДО (Дипломы):</span>
                <span className="font-mono font-black text-emerald-700">1.2 сек</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">СМЭВ МВД СПб (Судимость):</span>
                <span className="font-mono font-black text-emerald-700">1.9 сек</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-700">ФНС НПД (Налог 4%):</span>
                <span className="font-mono font-black text-emerald-700">0.3 сек</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-tight pt-1">
              Среднее время полной автоматической верификации кандидата: <strong>2.1 часа</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
