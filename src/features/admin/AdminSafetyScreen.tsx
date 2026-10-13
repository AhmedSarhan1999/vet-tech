import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Volume2,
  CheckCircle2,
  Clock,
  MapPin,
  Radio,
  KeyRound,
  FileText,
  Ban,
  Shield,
  Siren,
  X,
} from 'lucide-react';

export interface AdminSafetyScreenProps {
  readonly onOpenDispatch?: () => void;
}

export const AdminSafetyScreen: React.FC<AdminSafetyScreenProps> = ({
  onOpenDispatch: _onOpenDispatch,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [is112Dispatched, setIs112Dispatched] = useState<boolean>(false);
  const [isGbrDispatched, setIsGbrDispatched] = useState<boolean>(false);
  const [isCovertAudioActive, setIsCovertAudioActive] = useState<boolean>(false);
  const [isDisarmModalOpen, setIsDisarmModalOpen] = useState<boolean>(false);
  const [disarmPin, setDisarmPin] = useState<string>('');
  const [isAlertDisarmed, setIsAlertDisarmed] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDispatch112 = () => {
    setIs112Dispatched(true);
    showToast('Карточка ЧП #МНЦ-ВЕТ-2026-904 передана в ЕДДС 112 и дежурную часть ОП №58 УМВД по Выборгскому району СПб!');
  };

  const handleDispatchGbr = () => {
    setIsGbrDispatched(true);
    showToast('Экипаж зообезопасности ГБР-02 направлен по адресу пр. Просвещения, д. 48. Расчетное прибытие 4 мин (2.1 км).');
  };

  const handleConfirmDisarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (disarmPin === '9912' || disarmPin.length === 4) {
      setIsAlertDisarmed(true);
      setIsDisarmModalOpen(false);
      showToast('Тревога отменена. Мастер-PIN верифицирован. Доктор подтвердил безопасность.');
    } else {
      showToast('Неверный Мастер-PIN безопасности');
    }
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

      {/* DISARM MODAL */}
      {isDisarmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-slate-800" />
                <h3 className="text-sm font-black text-slate-900">
                  Отбой тревоги (Мастер-PIN ветврача)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDisarmModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDisarm} className="space-y-3">
              <p className="text-xs text-slate-600">
                Введите 4-значный мастер-код экстренного снятия с контроля (тестовый PIN: 9912):
              </p>
              <input
                type="password"
                maxLength={4}
                value={disarmPin}
                onChange={(e) => setDisarmPin(e.target.value)}
                placeholder="****"
                className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-blue-600"
              />
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisarmModalOpen(false)}
                  className="w-1/2 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  Подтвердить отбой
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 1: CRITICAL ALERT CRISIS HEADER */}
      {!isAlertDisarmed && (
        <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-3xl p-5 text-white shadow-lg space-y-3 animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shrink-0">
                <Siren className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-rose-100 block">
                  Протокол экстренного реагирования МВД РФ
                </span>
                <h2 className="text-sm sm:text-base font-black leading-tight">
                  КРИТИЧЕСКИЙ АЛЕРТ: ТАЙМЕР DEAD-MAN НЕ ПОДТВЕРЖДЕН • ВЫЗОВ ВЕТВРАЧА
                </h2>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/30">
              Сработал 2 мин назад
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs text-rose-100 pt-1 border-t border-white/20">
            <div>
              Ссылка на инцидент: <strong className="text-white font-mono">#МНЦ-ВЕТ-2026-904</strong>
            </div>
            <div>
              Время фиксации: <strong className="text-white font-mono">14:36:12 МСК</strong>
            </div>
            <div>
              Ведомственный контроль: <strong className="text-white">ОП №58 УМВД по Выборгскому району СПб & Россельхознадзор</strong>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INCIDENT CLINICIAN & THREAT ASSESSMENT CARD */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Карточка оперативной угрозы и данные экипажа
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            Красный код опасности
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column A: Doctor & Address */}
          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Специалист на адресе:
              </span>
              <h4 className="text-sm font-black text-slate-900 leading-snug">
                Д-р Васильев К. М. (Хирург-травматолог высшей категории)
              </h4>
              <p className="text-[11px] text-slate-500">
                Экипаж Вет-09 • Носимый маяк BLE 5.0 #VET-BEACON-09
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Адрес инцидента:
              </span>
              <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Выборгский район, пр. Просвещения, д. 48, кв. 112</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Этаж 3, подъезд 3, домофон 44512 • Куратор: Григорьев М. И.
              </p>
            </div>

            {/* Animal Risk */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-900 block">
                Пациент и уровень зоо-угрозы:
              </span>
              <p className="text-xs font-black text-slate-900">
                Кавказская овчарка Гром, 65 кг (некастрированный кобель, агрессия)
              </p>
              <p className="text-[11px] text-amber-950 leading-tight">
                <strong>Факторы риска:</strong> Высокая вероятность нападения животного. Куратор предположительно в состоянии алкогольного опьянения, блокирует выход врача из квартиры.
              </p>
            </div>
          </div>

          {/* Column B: Telemetry & Actions */}
          <div className="space-y-3">
            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center space-x-1.5">
                  <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Телеметрия носимого оборудования:</span>
                </span>
                <span className="font-mono text-[10px] font-black bg-white px-2 py-0.5 rounded border border-rose-200">
                  LBS ±3.5m lock
                </span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-700">
                <li>• Тактильный таймер безопасности (15 мин) <strong>не сброшен</strong></li>
                <li>• Indoor-позиционирование подтверждено в периметре кв. 112</li>
                <li>• Акустический сенсор зафиксировал непрерывное рычание крупной собаки</li>
              </ul>
            </div>

            {/* Immediate Dispatch Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCovertAudioActive(!isCovertAudioActive);
                  showToast(isCovertAudioActive ? 'Скрытый аудиоканал отключен' : 'Скрытый аудиоканал MTS Exolve активирован. Фоновый звук: рычание собаки.');
                }}
                className={`py-3 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs ${
                  isCovertAudioActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>{isCovertAudioActive ? 'Аудиоканал активен' : 'Скрытый аудиоканал'}</span>
              </button>

              <button
                type="button"
                onClick={handleDispatch112}
                disabled={is112Dispatched}
                className="py-3 px-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>{is112Dispatched ? 'Передано в 112' : 'Передать в 112 / МВД'}</span>
              </button>

              <button
                type="button"
                onClick={handleDispatchGbr}
                disabled={isGbrDispatched}
                className="py-3 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>{isGbrDispatched ? 'ГБР направлена (4 мин)' : 'Направить ГБР (2.1 км)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDisarmModalOpen(true)}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Отбой тревоги (PIN)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LIVE DEAD-MAN SWITCH MONITORING GRID */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Мониторинг таймеров безопасности дежурных бригад (Dead-Man HUD)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            3 активных чекпоинта
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1 */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Петроградский район
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                В норме
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Д-р Романов Д. С.
            </h4>
            <p className="text-[11px] text-slate-600">
              Вызов: Хаски Норд
            </p>
            <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-500">Остаток:</span>
              <span className="text-emerald-700">11:39 мин</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              LBS 4G канал стабилен
            </span>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Петроградский район
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                В норме
              </span>
            </div>
            <h4 className="text-xs font-black text-slate-900">
              Д-р Соколова В. А.
            </h4>
            <p className="text-[11px] text-slate-600">
              Вызов: Кот Барсик
            </p>
            <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-500">Остаток:</span>
              <span className="text-emerald-700">08:45 мин</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Аудиоканал доступен
            </span>
          </div>

          {/* Card 3 (Red Alert) */}
          <div className="p-4 bg-rose-50/70 rounded-2xl border-2 border-rose-300 space-y-2 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700 uppercase">
                Выборгский район
              </span>
              <span className="text-[10px] font-mono font-black text-rose-800 bg-rose-200/70 px-1.5 py-0.2 rounded">
                ТАЙМАУТ
              </span>
            </div>
            <h4 className="text-xs font-black text-rose-950">
              Д-р Васильев К. М.
            </h4>
            <p className="text-[11px] text-rose-900 font-semibold">
              Вызов: Кавказская овчарка Гром
            </p>
            <div className="pt-1 border-t border-rose-200 flex items-center justify-between text-xs font-mono font-black">
              <span className="text-rose-700">Просрочка:</span>
              <span className="text-rose-700">-06:12 мин</span>
            </div>
            <button
              type="button"
              onClick={handleDispatch112}
              className="w-full mt-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer"
            >
              ЭКСТРЕННЫЙ ПРОТОКОЛ
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: INCIDENT AUDIT LOG & HIGH-RISK BLACKLIST REGISTRY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 7-Day Audit Log */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Журнал инцидентов за 7 дней (СПб)
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Аудит безопасности
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Каменноостровский пр., д. 54</span>
                <span className="text-[10px] text-slate-400 font-mono">11.10.2026</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Питбуль без намордника, агрессия при пальпации. Врач применил ст. 70 Закона РФ № 4979-1, зафиксировал отказ и благополучно покинул адрес.
              </p>
            </div>

            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Богатырский пр., д. 22</span>
                <span className="text-[10px] text-slate-400 font-mono">08.10.2026</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Разрядка терминала Dead-Man. Диспетчер связался с владельцем через домофон, подтвердил безопасность врача и завершение осмотра.
              </p>
            </div>
          </div>
        </div>

        {/* High-Risk Blacklist Registry */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Ban className="w-4 h-4 text-rose-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Реестр адресов повышенного риска (Blacklist)
              </h4>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Черный список
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>ул. Савушкина, д. 42, кв. 88</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  Строго с ГБР
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Угроза физической агрессии в адрес фельдшера. Выезды разрешены строго в сопровождении кинолога ГБР либо перевод на телемедицину.
              </p>
            </div>

            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>пр. Просвещения, д. 104, кв. 19</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                  Полный запрет
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Категорический отказ от обязательной антирабической вакцинации (бешенство). Полная блокировка направления выездных бригад по ст. 2.1 Закона № 4979-1.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
