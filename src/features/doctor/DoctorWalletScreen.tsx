import React, { useState } from 'react';
import {
  Wallet,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Building,
  TrendingUp,
} from 'lucide-react';

export interface DoctorWalletScreenProps {
  readonly onOpenDashboard?: () => void;
}

interface PayoutTransaction {
  readonly id: string;
  readonly date: string;
  readonly amountRub: number;
  readonly title: string;
  readonly sbpRef: string;
  readonly status: 'PAID' | 'PROCESSING';
}

const RECENT_TRANSACTIONS: readonly PayoutTransaction[] = [
  {
    id: 'tx-01',
    date: '13 октября 2026, 14:15',
    amountRub: 4700,
    title: 'Вызов #ВЕТ-7039 (Лабрадор Боня) • Очный выезд',
    sbpRef: 'СБП-78-9041284',
    status: 'PAID',
  },
  {
    id: 'tx-02',
    date: '13 октября 2026, 12:45',
    amountRub: 3200,
    title: 'Вызов #ВЕТ-7040 (Котенок Симба) • Вакцинация',
    sbpRef: 'СБП-78-9041109',
    status: 'PAID',
  },
  {
    id: 'tx-03',
    date: '13 октября 2026, 11:10',
    amountRub: 3500,
    title: 'Вызов #ВЕТ-7038 • Очный выезд на дом',
    sbpRef: 'СБП-78-9039811',
    status: 'PAID',
  },
  {
    id: 'tx-04',
    date: '13 октября 2026, 14:20',
    amountRub: 1800,
    title: 'Прямые чаевые от владельцев через СБП (0% комиссии)',
    sbpRef: 'СБП-78-TIP-441',
    status: 'PAID',
  },
];

export const DoctorWalletScreen: React.FC<DoctorWalletScreenProps> = () => {
  const [isPayoutSuccess, setIsPayoutSuccess] = useState<boolean>(false);

  const handlePayout = () => {
    setIsPayoutSuccess(true);
    setTimeout(() => {
      setIsPayoutSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-black text-slate-900 leading-tight">Кошелек врача</h1>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              422-ФЗ НПД
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
            ИНН 781402941102 • Режим самозанятости «Мой Налог»
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
          <Wallet className="w-4 h-4" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Payable Balance Card (Bright & Cheerful Clinical Light Theme - ZERO DARK SLABS) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-300 space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Zap className="w-3 h-3 text-emerald-600 shrink-0 mr-1" />
                Мгновенный вывод через СБП 0%
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  13 200 ₽
                </span>
                <span className="text-xs font-bold text-emerald-700">доступно к выплате</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                За смену: 11 400 ₽ за визиты + 1 800 ₽ чаевые
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold">
                <Building className="w-3 h-3 mr-1 text-blue-600" />
                Сбербанк МИР
              </span>
              <p className="text-[10px] text-slate-400 font-mono mt-1">•••• 4412</p>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Вызовы (3)</span>
              <span className="font-black text-slate-900 font-mono">11 400 ₽</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Чаевые СБП</span>
              <span className="font-black text-emerald-700 font-mono">+1 800 ₽</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-sans">Комиссия</span>
              <span className="font-black text-blue-700 font-mono">0 ₽</span>
            </div>
          </div>

          {/* SBP Payout Action */}
          <button
            type="button"
            onClick={handlePayout}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>Вывести 13 200 ₽ на карту через СБП →</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {isPayoutSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Выплата 13 200 ₽ успешно отправлена через СБП на карту •••• 4412!</span>
            </div>
          )}
        </div>

        {/* Tax Integration Info (422-FZ) */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Фискализация ФНС РФ (Мой Налог)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Авто-фискализация
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            Чеки самозанятого формируются автоматически в приложении «Мой Налог» при завершении выезда. Налоговая ставка: 4% при расчетах с физическими лицами.
          </p>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span>Налог за смену (~4%): <strong>528 ₽</strong></span>
            <span className="text-blue-700 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Уплачивается в ФНС</span>
            </span>
          </div>
        </div>

        {/* Payout Transactions History */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              История зачислений за сегодня ({RECENT_TRANSACTIONS.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">13 октября 2026</span>
          </div>

          <div className="space-y-2.5">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{tx.date}</span>
                    <span className="text-[9px] font-mono text-blue-700 font-semibold">{tx.sbpRef}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 font-mono block">
                    +{tx.amountRub.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                    Зачислено
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statement download action */}
        <button
          type="button"
          onClick={() => alert('Формирование реестра выплат для декларации 422-ФЗ...')}
          className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Скачать справку о доходах и чеках 422-ФЗ (PDF)</span>
        </button>
      </div>
    </div>
  );
};
