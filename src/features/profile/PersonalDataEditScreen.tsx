import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Download,
  AlertTriangle,
  Smartphone,
  Lock,
} from 'lucide-react';

export interface PersonalDataEditScreenProps {
  readonly onBack: () => void;
  readonly onSaveSuccess?: () => void;
}

export const PersonalDataEditScreen: React.FC<PersonalDataEditScreenProps> = ({
  onBack,
  onSaveSuccess,
}) => {
  // Form fields
  const [lastName, setLastName] = useState('Иванов');
  const [firstName, setFirstName] = useState('Александр');
  const [middleName, setMiddleName] = useState('Владимирович');
  const [inn, setInn] = useState('781402941102');
  const [passportSeriesNumber, setPassportSeriesNumber] = useState('40 14 892192');
  const [phone, setPhone] = useState('+7 (921) 420-15-03');
  const [email, setEmail] = useState('ivanov.spb@mail.ru');

  // Notification preferences
  const [notifySmsDispatch, setNotifySmsDispatch] = useState(true);
  const [notifyVaccinations, setNotifyVaccinations] = useState(true);
  const [notifyTherapyTracker, setNotifyTherapyTracker] = useState(true);

  // Biosecurity & legal consent
  const [safetyRegulationsAgreed, setSafetyRegulationsAgreed] = useState(true);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const handleSyncGosuslugi = () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMessage('Данные ЕСИА / ГосУслуги успешно синхронизированы');
      setTimeout(() => setSyncSuccessMessage(null), 3500);
    }, 1200);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onSaveSuccess) {
        onSaveSuccess();
      } else {
        onBack();
      }
    }, 700);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Bar */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">Профиль владельца</h1>
            <p className="text-[10px] font-semibold text-slate-500">Персональные данные • 152-ФЗ РФ</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3.5 py-2 rounded-xl transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? 'Сохранение...' : 'Готово'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* FGIS VetIS Horriot Sync Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3 shrink-0 mr-1" />
                  Верифицирован в ВетИС
                </span>
                <span className="text-[10px] text-blue-200 font-mono">12 окт 2026, 09:15</span>
              </div>
              <h3 className="text-sm font-black text-white leading-snug">
                Синхронизация профиля владельца с ЕСИА (Госуслуги)
              </h3>
              <p className="text-[11px] text-blue-100/90 leading-tight">
                Официальный учет физического лица в реестре «Хорриот» для автоматического оформления ветпаспортов и справок №1.
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-medium text-blue-200">
              Статус ФНС / Госуслуги: Активен
            </span>
            <button
              type="button"
              onClick={handleSyncGosuslugi}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 py-1.5 px-3 bg-white text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Синхронизация...' : 'Обновить из ЕСИА'}</span>
            </button>
          </div>

          {syncSuccessMessage && (
            <div className="mt-2.5 p-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-[11px] text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Section: Personal Credentials Form */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Удостоверение личности владельца</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">152-ФЗ РФ</span>
          </div>

          {/* Last Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">Фамилия *</label>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0 mr-1" />
                Подтверждено в ЕСИА
              </span>
            </div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900 bg-white"
            />
          </div>

          {/* First Name & Middle Name */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Имя *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Отчество</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* INN */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">ИНН физического лица *</label>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0 mr-1" />
                ФНС РФ (54-ФЗ онлайн-чеки)
              </span>
            </div>
            <input
              type="text"
              maxLength={12}
              value={inn}
              onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900 bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Используется для отправки фискальных чеков в ФНС РФ и договоров оферты на выезд ветврача.
            </p>
          </div>

          {/* Passport Details */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">Паспорт гражданина РФ *</label>
              <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono font-bold">
                Закон № 4979-1
              </span>
            </div>
            <input
              type="text"
              value={passportSeriesNumber}
              onChange={(e) => setPassportSeriesNumber(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900 bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Серия и номер замаскированы. Данные хранятся в зашифрованном виде по ГОСТ Р 34.12.
            </p>
          </div>
        </div>

        {/* Section: Communication & Alert Channels */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Каналы связи и уведомлений</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              SMS-шлюз активен
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Основной телефон *</label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-mono p-3 pr-20 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-900"
              />
              <span className="absolute right-3 top-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                СМС-верифицирован
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Электронная почта (Email) *</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 pr-24 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-900"
              />
              <span className="absolute right-3 top-3 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Чеки 54-ФЗ (ОФД)
              </span>
            </div>
          </div>

          {/* Notification Checkboxes */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 block">Оперативные уведомления:</span>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifySmsDispatch}
                onChange={(e) => setNotifySmsDispatch(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block">
                  Телеметрия выездной бригады (SMS / Push)
                </span>
                <span className="text-[10px] text-slate-500">
                  Оповещения о выезде врача, расчетное время прибытия и передача PIN-кода рукопожатия
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyVaccinations}
                onChange={(e) => setNotifyVaccinations(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block">
                  График обязательных вакцинаций (Бешенство, Нобивак)
                </span>
                <span className="text-[10px] text-slate-500">
                  Напоминания за 30 дней до окончания срока иммунитета по Закону № 4979-1
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTherapyTracker}
                onChange={(e) => setNotifyTherapyTracker(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block">
                  Умный трекер приема назначенных медикаментов
                </span>
                <span className="text-[10px] text-slate-500">
                  Контроль суточных дозировок антибиотиков и кардиопрепаратов с подтверждением
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section: Biosecurity & Data Privacy Compliance */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-snug">
              <strong>Регламент ветбезопасности СПб:</strong> Клиент обязуется обеспечить безопасные условия для осмотра животного врачом при вызове на дом.
            </div>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer p-1">
            <input
              type="checkbox"
              checked={safetyRegulationsAgreed}
              onChange={(e) => setSafetyRegulationsAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-700">
              Согласен с регламентом биобезопасности и осмотра животных
            </span>
          </label>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => alert('Формирование единой ветеринарной медицинской карты (PDF)...')}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Скачать медкарту (PDF)</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Запрос на отзыв согласия по 152-ФЗ направлен в службу поддержки')}
              className="py-2.5 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Отозвать согласие 152-ФЗ
            </button>
          </div>
        </div>

        {/* Full-width Primary Action */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
              <span>Сохранение...</span>
            </div>
          ) : (
            <span>Сохранить изменения</span>
          )}
        </button>
      </div>
    </div>
  );
};
