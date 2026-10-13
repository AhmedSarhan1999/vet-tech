import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Car,
  Navigation,
  CheckCircle2,
  Check,
  Zap,
  Save,
} from 'lucide-react';

export interface DoctorLogisticsScreenProps {
  readonly onBack: () => void;
}

export const DoctorLogisticsScreen: React.FC<DoctorLogisticsScreenProps> = ({
  onBack,
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(4.8);
  const [selectedClusters, setSelectedClusters] = useState<string[]>([
    'petrogradsky',
    'krestovsky',
    'vasileostrovsky',
  ]);
  const [equipmentList, setEquipmentList] = useState<Array<{ id: string; label: string; checked: boolean }>>([
    { id: 'eq-1', label: 'Санитарный паспорт спецавто (действителен до 11.2026)', checked: true },
    { id: 'eq-2', label: 'Бортовой инвертор 220V 1500W для центрифуги и УЗИ', checked: true },
    { id: 'eq-3', label: 'Портативный кислородный концентратор O2 (проверен)', checked: true },
    { id: 'eq-4', label: 'Электронный термобокс с датчиком холода +2..+8°C', checked: true },
  ]);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const clusters = [
    { id: 'petrogradsky', name: 'Петроградский район', eta: '8–12 мин', activeCases: 4 },
    { id: 'krestovsky', name: 'Крестовский остров', eta: '10–15 мин', activeCases: 2 },
    { id: 'vasileostrovsky', name: 'Василеостровский район', eta: '14–18 мин', activeCases: 5 },
    { id: 'primorsky', name: 'Приморский район (Южная часть)', eta: '20–25 мин', activeCases: 7 },
    { id: 'central', name: 'Центральный район', eta: '18–22 мин', activeCases: 6 },
  ];

  const toggleCluster = (id: string) => {
    setSelectedClusters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleEquipment = (id: string) => {
    setEquipmentList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

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
              Зона выездов и зоо-логистика
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Полигон дежурства • Сектор VET-Север
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
          GPS Спецборт #14
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Live Cluster HUD Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-blue-100">
            <span className="uppercase font-bold tracking-wider flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Полигон выездного экипажа</span>
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold text-white text-[10px]">
              В эфире дежурства
            </span>
          </div>

          <div>
            <h2 className="text-base font-black">
              Сектор VET-Север (СПб)
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Базирование: Чкаловский пр. / ул. Ленина • Радиус: {radiusKm} км
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-blue-200 block">Транспорт экипажа</span>
              <strong className="text-white">Renault Duster 4x4</strong>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-[10px] text-blue-200 block">Среднее время доезда</span>
              <strong className="text-white font-mono">~15–20 минут</strong>
            </div>
          </div>
        </div>

        {/* Radius Slider Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Радиус оперативного выезда
              </h3>
            </div>
            <span className="text-xs font-black font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
              {radiusKm} км
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Регулирует предельное расстояние, в рамках которого система авто-диспетчеризации распределяет вызовы первого приоритета.
          </p>

          <div className="space-y-1.5 pt-1">
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.2"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>2.0 км (Пеший / Экспресс)</span>
              <span>8.0 км</span>
              <span>15.0 км (Весь город)</span>
            </div>
          </div>
        </div>

        {/* Cluster Toggles */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Разрешенные районы обслуживания
          </h3>

          <div className="space-y-2">
            {clusters.map((c) => {
              const isSelected = selectedClusters.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCluster(c.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{c.name}</h4>
                    <span className="text-[10px] text-slate-500">
                      Доезд: {c.eta} • Активных обращений: {c.activeCases}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Equipment Checklist */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Оснащение спецавтомобиля
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              СанПиН OK
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                onClick={() => toggleEquipment(eq.id)}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800 text-[11px]">{eq.label}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    eq.checked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {eq.checked && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Сохранить параметры полигона логистики</span>
          </button>

          {isSaved && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Параметры логистики обновлены. Диспетчерская служба перенастроена!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
