import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Check,
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface DoctorPriceListScreenProps {
  readonly onBack: () => void;
}

export type ServiceCategory = 'VISIT' | 'DIAGNOSTICS' | 'THERAPY' | 'SURGERY' | 'HYGIENE';

export interface PriceItem {
  readonly id: string;
  title: string;
  priceRub: number;
  category: ServiceCategory;
  categoryLabel: string;
  durationMin: number;
  enabled: boolean;
  requiresVetis?: boolean;
  description?: string;
  isArchived?: boolean;
}

const CATEGORY_MAP: Record<ServiceCategory, string> = {
  VISIT: 'Вызовы',
  DIAGNOSTICS: 'Диагностика',
  THERAPY: 'Терапия',
  SURGERY: 'Хирургия',
  HYGIENE: 'Гигиена',
};

export const DoctorPriceListScreen: React.FC<DoctorPriceListScreenProps> = ({
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const [services, setServices] = useState<PriceItem[]>([
    {
      id: 'srv-1',
      title: 'Базовый очный вызов ветврача на дом',
      priceRub: 2800,
      category: 'VISIT',
      categoryLabel: 'Вызовы',
      durationMin: 45,
      enabled: true,
      requiresVetis: true,
      description: 'Клинический осмотр, термометрия, аускультация, план лечения',
    },
    {
      id: 'srv-2',
      title: 'Срочный триаж / экстренный выезд экипажа (до 20 мин)',
      priceRub: 3500,
      category: 'VISIT',
      categoryLabel: 'Вызовы',
      durationMin: 60,
      enabled: true,
      requiresVetis: true,
      description: 'Приоритетный выезд реанимационного экипажа с кислородом',
    },
    {
      id: 'srv-3',
      title: 'Экспресс-тест на антиген парвовируса / коронавируса (CPV/CCV)',
      priceRub: 1400,
      category: 'DIAGNOSTICS',
      categoryLabel: 'Диагностика',
      durationMin: 15,
      enabled: true,
      requiresVetis: true,
      description: 'Иммунохроматографический тест с регистрацией в журнале эпизоотий',
    },
    {
      id: 'srv-4',
      title: 'Люминесцентная диагностика лампой Вуда (дерматомикозы)',
      priceRub: 600,
      category: 'DIAGNOSTICS',
      categoryLabel: 'Диагностика',
      durationMin: 10,
      enabled: true,
      description: 'Скрининг шерсти и кожных покровов под УФ-излучением 365 нм',
    },
    {
      id: 'srv-5',
      title: 'Чипирование микрочипом ISO 11784/85 с занесением в «Хорриот»',
      priceRub: 1800,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 15,
      enabled: true,
      requiresVetis: true,
      description: 'Имплантация микрочипа 1.4x8 мм и синхронизация с ФГИС ВетИС',
    },
    {
      id: 'srv-6',
      title: 'Вакцинация комплексная Nobivac DHPPi + Lepto',
      priceRub: 2200,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 20,
      enabled: true,
      requiresVetis: true,
      description: 'Вакцинация с отметкой в ветпаспорте и фиксацией серии в системе',
    },
    {
      id: 'srv-7',
      title: 'Подкожная инфузионная терапия (Рингер-Локк 200 мл)',
      priceRub: 950,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 30,
      enabled: true,
      description: 'Капельное введение сбалансированного солевого раствора',
    },
    {
      id: 'srv-8',
      title: 'Первичная хирургическая обработка раны без ушивания',
      priceRub: 1600,
      category: 'SURGERY',
      categoryLabel: 'Хирургия',
      durationMin: 25,
      enabled: true,
      description: 'Антисептическая санация, иссечение некротизированных тканей',
    },
    {
      id: 'srv-9',
      title: 'ПХО раны с послойным наложением хирургических швов',
      priceRub: 2800,
      category: 'SURGERY',
      categoryLabel: 'Хирургия',
      durationMin: 45,
      enabled: true,
      description: 'Послойная пластика мягких тканей с атравматическим монофиламентом',
    },
    {
      id: 'srv-10',
      title: 'Санация наружного слухового прохода и отоскопия',
      priceRub: 850,
      category: 'HYGIENE',
      categoryLabel: 'Гигиена',
      durationMin: 15,
      enabled: true,
      description: 'Отоскопический осмотр барабанной перепонки и промывание лосьоном',
    },
    {
      id: 'srv-11',
      title: 'Забор венозной крови на БХ и ОАК с термодоставкой в лабораторию',
      priceRub: 700,
      category: 'DIAGNOSTICS',
      categoryLabel: 'Диагностика',
      durationMin: 15,
      enabled: true,
      requiresVetis: true,
      description: 'Венепункция в вакуумную пробирку с K3-EDTA и транспортировка в термобоксе',
    },
    {
      id: 'srv-12',
      title: 'Постановка внутривенного катетера (G22/G24)',
      priceRub: 800,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 15,
      enabled: true,
      description: 'Установка периферического венозного доступа с фиксацией пластырем',
    },
    {
      id: 'srv-13',
      title: 'Санация параанальных синусов',
      priceRub: 650,
      category: 'HYGIENE',
      categoryLabel: 'Гигиена',
      durationMin: 10,
      enabled: true,
      description: 'Мануальное опорожнение и антисептическая обработка синусов',
    },
    {
      id: 'srv-14',
      title: 'Гигиеническая стрижка когтей с обработкой',
      priceRub: 500,
      category: 'HYGIENE',
      categoryLabel: 'Гигиена',
      durationMin: 10,
      enabled: true,
      description: 'Стрижка когтей когтерезом с коагуляцией при необходимости',
    },
    {
      id: 'srv-15',
      title: 'Купирование рвоты: инъекция Серения (Маропитант)',
      priceRub: 1100,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 10,
      enabled: true,
      description: 'Подкожное введение противорвотного препарата центрального действия',
    },
    {
      id: 'srv-16',
      title: 'ЭКГ-скрининг на мобильном кардиографе',
      priceRub: 1500,
      category: 'DIAGNOSTICS',
      categoryLabel: 'Диагностика',
      durationMin: 20,
      enabled: true,
      description: '6-канальная электрокардиография с предварительной расшифровкой ритма',
    },
    {
      id: 'srv-17',
      title: 'Офтальмологический тест с флюоресцеином (целостность роговицы)',
      priceRub: 750,
      category: 'DIAGNOSTICS',
      categoryLabel: 'Диагностика',
      durationMin: 10,
      enabled: true,
      description: 'Окрашивание роговицы раствором флюоресцеина для выявления язв и эрозий',
    },
    {
      id: 'srv-18',
      title: 'Клиническая консультация по диетотерапии и коррекции рациона',
      priceRub: 900,
      category: 'THERAPY',
      categoryLabel: 'Терапия',
      durationMin: 25,
      enabled: true,
      description: 'Расчет калорийности и нутриентов при патологиях ЖКТ и почек',
    },
  ]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New service form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrice, setNewPrice] = useState<number>(1000);
  const [newCategory, setNewCategory] = useState<ServiceCategory>('THERAPY');
  const [newDuration, setNewDuration] = useState<number>(20);
  const [newRequiresVetis, setNewRequiresVetis] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>('');

  // Editing form state
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<ServiceCategory>('THERAPY');
  const [editDuration, setEditDuration] = useState<number>(15);
  const [editRequiresVetis, setEditRequiresVetis] = useState<boolean>(false);
  const [editDescription, setEditDescription] = useState<string>('');
  const [editEnabled, setEditEnabled] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleService = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleOpenEdit = (item: PriceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditTitle(item.title);
    setEditPrice(item.priceRub);
    setEditCategory(item.category);
    setEditDuration(item.durationMin);
    setEditRequiresVetis(!!item.requiresVetis);
    setEditDescription(item.description || '');
    setEditEnabled(item.enabled);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!editTitle.trim()) return;

    setServices((prev) =>
      prev.map((s) =>
        s.id === editingItem.id
          ? {
              ...s,
              title: editTitle.trim(),
              priceRub: editPrice,
              category: editCategory,
              categoryLabel: CATEGORY_MAP[editCategory],
              durationMin: editDuration,
              requiresVetis: editRequiresVetis,
              description: editDescription.trim(),
              enabled: editEnabled,
            }
          : s
      )
    );
    setEditingItem(null);
    showToast('Услуга успешно обновлена!');
  };

  const handleArchiveItem = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isArchived: true, enabled: false } : s))
    );
    setEditingItem(null);
    showToast('Услуга перенесена в архив');
  };

  const handleCreateService = () => {
    if (!newTitle.trim()) return;

    const newItem: PriceItem = {
      id: `srv-${Date.now()}`,
      title: newTitle.trim(),
      priceRub: newPrice,
      category: newCategory,
      categoryLabel: CATEGORY_MAP[newCategory],
      durationMin: newDuration,
      enabled: true,
      requiresVetis: newRequiresVetis,
      description: newDescription.trim(),
    };

    setServices((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewPrice(1000);
    setNewDuration(20);
    setNewRequiresVetis(false);
    setNewDescription('');
    showToast('Новая услуга успешно добавлена в прейскурант!');
  };

  const nonArchivedServices = services.filter((s) => !s.isArchived);

  const filteredServices = nonArchivedServices.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const enabledCount = nonArchivedServices.filter((s) => s.enabled).length;

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Bar Header */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Прейскурант ветуслуг и процедур
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              {nonArchivedServices.length} позиций • {enabledCount} активно на смене
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Услуга</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Toast alert */}
        {toastMessage && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по процедуре, манипуляции, категории..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 select-none">
          {[
            { id: 'ALL', label: `Все (${nonArchivedServices.length})` },
            { id: 'VISIT', label: `Вызовы (${nonArchivedServices.filter((s) => s.category === 'VISIT').length})` },
            { id: 'DIAGNOSTICS', label: `Диагностика (${nonArchivedServices.filter((s) => s.category === 'DIAGNOSTICS').length})` },
            { id: 'THERAPY', label: `Терапия (${nonArchivedServices.filter((s) => s.category === 'THERAPY').length})` },
            { id: 'SURGERY', label: `Хирургия (${nonArchivedServices.filter((s) => s.category === 'SURGERY').length})` },
            { id: 'HYGIENE', label: `Гигиена (${nonArchivedServices.filter((s) => s.category === 'HYGIENE').length})` },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services List with Action Controls */}
        <div className="space-y-2.5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-3xl border transition-all flex items-start justify-between ${
                service.enabled
                  ? 'bg-white border-slate-200/90 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-1.5 pr-2 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {service.categoryLabel} • {service.durationMin} мин
                  </span>
                  {service.requiresVetis && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>ВетИС</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-black text-slate-900 leading-snug">
                  {service.title}
                </h3>

                {service.description && (
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {service.description}
                  </p>
                )}

                <span className="text-xs font-mono font-black text-blue-700 block pt-0.5">
                  {service.priceRub.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              {/* Action Buttons: Edit & Toggle */}
              <div className="flex items-center space-x-2 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(service, e)}
                  title="Редактировать услугу"
                  aria-label="Редактировать"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => toggleService(service.id, e)}
                  title={service.enabled ? 'Отключить на смене' : 'Включить на смене'}
                  aria-label="Переключить активность"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    service.enabled
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'border border-slate-300 bg-white text-transparent'
                  }`}
                >
                  {service.enabled && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-[11px] text-blue-900 leading-tight">
          Отключенные позиции временно скрываются из меню дозаказа прикроватных процедур во время текущего дежурства врача. 
          Тарифы синхронизируются с фискальным шлюзом 54-ФЗ.
        </div>
      </div>

      {/* MODAL: ADD SERVICE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Добавить услугу в прейскурант
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Категория манипуляции
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="VISIT">Вызовы</option>
                  <option value="DIAGNOSTICS">Диагностика</option>
                  <option value="THERAPY">Терапия</option>
                  <option value="SURGERY">Хирургия</option>
                  <option value="HYGIENE">Гигиена</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Название ветуслуги / процедуры
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Люминесцентная проба роговицы"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Базовая цена (₽)
                  </label>
                  <input
                    type="number"
                    step={50}
                    min={100}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Длительность (мин)
                  </label>
                  <input
                    type="number"
                    step={5}
                    min={5}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Клиническое описание / норматив
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Расходные материалы, стандарты выполнения..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* VetIS Checkbox */}
              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newRequiresVetis}
                  onChange={(e) => setNewRequiresVetis(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-blue-950 font-bold">
                  Требуется обязательная фиксация в ФГИС «ВетИС» (Хорриот)
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-1/2 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleCreateService}
                disabled={!newTitle.trim()}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  Редактировать услугу
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Категория
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="VISIT">Вызовы</option>
                  <option value="DIAGNOSTICS">Диагностика</option>
                  <option value="THERAPY">Терапия</option>
                  <option value="SURGERY">Хирургия</option>
                  <option value="HYGIENE">Гигиена</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    step={50}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Длительность (мин)
                  </label>
                  <input
                    type="number"
                    step={5}
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editRequiresVetis}
                  onChange={(e) => setEditRequiresVetis(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-blue-950 font-bold">
                  Требуется отметка в ФГИС «ВетИС» (Хорриот)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editEnabled}
                  onChange={(e) => setEditEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-800 font-bold">
                  Услуга активна на текущей смене
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleArchiveItem(editingItem.id)}
                className="py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>В архив</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
