import React, { useState } from 'react';
import {
  ArrowLeft,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Box,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';

export interface DoctorMedicalKitScreenProps {
  readonly onBack: () => void;
}

export type KitCategory = 'COLD_CHAIN' | 'CONSUMABLE' | 'DIAGNOSTIC' | 'MEDICATION';

export interface KitItem {
  readonly id: string;
  name: string;
  innName?: string;
  stockCount: number;
  unit: string;
  unitPriceRub: number;
  lotNumber: string;
  expDate: string;
  category: KitCategory;
  isColdChain?: boolean;
  isArchived?: boolean;
}

export const DoctorMedicalKitScreen: React.FC<DoctorMedicalKitScreenProps> = ({
  onBack,
}) => {
  const [confirmedReady, setConfirmedReady] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(3.8);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CRUD modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<KitItem | null>(null);

  // Add form state
  const [newName, setNewName] = useState<string>('');
  const [newInnName, setNewInnName] = useState<string>('');
  const [newStockCount, setNewStockCount] = useState<number>(5);
  const [newUnit, setNewUnit] = useState<string>('доз');
  const [newPrice, setNewPrice] = useState<number>(850);
  const [newLotNumber, setNewLotNumber] = useState<string>('Лот #');
  const [newExpDate, setNewExpDate] = useState<string>('12.2027');
  const [newCategory, setNewCategory] = useState<KitCategory>('MEDICATION');
  const [newIsColdChain, setNewIsColdChain] = useState<boolean>(false);

  // Edit form state
  const [editName, setEditName] = useState<string>('');
  const [editInnName, setEditInnName] = useState<string>('');
  const [editStockCount, setEditStockCount] = useState<number>(0);
  const [editUnit, setEditUnit] = useState<string>('шт.');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editLotNumber, setEditLotNumber] = useState<string>('');
  const [editExpDate, setEditExpDate] = useState<string>('');
  const [editCategory, setEditCategory] = useState<KitCategory>('CONSUMABLE');
  const [editIsColdChain, setEditIsColdChain] = useState<boolean>(false);

  const [inventory, setInventory] = useState<KitItem[]>([
    {
      id: 'kit-1',
      name: 'Вакцина Nobivac DHPPi + Nobivac Lepto',
      innName: 'Вакцина против чумы, гепатита, парвовироза и лептоспироза',
      stockCount: 6,
      unit: 'доз',
      unitPriceRub: 2200,
      lotNumber: 'Лот #A284B91',
      expDate: '08.2027',
      category: 'COLD_CHAIN',
      isColdChain: true,
    },
    {
      id: 'kit-2',
      name: 'Вакцина антирабическая Nobivac Rabies',
      innName: 'Инактивированная вакцина против бешенства',
      stockCount: 4,
      unit: 'доз',
      unitPriceRub: 1400,
      lotNumber: 'Лот #R102048',
      expDate: '11.2027',
      category: 'COLD_CHAIN',
      isColdChain: true,
    },
    {
      id: 'kit-3',
      name: 'Экспресс-тесты CPV Ag (Парвовирус)',
      innName: 'Иммунохроматографические тест-кассеты на антиген CPV',
      stockCount: 5,
      unit: 'кассет',
      unitPriceRub: 1400,
      lotNumber: 'Лот #PV-8921',
      expDate: '10.2027',
      category: 'DIAGNOSTIC',
      isColdChain: true,
    },
    {
      id: 'kit-4',
      name: 'Экспресс-тесты Giardia Ag / Panleuko',
      innName: 'Скрининг лямблиоза и панлейкопении кошек',
      stockCount: 3,
      unit: 'кассеты',
      unitPriceRub: 1500,
      lotNumber: 'Лот #GP-4412',
      expDate: '04.2027',
      category: 'DIAGNOSTIC',
    },
    {
      id: 'kit-5',
      name: 'Антибиотик Синулокс RTU 250 мг',
      innName: 'Амоксициллин + Клавулановая кислота',
      stockCount: 8,
      unit: 'доз',
      unitPriceRub: 850,
      lotNumber: 'Лот #SL-8812',
      expDate: '05.2028',
      category: 'MEDICATION',
    },
    {
      id: 'kit-6',
      name: 'Противорвотное Серения 10 мг/мл',
      innName: 'Маропитант цитрат моногидрат',
      stockCount: 4,
      unit: 'доз',
      unitPriceRub: 1100,
      lotNumber: 'Лот #CR-5021',
      expDate: '09.2027',
      category: 'MEDICATION',
    },
    {
      id: 'kit-7',
      name: 'Микрочипы RFID ISO 11784/11785 в инъекторах',
      innName: 'Транспондер стеклянный микрочип 1.4x8 мм',
      stockCount: 12,
      unit: 'шт.',
      unitPriceRub: 1800,
      lotNumber: 'Лот #RU-9014',
      expDate: '12.2030',
      category: 'CONSUMABLE',
    },
    {
      id: 'kit-8',
      name: 'Стерильные инфузионные системы «Бабочка» G23/G25',
      innName: 'Инфузионные катетеры-бабочки с адаптером Луер',
      stockCount: 10,
      unit: 'шт.',
      unitPriceRub: 250,
      lotNumber: 'Лот #BF-1092',
      expDate: '06.2028',
      category: 'CONSUMABLE',
    },
    {
      id: 'kit-9',
      name: 'Раствор Рингер-Локк 200 мл флакон',
      innName: 'Комплексный солевой раствор с глюкозой',
      stockCount: 6,
      unit: 'фл.',
      unitPriceRub: 950,
      lotNumber: 'Лот #RL-3301',
      expDate: '01.2028',
      category: 'MEDICATION',
    },
    {
      id: 'kit-10',
      name: 'Антисептические растворы (Хлоргексидин 0.05%, Бетадин)',
      innName: 'Хлоргексидина биглюконат + Повидон-йод',
      stockCount: 4,
      unit: 'фл.',
      unitPriceRub: 300,
      lotNumber: 'Лот #ANT-902',
      expDate: '03.2028',
      category: 'CONSUMABLE',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirm = () => {
    setConfirmedReady(true);
    showToast('Готовность укладки зафиксирована в журнале смены СанПиН 3.3686-21!');
    setTimeout(() => setConfirmedReady(false), 4000);
  };

  const handleCalibrateTemp = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      // Simulate random micro-fluctuation within safe range 3.6 - 4.1
      const newT = +(3.6 + Math.random() * 0.5).toFixed(1);
      setTemperature(newT);
      setIsCalibrating(false);
      showToast(`Телеметрия обновлена: +${newT}°C. Холодовая цепь в норме.`);
    }, 800);
  };

  const handleOpenEdit = (item: KitItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditName(item.name);
    setEditInnName(item.innName || '');
    setEditStockCount(item.stockCount);
    setEditUnit(item.unit);
    setEditPrice(item.unitPriceRub);
    setEditLotNumber(item.lotNumber);
    setEditExpDate(item.expDate);
    setEditCategory(item.category);
    setEditIsColdChain(!!item.isColdChain);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!editName.trim()) return;

    setInventory((prev) =>
      prev.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              name: editName.trim(),
              innName: editInnName.trim(),
              stockCount: editStockCount,
              unit: editUnit.trim(),
              unitPriceRub: editPrice,
              lotNumber: editLotNumber.trim(),
              expDate: editExpDate.trim(),
              category: editCategory,
              isColdChain: editIsColdChain,
            }
          : it
      )
    );
    setEditingItem(null);
    showToast('Параметры позиции успешно обновлены!');
  };

  const handleArchiveItem = (id: string) => {
    setInventory((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isArchived: true } : it))
    );
    setEditingItem(null);
    showToast('Позиция списана из выездной укладки');
  };

  const handleAddItem = () => {
    if (!newName.trim()) return;

    const newItem: KitItem = {
      id: `kit-${Date.now()}`,
      name: newName.trim(),
      innName: newInnName.trim(),
      stockCount: newStockCount,
      unit: newUnit.trim(),
      unitPriceRub: newPrice,
      lotNumber: newLotNumber.trim(),
      expDate: newExpDate.trim(),
      category: newCategory,
      isColdChain: newIsColdChain,
    };

    setInventory((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewName('');
    setNewInnName('');
    setNewStockCount(5);
    setNewPrice(850);
    setNewLotNumber('Лот #');
    setNewExpDate('12.2027');
    setNewCategory('MEDICATION');
    setNewIsColdChain(false);
    showToast('Препарат добавлен в опись выездной укладки!');
  };

  const activeInventory = inventory.filter((i) => !i.isArchived);
  const totalItemsCount = activeInventory.reduce((acc, i) => acc + i.stockCount, 0);

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
              Укладка и биопрепараты
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Выездной медбокс • СанПиН 3.3686-21
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Препарат</span>
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Cold-Chain Telemetry Dashboard Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-3xl p-5 border-2 border-emerald-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Холодовая цепь активна (I–IV уровни)</span>
            </span>
            <button
              type="button"
              onClick={handleCalibrateTemp}
              disabled={isCalibrating}
              className="text-[10px] font-mono font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 text-emerald-600 ${isCalibrating ? 'animate-spin' : ''}`} />
              <span>{isCalibrating ? 'Опрос...' : 'Сверить'}</span>
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Температура термоконтейнера:
              </span>
              <span className="text-3xl font-black font-mono text-emerald-700">
                +{temperature}°C
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">Норматив СанПиН:</span>
              <span className="text-xs font-mono font-bold text-slate-800">+2.0°C .. +8.0°C</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Термодатчик спецборта непрерывно передает телеметрию в ФГИС «ВетИС» (Меркурий). Нарушений температурного режима за последние 48 часов не зафиксировано.
          </p>
        </div>

        {/* Consumables Inventory List */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Опись медицинских позиций ({activeInventory.length} наим., {totalItemsCount} ед.)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Остатки выездного бокса
            </span>
          </div>

          <div className="space-y-2.5">
            {activeInventory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5 pr-2 flex-1">
                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    {item.innName && (
                      <p className="text-[10px] text-slate-500 italic">
                        {item.innName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {item.stockCount} {item.unit}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(item, e)}
                      aria-label="Редактировать позицию"
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-600">{item.lotNumber}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {item.unitPriceRub.toLocaleString('ru-RU')} ₽ / {item.unit}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.isColdChain && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        +2..+8°C
                      </span>
                    )}
                    <span>Годен до {item.expDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Confirm readiness */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Подтвердить готовность укладки к выезду (СанПиН)</span>
          </button>

          {confirmedReady && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Готовность укладки зафиксирована в журнале смены!</span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD ITEM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Добавить препарат в укладку
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
                  Торговое наименование
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Например: Мелоксивет 0.5% инъекционный"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  МНН / Действующее вещество
                </label>
                <input
                  type="text"
                  value={newInnName}
                  onChange={(e) => setNewInnName(e.target.value)}
                  placeholder="Например: Мелоксикам"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Остаток
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newStockCount}
                    onChange={(e) => setNewStockCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Ед. изм.
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="доз, шт."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Цена за ед. (₽)
                  </label>
                  <input
                    type="number"
                    step={50}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Серия / Номер лота
                  </label>
                  <input
                    type="text"
                    value={newLotNumber}
                    onChange={(e) => setNewLotNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Срок годности
                  </label>
                  <input
                    type="text"
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    placeholder="12.2028"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Категория
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KitCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="MEDICATION">Препарат / Инъекция</option>
                  <option value="COLD_CHAIN">Холодовая цепь (+2..+8°C)</option>
                  <option value="CONSUMABLE">Расходный материал</option>
                  <option value="DIAGNOSTIC">Экспресс-диагностика</option>
                </select>
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsColdChain}
                  onChange={(e) => setNewIsColdChain(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-emerald-950 font-bold">
                  Требует хранения в термоконтейнере (+2°C .. +8°C)
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
                onClick={handleAddItem}
                disabled={!newName.trim()}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ITEM */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Pencil className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  Редактировать позицию
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
                  Наименование
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  МНН
                </label>
                <input
                  type="text"
                  value={editInnName}
                  onChange={(e) => setEditInnName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Остаток
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editStockCount}
                    onChange={(e) => setEditStockCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Ед. изм.
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Цена за ед. (₽)
                  </label>
                  <input
                    type="number"
                    step={50}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Серия / Лот
                  </label>
                  <input
                    type="text"
                    value={editLotNumber}
                    onChange={(e) => setEditLotNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Годен до
                  </label>
                  <input
                    type="text"
                    value={editExpDate}
                    onChange={(e) => setEditExpDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsColdChain}
                  onChange={(e) => setEditIsColdChain(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-emerald-950 font-bold">
                  Требует холодовой цепи (+2..+8°C)
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
                <span>Списать</span>
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
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
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
