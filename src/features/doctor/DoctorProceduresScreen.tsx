import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  MapPin,
  Check,
  Thermometer,
  Send,
  CheckCircle2,
  Plus,
  Minus,
  Box,
  Stethoscope,
} from 'lucide-react';

export interface DoctorProceduresScreenProps {
  readonly onBack: () => void;
  readonly onRequestConsent?: (addedAmount: number, details?: string) => void;
  readonly initialTab?: 'procedures' | 'medications';
}

interface ProcedureItem {
  readonly id: string;
  readonly title: string;
  readonly priceRub: number;
  readonly category: 'EXPRESS_TEST' | 'THERAPY' | 'CONSUMABLE';
  readonly categoryLabel: string;
  readonly details: string;
  readonly standardReference: string;
  readonly isColdChainVerified?: boolean;
}

interface MedicationItem {
  readonly id: string;
  readonly name: string;
  readonly innName: string;
  readonly priceRub: number;
  readonly unit: string;
  readonly form: string;
  readonly lotNumber: string;
  readonly expDate: string;
  readonly isColdChain?: boolean;
  count: number;
}

const PROCEDURES_CATALOG: readonly ProcedureItem[] = [
  {
    id: 'proc-01',
    title: 'Экспресс-тест на антиген парвовируса собак (CPV Ag)',
    priceRub: 1400,
    category: 'EXPRESS_TEST',
    categoryLabel: 'Экспресс-тесты',
    details: 'Иммунохроматографическая кассета, результат за 5-10 мин. Лот #PV-8921 (годен до 10.2027).',
    standardReference: 'Приказ Минсельхоза РФ № 161',
    isColdChainVerified: true,
  },
  {
    id: 'proc-02',
    title: 'Люминесцентная диагностика лампой Вуда (Wood\'s Lamp)',
    priceRub: 600,
    category: 'EXPRESS_TEST',
    categoryLabel: 'Экспресс-тесты',
    details: 'УФ-лампа 365 нм на автономном питании, скрининг дерматомикозов и микроспории.',
    standardReference: 'СанПиН 3.3686-21',
  },
  {
    id: 'proc-03',
    title: 'Вакцинация комплексная Nobivac DHPPi + Lepto',
    priceRub: 2200,
    category: 'THERAPY',
    categoryLabel: 'Инъекции и терапия',
    details: 'Холодовая цепь +4.1°C подтверждена термодатчиком, автоматическая передача серии в ФГИС «Хорриот».',
    standardReference: 'ФГИС ВетИС (Меркурий)',
    isColdChainVerified: true,
  },
  {
    id: 'proc-04',
    title: 'Подкожная инфузионная терапия (Рингер-Локк 200 мл)',
    priceRub: 950,
    category: 'THERAPY',
    categoryLabel: 'Инъекции и терапия',
    details: 'Стерильная инфузионная система-бабочка для купирования дегидратации 1-й степени.',
    standardReference: 'Клинический протокол СПбГУВМ',
  },
  {
    id: 'proc-05',
    title: 'Забор венозной крови на БХ и ОАК с термодоставкой',
    priceRub: 700,
    category: 'EXPRESS_TEST',
    categoryLabel: 'Диагностика',
    details: 'Вакуумная пробирка с K3-EDTA, маркировка штрихкодом и экспресс-доставка курьером.',
    standardReference: 'ГОСТ Р 53079.4-2008',
  },
];

export const DoctorProceduresScreen: React.FC<DoctorProceduresScreenProps> = ({
  onBack,
  onRequestConsent,
  initialTab = 'procedures',
}) => {
  const [activeTab, setActiveTab] = useState<'procedures' | 'medications'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'EXPRESS_TEST' | 'THERAPY' | 'CONSUMABLE'>('ALL');
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>(['proc-01']);

  // Medications state
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: 'med-01',
      name: 'Синулокс RTU 250 мг инъекционный',
      innName: 'Амоксициллин + Клавулановая кислота',
      priceRub: 850,
      unit: 'доза',
      form: 'Суспензия для инъекций',
      lotNumber: 'Лот #SL-8812',
      expDate: '05.2028',
      count: 0,
    },
    {
      id: 'med-02',
      name: 'Серения 10 мг/мл (Маропитант)',
      innName: 'Маропитант цитрат моногидрат',
      priceRub: 1100,
      unit: 'доза',
      form: 'Раствор для п/к введения',
      lotNumber: 'Лот #CR-5021',
      expDate: '09.2027',
      isColdChain: true,
      count: 0,
    },
    {
      id: 'med-03',
      name: 'Энтеросгель вет паста (туба 135 г)',
      innName: 'Полиметилсилоксана полигидрат',
      priceRub: 600,
      unit: 'туба',
      form: 'Энтеросорбент для приема внутрь',
      lotNumber: 'Лот #EG-2041',
      expDate: '03.2028',
      count: 0,
    },
    {
      id: 'med-04',
      name: 'Раствор Рингер-Локк 200 мл',
      innName: 'Солевой раствор с глюкозой',
      priceRub: 950,
      unit: 'флакон',
      form: 'Раствор для инфузий',
      lotNumber: 'Лот #RL-3301',
      expDate: '01.2028',
      count: 0,
    },
    {
      id: 'med-05',
      name: 'Мелоксивет 0.5% (НПВП)',
      innName: 'Мелоксикам 5 мг/мл',
      priceRub: 750,
      unit: 'ампула',
      form: 'Противовоспалительное / анальгетик',
      lotNumber: 'Лот #MX-9901',
      expDate: '11.2027',
      count: 0,
    },
    {
      id: 'med-06',
      name: 'Вакцина Nobivac Rabies (Бешенство)',
      innName: 'Инактивированная антирабическая вакцина',
      priceRub: 1400,
      unit: 'доза',
      form: 'Холодовая цепь +2..+8°C',
      lotNumber: 'Лот #R102048',
      expDate: '11.2027',
      isColdChain: true,
      count: 0,
    },
  ]);

  const [consentSent, setConsentSent] = useState<boolean>(false);
  const baseVisitRub = 2800;

  const toggleProcedure = (id: string) => {
    setSelectedProcedures((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const updateMedicationCount = (id: string, delta: number) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, count: Math.max(0, m.count + delta) } : m
      )
    );
  };

  // Calculations
  const selectedProcItems = PROCEDURES_CATALOG.filter((p) => selectedProcedures.includes(p.id));
  const procTotalRub = selectedProcItems.reduce((sum, item) => sum + item.priceRub, 0);

  const activeMedItems = medications.filter((m) => m.count > 0);
  const medTotalRub = activeMedItems.reduce((sum, item) => sum + item.priceRub * item.count, 0);

  const addOnTotalRub = procTotalRub + medTotalRub;
  const grandTotalRub = baseVisitRub + addOnTotalRub;

  const handleSendConsent = () => {
    setConsentSent(true);
    const procSummary = selectedProcItems.map((i) => i.title);
    const medSummary = activeMedItems.map((m) => `${m.name} (${m.count} ${m.unit})`);
    const allSummary = [...procSummary, ...medSummary].join(', ');

    setTimeout(() => {
      if (onRequestConsent) {
        onRequestConsent(addOnTotalRub, allSummary || `+${addOnTotalRub} ₽`);
      } else {
        onBack();
      }
    }, 900);
  };

  const filteredCatalog = PROCEDURES_CATALOG.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="min-h-full pb-28 font-sans bg-slate-50/70">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад в монитор осмотра"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Выездная укладка и вет-манипуляции
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Приказ Минсельхоза РФ № 161 • Укладка выездного экипажа
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          ВетИС • Осмотр активен
        </span>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Safety HUD Ribbon */}
        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/90 flex items-center justify-between text-xs text-blue-950">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-bold">ТАЙМЕР БЕЗОПАСНОСТИ ВЕТВРАЧА: 12:45</span>
          </div>
          <span className="text-[10px] font-mono text-blue-800 font-bold flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
            <span>СПб, Большой пр. П.С., д. 48</span>
          </span>
        </div>

        {/* Patient Capsule */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-slate-900">Хаски Норд (3 года, 28.4 кг)</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                T 39.4°C
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Подозрение на острый трахеобронхит • Куратор: Смирнов А. Н.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Базовый холд:</span>
            <span className="text-xs font-mono font-black text-slate-900">{baseVisitRub} ₽</span>
          </div>
        </div>

        {/* PRIMARY MODE TABS: PROCEDURES vs MEDICATIONS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('procedures')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'procedures'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Диагностика ({selectedProcItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medications')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'medications'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Медикаменты ({activeMedItems.length})</span>
          </button>
        </div>

        {/* TAB 1: PROCEDURES */}
        {activeTab === 'procedures' && (
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 select-none">
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'ALL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Все ({PROCEDURES_CATALOG.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('EXPRESS_TEST')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'EXPRESS_TEST'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Экспресс-тесты (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('THERAPY')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'THERAPY'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Инъекции и терапия (2)
              </button>
            </div>

            {/* Procedures Catalog List */}
            <div className="space-y-3">
              {filteredCatalog.map((proc) => {
                const isSelected = selectedProcedures.includes(proc.id);
                return (
                  <div
                    key={proc.id}
                    onClick={() => toggleProcedure(proc.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>

                        <div>
                          <h3 className="text-xs font-black text-slate-900 leading-snug">
                            {proc.title}
                          </h3>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {proc.details}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-mono text-slate-900 block">
                          +{proc.priceRub.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 block mt-0.5">
                          {proc.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">
                        {proc.standardReference}
                      </span>

                      {proc.isColdChainVerified && (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          <Thermometer className="w-3 h-3 text-emerald-600" />
                          <span>Холодовая цепь +2..+8°C OK</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MEDICATIONS FROM KIT */}
        {activeTab === 'medications' && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-center justify-between">
              <span>Препараты списываются напрямую из бортового термобокса врача.</span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                СанПиН 3.3686-21
              </span>
            </div>

            <div className="space-y-3">
              {medications.map((med) => {
                const isSelected = med.count > 0;
                return (
                  <div
                    key={med.id}
                    className={`p-4 rounded-3xl border transition-all shadow-xs space-y-2.5 ${
                      isSelected
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 pr-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xs font-black text-slate-900 leading-snug">
                            {med.name}
                          </h3>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                          {med.innName} • {med.form}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
                          <span className="font-mono">{med.lotNumber}</span>
                          <span>Годен до {med.expDate}</span>
                          {med.isColdChain && (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              +2..+8°C
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Counter & Price */}
                      <div className="text-right shrink-0 flex flex-col items-end space-y-1.5">
                        <span className="text-xs font-mono font-black text-slate-900">
                          {med.priceRub.toLocaleString('ru-RU')} ₽ / {med.unit}
                        </span>

                        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateMedicationCount(med.id, -1)}
                            disabled={med.count <= 0}
                            className="w-7 h-7 rounded-lg bg-white disabled:opacity-30 text-slate-700 flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-black text-slate-900">
                            {med.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateMedicationCount(med.id, 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                        <span>Назначено: {med.count} {med.unit}</span>
                        <span className="font-mono font-black">
                          +{(med.priceRub * med.count).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Escrow Calculation & Push Dispatch Box */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-blue-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Расчет эскроу-холда ЮKassa</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">ст. 860.7 ГК РФ</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Базовый очный вызов:</span>
              <span className="font-mono font-bold">{baseVisitRub.toLocaleString('ru-RU')} ₽</span>
            </div>
            {procTotalRub > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Манипуляции и диагностика ({selectedProcItems.length}):</span>
                <span className="font-mono font-bold text-blue-600">+{procTotalRub.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            {medTotalRub > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Препараты из укладки ({activeMedItems.length}):</span>
                <span className="font-mono font-bold text-emerald-600">+{medTotalRub.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
              <span>Итоговый холдинг после согласия:</span>
              <span className="font-mono text-blue-700">{grandTotalRub.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 text-[11px] text-blue-900 leading-tight">
            При нажатии кнопки владельцу питомца направляется мгновенный push-запрос в приложение с возможностью акцепта в 1 клик через ЮKassa.
          </div>

          <button
            type="button"
            onClick={handleSendConsent}
            disabled={consentSent || addOnTotalRub === 0}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            {consentSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Запрос согласия отправлен владельцу (+{addOnTotalRub} ₽)</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 shrink-0" />
                <span>Запросить согласие у владельца (+{addOnTotalRub} ₽) →</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              ← Вернуться в монитор безопасности осмотра (Dead-Man HUD)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
