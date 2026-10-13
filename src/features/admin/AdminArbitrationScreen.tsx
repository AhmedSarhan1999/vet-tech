import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
  Quote,
  Radio,
  FileCheck2,
  Database,
  Receipt,
} from 'lucide-react';

export interface AdminArbitrationScreenProps {
  readonly onOpenDispatch?: () => void;
}

export type ArbitrationDecision = 'REJECTED' | 'PARTIAL' | 'FULL_REFUND' | null;

export const AdminArbitrationScreen: React.FC<AdminArbitrationScreenProps> = ({
  onOpenDispatch: _onOpenDispatch,
}) => {
  const [decision, setDecision] = useState<ArbitrationDecision>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fiscalReceiptGenerated, setFiscalReceiptGenerated] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResolve = (type: ArbitrationDecision, message: string) => {
    setDecision(type);
    setFiscalReceiptGenerated(true);
    showToast(message);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans bg-slate-50/60 min-h-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2.5 shadow-xl animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: ACTIVE CASE OVERVIEW */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-black text-slate-900 leading-tight">
                  Дело арбитража #ФСТ-АРБ-2026-104
                </h2>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  Наряд #ВЕТ-7838
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Номинальный счет эскроу ЮKassa • ст. 860.7 Гражданского кодекса РФ
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Спорная сумма в холдинге:
            </span>
            <span className="text-lg font-black font-mono text-blue-700">
              4 200 ₽
            </span>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-black">
              ТРЕБУЕТ РЕШЕНИЯ ДЕЖУРНОГО ВЕТ-АРБИТРА • ДО 15:30 МСК (осталось 14 мин)
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-800">
            Регламент 54-ФЗ / ГК РФ
          </span>
        </div>
      </div>

      {/* SECTION 2: IDENTIFIED SUBJECT PROFILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Complainant: Pet Parent */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Заявитель претензии (Клиент)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Рейтинг: ★ 4.2
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">
              Иван Смирнов (Иван С.)
            </h4>
            <p className="text-xs text-slate-600">
              Куратор собаки: <strong>Хаски Норд</strong> (кобель, 3 года, 28.4 кг)
            </p>
            <p className="text-[11px] text-slate-500">
              г. Санкт-Петербург, Петроградский район, ул. Ленина, д. 28, кв. 42
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            История аккаунта: 4 вызова за 2 года, 1 предыдущий спор (закрыт компромиссом).
          </div>
        </div>

        {/* Attending Clinician */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Лечащий ветеринарный врач</span>
            </span>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Рейтинг: ★ 4.95
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">
              Д-р Мельников А. П.
            </h4>
            <p className="text-xs text-slate-600">
              Ветеринарный хирург-терапевт • Стаж практики 12 лет (СПбГУВМ)
            </p>
            <p className="text-[11px] text-slate-500">
              Реестр Россельхознадзора #VET-78-01948 • Квалифицированная ЭЦП (УКЭП)
            </p>
          </div>

          <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-200 text-[11px] text-teal-950 flex items-center space-x-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Сертифицирован по стандарту зообезопасности и протоколам ВетИС</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: CLIENT CLAIM STATEMENT */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
          <Quote className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Суть претензии владельца питомца
          </h4>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-rose-500 text-xs sm:text-sm text-slate-800 italic leading-relaxed">
          «Ветеринар приехал на 20 минут позже, во время забора крови для экспресс-теста на парвовирус и биохимии потребовал доплату 1 400 ₽ за фиксацию и экспресс-тест без предварительного предупреждения. Настаиваю на возврате полной суммы 4 200 ₽ на карту СБП!»
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">Заявленные претензии:</span>
          <span>Опоздание врача на вызов (20 мин) + несогласованное списание средств за экспресс-тест.</span>
        </div>
      </div>

      {/* SECTION 4: OBJECTIVE DIGITAL EVIDENCE AUDIT */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Объективный аудит цифровых доказательств платформы
            </h4>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            100% Верифицировано
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Fact 1: GLONASS */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-500">
                ГЛОНАСС-телеметрия
              </span>
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xs font-black text-slate-900">
              Прибытие: 14:04 МСК
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Согласованное плановое окно прибытия экипажа: <strong>14:00 — 14:30</strong>. Факт опоздания <strong>опровергнут</strong> данными спутникового трекера.
            </p>
          </div>

          {/* Fact 2: Electronic Consent */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-500">
                Электронное ИДС (ЮKassa)
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs font-black text-slate-900">
              Подписано в 14:14 МСК (+1 400 ₽)
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Информированное согласие на экспресс-тест CPV акцептовано в мобильном приложении владельца до вскрытия блистера. Фотопротокол сохранен.
            </p>
          </div>

          {/* Fact 3: VetIS Mercury */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-500">
                ФГИС «ВетИС» (Меркурий)
              </span>
              <Database className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-xs font-black text-slate-900">
              Запись #VETIS-78-99214
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Исследование зафиксировано в государственной системе в 14:32 МСК. Результат: CPV Ag отрицательный. Услуга фактически оказана.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: ARBITRATION RESOLUTION CONSOLE */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-blue-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Судебная резолюция дежурного вет-арбитра
            </h4>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500">
            ст. 860.7 ГК РФ • 54-ФЗ
          </span>
        </div>

        {/* Conclusion Preview */}
        <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-1">
          <span className="font-black block">Правовое заключение арбитражной коллегии:</span>
          <p className="leading-relaxed">
            Нарушений регламента со стороны врача не выявлено. Экипаж прибыл без опоздания в согласованное окно (14:04 при окне 14:00-14:30). Дополнительная диагностика выполнена строго после электронного акцепта информированного согласия владельцем в приложении. Исследование зарегистрировано в ФГИС «ВетИС».
          </p>
        </div>

        {/* Action Trigger Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Button 1: Reject Claim */}
          <button
            type="button"
            onClick={() => handleResolve('REJECTED', 'Претензия отклонена. Средства 4 200 ₽ разблокированы и зачислены на счет врача Мельникова А. П. Чек закрытия сформирован.')}
            className={`py-3.5 px-4 rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98 ${
              decision === 'REJECTED'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Отклонить (4 200 ₽ врачу)</span>
          </button>

          {/* Button 2: Partial Refund */}
          <button
            type="button"
            onClick={() => handleResolve('PARTIAL', 'Вынесено решение о частичном компромиссном возврате: 1 400 ₽ клиенту, 2 800 ₽ врачу. Чек коррекции 54-ФЗ отправлен в ОФД.')}
            className={`py-3.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98 ${
              decision === 'PARTIAL'
                ? 'bg-amber-600 text-white ring-2 ring-amber-600/30'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            <span>Частично (1 400 ₽ / 2 800 ₽)</span>
          </button>

          {/* Button 3: Full Refund */}
          <button
            type="button"
            onClick={() => handleResolve('FULL_REFUND', 'Вынесен полный возврат средств клиенту (4 200 ₽). Инициирован возвратный перевод через шлюз ЮKassa на карту СБП.')}
            className={`py-3.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98 ${
              decision === 'FULL_REFUND'
                ? 'bg-rose-600 text-white ring-2 ring-rose-600/30'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <span>Полный возврат (4 200 ₽)</span>
          </button>
        </div>

        {/* 54-FZ Fiscal Receipt Correction Generator */}
        {fiscalReceiptGenerated && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 font-black text-emerald-900">
              <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Фискальный чек коррекции 54-ФЗ успешно сформирован в Первый ОФД</span>
            </div>
            <p className="text-[11px] leading-tight text-emerald-800">
              ФН: 99604403019 • ФД: 88102 • ФП: 301928491 • Признак расчета: РАСХОД / ПОЛНЫЙ РАСЧЕТ. 
              Электронный чек с фискальным признаком направлен на email заявителя и зарегистрирован в ФНС РФ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
