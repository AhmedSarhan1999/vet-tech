import React, { useState } from 'react';
import {
  MapPin,
  Car,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  UserCheck,
  Navigation,
  Check,
  Volume2,
  X,
  CreditCard,
} from 'lucide-react';

export interface AdminDispatchScreenProps {
  readonly onOpenSafety?: () => void;
  readonly onOpenArbitration?: () => void;
}

export const AdminDispatchScreen: React.FC<AdminDispatchScreenProps> = ({
  onOpenSafety,
  onOpenArbitration,
}) => {
  // Layer toggles state
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showColdChain, setShowColdChain] = useState<boolean>(true);
  const [showQuarantine, setShowQuarantine] = useState<boolean>(false);

  // Call queue tabs
  const [activeQueueTab, setActiveQueueTab] = useState<'URGENT' | 'IN_PROGRESS'>('URGENT');
  const [isUrgentAssigned, setIsUrgentAssigned] = useState<boolean>(false);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  // Audio channel modal
  const [activeAudioChannel, setActiveAudioChannel] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setDispatchToast(msg);
    setTimeout(() => setDispatchToast(null), 3500);
  };

  const handleAssignDoctor = () => {
    setIsUrgentAssigned(true);
    showNotification('Экипаж Д-ра Васильева К. М. назначен на экстренный вызов (Комендантский пр., 12). Маршрут передан в бортовой планшет.');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-slate-50/60 min-h-full">
      {/* Toast Notification */}
      {dispatchToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2.5 shadow-lg animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Audio Channel Modal (MTS Exolve) */}
      {activeAudioChannel && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  Защищенный аудиоканал связи
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAudioChannel(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">Шлюз MTS Exolve Voice API:</span>
                <span className="text-[10px] font-mono font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Защищенный транк
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Сквозное шифрование аудиопотока экипажа. Прямое соединение с микрофоном носимого терминала врача: <strong>{activeAudioChannel}</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center py-4 space-y-2 flex-col">
              <div className="flex items-center space-x-1">
                {[40, 70, 30, 85, 95, 60, 45, 90, 35, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-blue-600 rounded-full animate-pulse max-h-12"
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                Аудиоканал открыт • Качество 48 kHz
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveAudioChannel(null)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Отключить аудиоканал
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: LIVE SAINT PETERSBURG RADAR MAP & CONTROLS */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">
                Радар геопозиционирования выездных экипажей (Санкт-Петербург)
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold">
                ГЛОНАСС / GPS спутниковый трекинг • Обновление каждые 3 секунды
              </p>
            </div>
          </div>

          {/* Cluster Telemetry Badges */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              Петроградский: <strong className="text-blue-700">5 экипажей</strong>
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              Василеостровский: <strong className="text-blue-700">4 экипажа</strong>
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              Приморский: <strong className="text-blue-700">5 экипажей</strong>
            </span>
          </div>
        </div>

        {/* Interactive Simulated Geofence Map Area */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200/50 border-2 border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between p-4">
          {/* Map Grid Background Stylization */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* District Labels */}
          <div className="absolute top-6 left-8 pointer-events-none select-none text-[11px] font-black uppercase tracking-wider text-slate-400/80">
            Приморский район
          </div>
          <div className="absolute top-1/2 left-1/3 pointer-events-none select-none text-[11px] font-black uppercase tracking-wider text-slate-400/80">
            Петроградская сторона
          </div>
          <div className="absolute bottom-8 left-12 pointer-events-none select-none text-[11px] font-black uppercase tracking-wider text-slate-400/80">
            Васильевский остров
          </div>
          <div className="absolute bottom-10 right-16 pointer-events-none select-none text-[11px] font-black uppercase tracking-wider text-slate-400/80">
            Центральный район
          </div>

          {/* Interactive Marker 1: Urgent Call Marker (Red Pulsing) */}
          <div className="absolute top-16 left-28 z-10 group cursor-pointer">
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping" />
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute top-11 -left-12 bg-white rounded-xl px-2.5 py-1 shadow-md border border-rose-200 text-[10px] font-bold text-slate-900 whitespace-nowrap">
              <span className="text-rose-600 block">СРОЧНЫЙ ШОК</span>
              Комендантский пр., 12
            </div>
          </div>

          {/* Interactive Marker 2: Reserve Unit Marker (Amber) */}
          <div className="absolute top-44 left-1/2 z-10 group cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform group-hover:scale-110">
              <Car className="w-4 h-4" />
            </div>
            <div className="absolute top-10 -left-10 bg-white rounded-xl px-2.5 py-1 shadow-md border border-amber-200 text-[10px] font-bold text-slate-900 whitespace-nowrap">
              <span className="text-amber-600 block">Резерв Вет-07</span>
              Большой пр. П.С.
            </div>
          </div>

          {/* Interactive Marker 3: In-Exam Doctor Marker (Blue) */}
          <div className="absolute bottom-24 left-2/3 z-10 group cursor-pointer">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white transition-transform group-hover:scale-110">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="absolute top-10 -left-10 bg-white rounded-xl px-2.5 py-1 shadow-md border border-blue-200 text-[10px] font-bold text-slate-900 whitespace-nowrap">
              <span className="text-blue-600 block">Осмотр: Хаски Норд</span>
              Д-р Соколова (ул. Ленина)
            </div>
          </div>

          {/* Layer Toggles Toolbar inside map */}
          <div className="z-20 bg-white/95 backdrop-blur-xs rounded-2xl p-2.5 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2 max-w-xl">
            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-700 pr-2 border-r border-slate-200">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Слои:</span>
            </div>

            <button
              type="button"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                showHeatmap
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check className={`w-3 h-3 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`} />
              <span>Тепловая карта</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTraffic(!showTraffic)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                showTraffic
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check className={`w-3 h-3 ${showTraffic ? 'opacity-100' : 'opacity-0'}`} />
              <span>Пробки (4 балла)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowColdChain(!showColdChain)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                showColdChain
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check className={`w-3 h-3 ${showColdChain ? 'opacity-100' : 'opacity-0'}`} />
              <span>Холодовая цепь</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQuarantine(!showQuarantine)}
              className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                showQuarantine
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Check className={`w-3 h-3 ${showQuarantine ? 'opacity-100' : 'opacity-0'}`} />
              <span>Зоны карантина</span>
            </button>
          </div>
        </div>

        {/* Bottom Telemetry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div
            onClick={onOpenSafety}
            className={`p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1 transition-all ${
              onOpenSafety ? 'hover:border-emerald-400 cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-800">
                Таймер Dead-Man
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black font-mono text-emerald-700">100% норма</div>
            <p className="text-[10px] text-slate-600">
              34 из 34 бригад в безопасном интервале {onOpenSafety && '• Подробнее →'}
            </p>
          </div>

          <div
            onClick={onOpenArbitration}
            className={`p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1 transition-all ${
              onOpenArbitration ? 'hover:border-blue-400 cursor-pointer' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-800">
                Эскроу-объем ЮKassa
              </span>
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black font-mono text-blue-700">412 800 ₽</div>
            <p className="text-[10px] text-slate-600">
              Заблокировано на номинальных счетах {onOpenArbitration && '• Вет-Арбитраж →'}
            </p>
          </div>

          <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-teal-800">
                Шлюз ФГИС «ВетИС»
              </span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-lg font-black font-mono text-teal-700">0.2 сек latency</div>
            <p className="text-[10px] text-slate-600">
              Хорриот и Меркурий онлайн
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: INCOMING CALL QUEUE & DISPATCH CONTROLLER */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Очередь вызовов и диспетчерское распределение
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveQueueTab('URGENT')}
              className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeQueueTab === 'URGENT'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1 Срочный вызов
            </button>

            <button
              type="button"
              onClick={() => setActiveQueueTab('IN_PROGRESS')}
              className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeQueueTab === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              8 В работе
            </button>
          </div>
        </div>

        {/* Tab 1: Urgent Call Requiring Immediate Assignment */}
        {activeQueueTab === 'URGENT' && (
          <div className="space-y-3">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/70 to-red-50/40 border-2 border-rose-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase text-rose-800 bg-white px-2.5 py-1 rounded-lg border border-rose-200 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>КРИТИЧЕСКИЙ ТРИАЖ • ДОЕЗД ДО 15 МИН</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Поступил 3 мин назад
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Пациент и клинический статус:
                  </span>
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    Французский бульдог Оскар (3 года, 12.4 кг)
                  </h4>
                  <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                    Острый анафилактический отек морды после укуса осы, цианоз слизистых оболочек, одышка. Требуется срочная инъекция дексаметазона / антигистаминных и кислородный бокс.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Адрес вызова:
                  </span>
                  <div className="flex items-start space-x-2 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Приморский район, Комендантский пр., д. 12, кв. 1</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Куратор: Елена В. • Домофон 1# • Подъезд открыт
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between mt-2">
                    <span className="font-bold">Ближайший свободный врач:</span>
                    <span className="font-mono font-black text-blue-700">
                      Д-р Васильев К. М. (2.4 км, ETA 11 мин)
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Action */}
              <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-600">
                  Экипаж оборудован кислородным концентратором и противошоковым набором.
                </div>

                <button
                  type="button"
                  onClick={handleAssignDoctor}
                  disabled={isUrgentAssigned}
                  className="py-3 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
                >
                  {isUrgentAssigned ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Экипаж успешно назначен и выехал</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 shrink-0" />
                      <span>Назначить ближайшего ветврача (Радиус 2.4 км) →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: In-Progress Visits Tracker */}
        {activeQueueTab === 'IN_PROGRESS' && (
          <div className="space-y-3">
            {/* Case 1 */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Наряд #ВЕТ-491
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    Д-р Соколова В. А. • Хаски Норд
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Осмотр на адресе (ул. Ленина, 28)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-snug">
                Ход осмотра: Вакцинация Nobivac DHPPi завершена, экспресс-тест на CPV отрицательный. Производится подкожная инфузия Рингер-Локк.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => showNotification('Карточка наряда #ВЕТ-491 открыта')}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Карточка наряда
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAudioChannel('Д-р Соколова В. А. (Борт Вет-04)')}
                  className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Защищенный аудиоканал (MTS Exolve)</span>
                </button>
              </div>
            </div>

            {/* Case 2 */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Наряд #ВЕТ-8120
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    Д-р Романов Д. С. • Кот Маркиз
                  </span>
                </div>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  В пути (ETA 17:14, 42 км/ч)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-snug">
                Повод к вызову: Острая задержка мочи у кота, урологический синдром. Требуется катетеризация мочевого пузыря и спазмолитики.
              </p>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => showNotification('GPS-телеметрия: Автомобиль движется по Каменноостровскому мосту')}
                  className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  GPS-телеметрия
                </button>
                <button
                  type="button"
                  onClick={() => showNotification('Защищенный телефонный мост с куратором кота Маркиза активирован')}
                  className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  <span>Связь с владельцем</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
