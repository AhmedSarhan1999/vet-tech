import React, { useState } from 'react';
import {
  MapPin,
  Car,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  ExternalLink,
  Thermometer,
  BatteryCharging,
  FileText,
} from 'lucide-react';

export interface DoctorDashboardScreenProps {
  readonly onOpenVisit?: (visitId: string) => void;
  readonly onOpenCalendar?: () => void;
  readonly onOpenWallet?: () => void;
}

export const DoctorDashboardScreen: React.FC<DoctorDashboardScreenProps> = ({
  onOpenVisit,
  onOpenCalendar,
  onOpenWallet,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [radiusKm, setRadiusKm] = useState<number>(4.5);
  const [isEditingRadius, setIsEditingRadius] = useState<boolean>(false);

  const handleToggleOnline = () => {
    setIsOnline((prev) => !prev);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-blue-700 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 ring-2 ring-emerald-400/30">
            РК
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                Д-р Романов К. В.
              </h1>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                СПбГУВМ
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Терапевт / Хирург • ВетИС Horriot-УКЭП • 4979-1-ФЗ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCalendar}
          className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          aria-label="Открыть расписание"
        >
          <Clock className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Duty Shift Switch Card */}
        <div
          className={`rounded-3xl p-4 border transition-all duration-300 shadow-xs ${
            isOnline
              ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white border-emerald-300'
              : 'bg-white border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isOnline ? 'НА ЛИНИИ (ONLINE) • ГОТОВ К ВЫЕЗДАМ' : 'СМЕНА ЗАКРЫТА (OFFLINE)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {isOnline
                  ? 'Автоматический прием экстренных вызовов скорой ветпомощи'
                  : 'Вызовы временно перенаправляются дежурным экипажам'}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isOnline}
              onClick={handleToggleOnline}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                isOnline ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Live Traffic & Demand Radar Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Гео-кластер и радар вызовов</h3>
                <p className="text-[10px] text-slate-400">Санкт-Петербург • GPS Экипаж Вет-04</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-black uppercase">
                <TrendingUp className="w-3 h-3 text-rose-600 shrink-0 mr-1" />
                Высокий спрос
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Кластер</span>
              <span className="font-black text-slate-900 text-xs">Петроградский</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Радиус выезда</span>
              {isEditingRadius ? (
                <div className="flex items-center justify-center space-x-1 mt-0.5">
                  <input
                    type="number"
                    value={radiusKm}
                    step={0.5}
                    min={1}
                    max={15}
                    onChange={(e) => setRadiusKm(parseFloat(e.target.value) || 4.5)}
                    className="w-12 text-xs font-mono font-bold text-center border rounded bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingRadius(false)}
                    className="text-[10px] text-blue-600 font-bold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingRadius(true)}
                  className="font-black text-blue-700 text-xs hover:underline cursor-pointer"
                >
                  {radiusKm} км
                </button>
              )}
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Пробки СПб</span>
              <span className="font-black text-emerald-700 text-xs">4 балла • ~18 мин</span>
            </div>
          </div>
        </div>

        {/* Luminous Balance & Earnings Card (Bright & Cheerful Light Theme - ZERO DARK SLABS) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-200/90 space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600 shrink-0 mr-1" />
                422-ФЗ Налог на проф. доход (НПД)
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  13 200 ₽
                </span>
                <span className="text-xs font-bold text-emerald-700">к выплате</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Заработано за смену: <strong className="text-slate-900">11 400 ₽ за 3 выезда</strong>
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold">
                СБП 0%
              </span>
              <p className="text-[10px] text-slate-400">Чаевые: +1 800 ₽</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
            <span className="text-[11px] font-semibold">
              Прямые чаевые через СБП: <strong>1 800 ₽</strong> (100% врачу, 0% комиссии сервиса)
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenWallet}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Вывести 13 200 ₽ на карту через СБП →</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Planned Visits Queue */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Очередь вызовов на сегодня (2)</span>
            </h3>
            <button
              type="button"
              onClick={onOpenCalendar}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Все расписание →
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Visit 1: Nord */}
            <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-900">14:00 • Очный выезд на дом</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      ВЕТ-7041
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mt-1">
                    Хаски Норд (4 года) • Острый гастроэнтерит
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    г. СПб, ул. Ленина, д. 28, кв. 42 (домофон 42#, 4 этаж)
                  </p>
                </div>

                <span className="text-xs font-mono font-black text-slate-900 shrink-0">
                  4 700 ₽
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1 border-t border-blue-200/60 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenVisit?.('ВЕТ-7041')}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Начать визит (PIN-код) →
                </button>
                <a
                  href="https://yandex.ru/maps"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-white text-slate-700 border border-slate-200 font-bold flex items-center space-x-1 hover:bg-slate-50 transition-colors"
                >
                  <span>Маршрут</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Visit 2: Marquis */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-900">17:00 • Плановая вакцинация</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      ВЕТ-7042
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mt-1">
                    Кот Маркиз (3 года) • Вакцинация Nobivac + Чип
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    пос. Токсово, ул. Озерная, д. 14 (частный сектор)
                  </p>
                </div>

                <span className="text-xs font-mono font-black text-slate-900 shrink-0">
                  3 900 ₽
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1 border-t border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenVisit?.('ВЕТ-7042')}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-center text-xs transition-colors cursor-pointer"
                >
                  Подробнее о пациенте
                </button>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                  <FileText className="w-3 h-3" />
                  <span>ВетИС паспорт</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Medical Kit Checklist (SanPiN & Ministry of Agriculture) */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Чек-лист экипажа (СанПиН & Минсельхоз РФ)</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Все системы в норме
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BatteryCharging className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Сканер RFID микрочипов ISO 11784/85</span>
              </div>
              <span className="text-emerald-700 font-mono font-bold text-[11px]">Заряд 100%</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Экспресс-тесты Parvo & Panleiko</span>
              </div>
              <span className="text-blue-700 font-mono font-bold text-[11px]">4 набора (Лот #VET-812)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Люминесцентная лампа Вуда & СИЗ</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">Готов к осмотру</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold text-emerald-950">Термоконтейнер для биопрепаратов</span>
              </div>
              <span className="text-emerald-800 font-mono font-black text-xs">+4.2°C (Норма СанПиН)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
