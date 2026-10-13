import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Award,
  Plus,
  Stethoscope,
  Check,
  Activity,
  FileCheck,
} from 'lucide-react';

export interface ReviewsRatingsScreenProps {
  readonly onBack: () => void;
}

export type ReputationPerspective = 'DOCTOR_ASSESSMENT' | 'CLIENT_REVIEWS';

interface ReviewItem {
  readonly id: string;
  readonly doctorName: string;
  readonly visitNumber: string;
  readonly visitType: 'HOUSE_CALL' | 'EMERGENCY' | 'TELEHEALTH';
  readonly visitTypeRu: string;
  readonly petName: string;
  readonly petCategory: 'canine' | 'feline';
  readonly rating: number;
  readonly date: string;
  readonly tags: readonly string[];
  readonly text: string;
  readonly tipAmountSbp?: number;
  readonly doctorResponse?: {
    readonly responderName: string;
    readonly responseDate: string;
    readonly text: string;
    readonly isUkeSignVerified: boolean;
  };
}

const REVIEWS_MOCK: readonly ReviewItem[] = [
  {
    id: 'rev-01',
    doctorName: 'Д-р Романов К. В.',
    visitNumber: 'ВЕТ-491',
    visitType: 'HOUSE_CALL',
    visitTypeRu: 'Плановый очный выезд на дом',
    petName: 'Хаски Норд',
    petCategory: 'canine',
    rating: 5,
    date: '10 октября 2026',
    tags: ['Без стресса', 'Бережная вакцинация', 'Чип проверен', 'Ветпаспорт обновлен'],
    text: 'Превосходный визит! Врач приехал точно в назначенное время со стерильным набором и портативным сканером микрочипов. Норд обычно очень нервничает при осмотре, но доктор нашел подход за минуту. Вакцинация Нобивак прошла безболезненно, данные мгновенно появились в реестре «Хорриот».',
    tipAmountSbp: 500,
    doctorResponse: {
      responderName: 'Д-р Романов К. В., ведущий ветеринарный врач СПб',
      responseDate: '11 октября 2026',
      text: 'Александр Владимирович, спасибо за доверие! Норд в прекрасной физической кондиции, поствакцинальный иммунитет сформирован. Рад был помочь вашей семье.',
      isUkeSignVerified: true,
    },
  },
  {
    id: 'rev-02',
    doctorName: 'Д-р Васильева Е. В.',
    visitNumber: 'ВЕТ-504',
    visitType: 'EMERGENCY',
    visitTypeRu: 'Срочный выезд скорой ветпомощи',
    petName: 'Кот Маркиз',
    petCategory: 'feline',
    rating: 5,
    date: '28 сентября 2026',
    tags: ['Лампа Вуда', 'Точный диагноз', 'Без стресса для кота'],
    text: 'Вызывали врача срочно из-за внезапного зуда и высыпаний. Бригада прибыла за 18 минут в Петроградский район! Провели люминесцентную диагностику лампой Вуда, исключили микроспорию и выписали эффективную противозудную терапию. Кот уснул спокойным уже через час.',
    tipAmountSbp: 300,
  },
  {
    id: 'rev-03',
    doctorName: 'Дежурный телемед-терапевт',
    visitNumber: 'ВЕТ-ТЕЛ-109',
    visitType: 'TELEHEALTH',
    visitTypeRu: 'Ночной телемед-консилиум 24/7',
    petName: 'Хаски Норд',
    petCategory: 'canine',
    rating: 5,
    date: '15 сентября 2026',
    tags: ['Быстрое подключение за 2 мин', 'Коррекция диеты', 'Снятие паники'],
    text: 'Собака случайно съела куриные кости ночью, мы были в панике. Подключились к ночному консилиуму через защищенный видеоканал за 2 минуты. Доктор оценил дыхание, слизистые, дал четкий алгоритм действий без ненужной промывки желудка. Утром Норд чувствовал себя отлично.',
  },
];

interface MetricBarItem {
  readonly title: string;
  readonly score: number;
  readonly maxScore: number;
  readonly percentage: number;
  readonly description: string;
}

const DOCTOR_METRICS: readonly MetricBarItem[] = [
  {
    title: 'Подготовка зоны осмотра',
    score: 5.0,
    maxScore: 5.0,
    percentage: 100,
    description: 'Освещение, дезинфицированная поверхность, изоляция от бытового шума',
  },
  {
    title: 'Фиксация и намордник (Закон № 4979-1)',
    score: 4.8,
    maxScore: 5.0,
    percentage: 96,
    description: 'Безопасность персонала, мягкий намордник наготове при термометрии',
  },
  {
    title: 'Точность анамнеза',
    score: 5.0,
    maxScore: 5.0,
    percentage: 100,
    description: 'Четкий хронометраж проявления симптомов, предоставление прошлых анализов',
  },
  {
    title: 'Дисциплина терапии и прием препаратов',
    score: 4.9,
    maxScore: 5.0,
    percentage: 98,
    description: 'Строгое следование электронному листу назначений и дозировкам',
  },
];

export const ReviewsRatingsScreen: React.FC<ReviewsRatingsScreenProps> = ({ onBack }) => {
  const [activePerspective, setActivePerspective] = useState<ReputationPerspective>('DOCTOR_ASSESSMENT');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CANINE' | 'FELINE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReviews = REVIEWS_MOCK.filter((r) => {
    if (activeFilter === 'CANINE') return r.petCategory === 'canine';
    if (activeFilter === 'FELINE') return r.petCategory === 'feline';
    return true;
  });

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад в профиль"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">Репутация и Отзывы</h1>
            <p className="text-[10px] font-semibold text-slate-500">
              СПб ВетСлужба 24/7 • Двусторонний аудит комплаентности
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          АИ
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Primary Segmented Toggle */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center space-x-1 shadow-2xs border border-slate-200">
          <button
            type="button"
            onClick={() => setActivePerspective('DOCTOR_ASSESSMENT')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activePerspective === 'DOCTOR_ASSESSMENT'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 shrink-0 text-blue-600" />
            <span>Вет-рейтинг от врачей</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePerspective('CLIENT_REVIEWS')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activePerspective === 'CLIENT_REVIEWS'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>Мои отзывы о врачах</span>
          </button>
        </div>

        {/* Perspective A: Doctor Assessment of Owner & Pet Behavior */}
        {activePerspective === 'DOCTOR_ASSESSMENT' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Overall Owner Safety & Caregiver Index Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 relative overflow-hidden space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 block w-fit">
                    Клинический комплаенс куратора • 4979-1
                  </span>
                  <div className="flex items-baseline space-x-2.5 mt-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">4.95</span>
                    <span className="text-xs font-bold text-slate-400">/ 5.0</span>
                    <div className="flex items-center space-x-1 ml-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    Индекс безопасности выездных бригад: <strong className="text-emerald-700">Высокий</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold">
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>VIP Куратор</span>
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">ID: VET-OWNER-89214</p>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-950 block">
                      Низкий риск • Высокая зообезопасность
                    </span>
                    <span className="text-[10px] text-emerald-800 leading-tight block">
                      Владелец соблюдает ветеринарные протоколы СПбГУВМ при визитах на дом
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Оценено вызовов: <strong>4 визита</strong></span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Зооагрессия: 0%</span>
                </span>
              </div>
            </div>

            {/* Breakdown Metric Bars */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Метрики клинической оценки ветврачей</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">ГОСТ Р 58434</span>
              </div>

              <div className="space-y-3">
                {DOCTOR_METRICS.map((metric, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{metric.title}</span>
                      <span className="font-mono font-black text-blue-700">
                        {metric.score.toFixed(1)} / {metric.maxScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-Pet Behavioral Assessments by Visiting Clinicians */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Поведение питомцев при клиническом осмотре</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">2 пациента</span>
              </div>

              {/* Assessment 1: Husky Nord */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-slate-900">Хаски Норд</h4>
                      <span className="text-[10px] font-semibold text-slate-500">Сибирский хаски, 4 года</span>
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Контролируемое волнение
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 font-mono">4.8</span>
                    <span className="text-[10px] text-slate-400 font-bold"> / 5.0</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <p className="italic">
                    «Дружелюбен с хозяином, проявляет умеренное беспокойство при ректальной термометрии. Мягкий намордник рекомендован и был корректно надет владельцем. Клиническая агрессия отсутствует (Zero clinical aggression).»
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Осмотр: Д-р Романов К. В. • Выезд на дом #ВЕТ-491</span>
                  <span className="font-mono text-emerald-700 font-bold">УКЭП подтверждена</span>
                </div>
              </div>

              {/* Assessment 2: Cat Marquis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-slate-900">Кот Маркиз</h4>
                      <span className="text-[10px] font-semibold text-slate-500">Мейн-кун, 3 года</span>
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Эталонное спокойствие
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 font-mono">5.0</span>
                    <span className="text-[10px] text-slate-400 font-bold"> / 5.0</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <p className="italic">
                    «Крайне спокоен, стрессоустойчивость эталонная, осмотр и забор крови проведены без применения седации и фиксирующих сумок.»
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Осмотр: Д-р Васильева Е. В. • Скорая ветпомощь #ВЕТ-504</span>
                  <span className="font-mono text-emerald-700 font-bold">УКЭП подтверждена</span>
                </div>
              </div>
            </div>

            {/* Attending Doctor Verified Endorsement Cards */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Верифицированные отзывы лечащих врачей</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ФГИС «ВетИС»
                </span>
              </div>

              {/* Endorsement 1 */}
              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      РК
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-blue-950">Д-р Романов К. В.</h4>
                      <p className="text-[10px] text-blue-800">Ведущий ветеринарный врач выездной службы СПб</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    УКЭП врача
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «Ответственный владелец, своевременное оповещение о симптомах, строгое соблюдение поствизитных карантинных протоколов и дозировок препаратов.»
                </p>
              </div>

              {/* Endorsement 2 */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      ВЕ
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-950">Д-р Васильева Е. В.</h4>
                      <p className="text-[10px] text-indigo-800">Врач интенсивной терапии и скорой ветпомощи</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    УКЭП врача
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «Безупречная организация пространства для экстренного осмотра. Питомец был зафиксирован бережно и надежно, строгое следование протоколу бригады.»
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Perspective B: Client Reviews of Attending Clinicians */}
        {activePerspective === 'CLIENT_REVIEWS' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Stats Banner */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 relative overflow-hidden space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 block w-fit">
                    Мои оценки врачей выездной службы
                  </span>
                  <div className="flex items-baseline space-x-2.5 mt-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">5.00</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    Средняя оценка врачей владельцем: <strong className="text-slate-900">5.0 из 5</strong>
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-extrabold">
                    <span>3 отзыва</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Всего завершенных вызовов: <strong>4 визита</strong></span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Верифицировано визитами</span>
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 select-none">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Все отзывы ({REVIEWS_MOCK.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('CANINE')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'CANINE'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Собаки: Хаски Норд
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('FELINE')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'FELINE'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Кошки: Кот Маркиз
              </button>
            </div>

            {/* Review Cards List */}
            <div className="space-y-3.5">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-slate-900">{review.doctorName}</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {review.visitNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {review.visitTypeRu} • Пациент: <strong>{review.petName}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-0.5 justify-end">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{review.date}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 flex items-center space-x-1"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    «{review.text}»
                  </p>

                  {/* SBP Tipping Badge */}
                  {review.tipAmountSbp && (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center space-x-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Чаевые врачу через СБП:</span>
                      </span>
                      <span className="text-xs font-black text-emerald-700 font-mono">
                        +{review.tipAmountSbp} ₽
                      </span>
                    </div>
                  )}

                  {/* Official Clinician Response */}
                  {review.doctorResponse && (
                    <div className="ml-2 pl-3 border-l-2 border-blue-400 space-y-1.5 bg-blue-50/40 p-3 rounded-2xl border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-blue-900">
                          {review.doctorResponse.responderName}
                        </span>
                        {review.doctorResponse.isUkeSignVerified && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                            УКЭП подтверждена
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {review.doctorResponse.text}
                      </p>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        {review.doctorResponse.responseDate}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Callout Card */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 rounded-3xl p-5 border-2 border-blue-200/90 shadow-md space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Остались впечатления о визите ветврача?</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ваша оценка формирует персональный рейтинг врачей выездной службы Санкт-Петербурга.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Оставить отзыв о ветпомощи →</span>
              </button>
            </div>
          </div>
        )}

        {/* Regulatory Footer */}
        <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 text-center text-[10px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">
            Двусторонний аудит ветеринарного надзора Санкт-Петербурга
          </p>
          <p>
            Оценки зообезопасности и отзывы верифицированы протоколами выезда в соответствии с Законом № 4979-1 и 152-ФЗ.
          </p>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-900">Новый отзыв</h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Закрыть
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Вы можете оценить последний завершенный визит #ВЕТ-491.
            </p>

            <div className="flex items-center justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-400 cursor-pointer" />
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Опишите, как прошел осмотр животного..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => {
                alert('Спасибо! Ваш отзыв направлен в отдел контроля качества.');
                setIsModalOpen(false);
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              Отправить отзыв
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
