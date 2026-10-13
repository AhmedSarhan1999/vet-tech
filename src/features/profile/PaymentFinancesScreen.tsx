import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Plus,
  Zap,
  Mail,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';

export interface PaymentFinancesScreenProps {
  readonly onBack: () => void;
}

export interface LinkedCard {
  readonly id: string;
  readonly cardType: 'MIR' | 'VISA' | 'MASTERCARD';
  readonly bankName: string;
  readonly last4: string;
  readonly expDate: string;
  readonly isPrimary: boolean;
  readonly gradientClass: string;
}

const INITIAL_CARDS: LinkedCard[] = [
  {
    id: 'card-01',
    cardType: 'MIR',
    bankName: 'Сбербанк',
    last4: '4412',
    expDate: '08 / 29',
    isPrimary: true,
    gradientClass: 'from-slate-900 via-slate-900 to-blue-950',
  },
  {
    id: 'card-02',
    cardType: 'MIR',
    bankName: 'Т-Банк',
    last4: '8820',
    expDate: '11 / 28',
    isPrimary: false,
    gradientClass: 'from-slate-900 via-slate-800 to-indigo-950',
  },
];

interface FiscalReceiptItem {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly amountRub: number;
  readonly date: string;
  readonly type: 'HOUSE_CALL' | 'TELEHEALTH';
  readonly fnsFiscalNumber: string;
  readonly mercuryVsdUuid?: string;
  readonly status: 'FISCALIZED' | 'REFUNDED';
}

const FISCAL_RECEIPTS_MOCK: readonly FiscalReceiptItem[] = [
  {
    id: 'rcpt-01',
    code: 'ВЕТ-1092',
    title: 'Вызов ветврача на дом + экспресс-тест на парвовирус',
    amountRub: 4700,
    date: '10 октября 2026, 11:30',
    type: 'HOUSE_CALL',
    fnsFiscalNumber: 'ФД 8912 • ФП 201948102',
    mercuryVsdUuid: '78mercury-9a8b7c6d',
    status: 'FISCALIZED',
  },
  {
    id: 'rcpt-02',
    code: 'ТЕЛ-ВЕТ-309',
    title: 'Ночной видеоконсилиум ветеринарного врача 24/7',
    amountRub: 1200,
    date: '28 сентября 2026, 02:15',
    type: 'TELEHEALTH',
    fnsFiscalNumber: 'ФД 8740 • ФП 192837461',
    status: 'FISCALIZED',
  },
  {
    id: 'rcpt-03',
    code: 'ВЕТ-491',
    title: 'Плановая вакцинация Nobivac Rabies + DHPPI',
    amountRub: 3200,
    date: '15 сентября 2026, 14:00',
    type: 'HOUSE_CALL',
    fnsFiscalNumber: 'ФД 8411 • ФП 384729104',
    mercuryVsdUuid: '78mercury-11223344',
    status: 'FISCALIZED',
  },
];

export const PaymentFinancesScreen: React.FC<PaymentFinancesScreenProps> = ({ onBack }) => {
  const [cards, setCards] = useState<LinkedCard[]>(INITIAL_CARDS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'HOUSE_CALL' | 'TELEHEALTH'>('ALL');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [ofdEmail, setOfdEmail] = useState('ivanov.spb@mail.ru');

  // Deletion controls
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  // New card modal form inputs
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBank, setNewCardBank] = useState('ВТБ');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');

  const filteredReceipts = FISCAL_RECEIPTS_MOCK.filter((r) => {
    if (activeTab === 'HOUSE_CALL') return r.type === 'HOUSE_CALL';
    if (activeTab === 'TELEHEALTH') return r.type === 'TELEHEALTH';
    return true;
  });

  const handleSetPrimary = (id: string) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isPrimary: card.id === id,
      }))
    );
    setDeleteWarning(null);
  };

  const handleRequestDelete = (card: LinkedCard) => {
    if (cards.length <= 1) {
      setDeleteWarning('Невозможно удалить единственный способ оплаты. Добавьте другой способ оплаты перед удалением.');
      setConfirmDeleteId(null);
      return;
    }

    if (card.isPrimary) {
      setDeleteWarning('Внимание: Вы удаляете основную карту. После удаления статус основной перейдет к следующей карте.');
    } else {
      setDeleteWarning(null);
    }

    setConfirmDeleteId(card.id);
  };

  const handleConfirmDelete = (id: string) => {
    const cardToDelete = cards.find((c) => c.id === id);
    const remaining = cards.filter((c) => c.id !== id);

    // If deleted card was primary and there are remaining cards, make first remaining primary
    const updatedRemaining: LinkedCard[] = remaining.map((c, idx) => {
      if (cardToDelete?.isPrimary && idx === 0) {
        return { ...c, isPrimary: true };
      }
      return c;
    });

    setCards(updatedRemaining);
    setConfirmDeleteId(null);
    setDeleteWarning(null);
  };

  const handleAddCardSubmit = () => {
    const digitsOnly = newCardNumber.replace(/\s+/g, '');
    const last4 = digitsOnly.length >= 4 ? digitsOnly.slice(-4) : '9034';
    const bankName = newCardBank.trim() || 'ВТБ';
    const expDate = newCardExp.trim() || '12 / 29';

    const newCard: LinkedCard = {
      id: `card-${Date.now()}`,
      cardType: 'MIR',
      bankName,
      last4,
      expDate,
      isPrimary: cards.length === 0,
      gradientClass: 'from-slate-900 via-slate-800 to-blue-900',
    };

    setCards((prev) => [...prev, newCard]);
    setIsAddCardModalOpen(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvc('');
    setDeleteWarning(null);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Navigation */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">Оплата и финансы</h1>
            <p className="text-[10px] font-semibold text-slate-500">ЮKassa • 54-ФЗ • ФГИС «ВетИС»</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          АИ
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Safe Payments Escrow Guarantee Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mr-1 text-emerald-300" />
                Безопасный эскроу-платеж 0%
              </span>
              <h3 className="text-sm font-black text-white leading-snug">
                Гарантия безопасности расчетов ЮKassa
              </h3>
              <p className="text-[11px] text-blue-100/90 leading-tight">
                Средства холдируются на эскроу-счете (ст. 860.7 ГК РФ) и списываются исключительно после завершения осмотра животного врачом и подписания акта.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-blue-200">
            <span>Автоматический размороз при отмене</span>
            <span className="font-mono text-emerald-300 font-bold">Комиссия сервиса: 0 ₽</span>
          </div>
        </div>

        {/* Warning Callout for Deletion */}
        {deleteWarning && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/90 text-xs text-amber-900 flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] leading-snug font-medium">
              {deleteWarning}
            </div>
            <button
              type="button"
              onClick={() => setDeleteWarning(null)}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 shrink-0 cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Payment Methods Management */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Привязанные способы оплаты ({cards.length})</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">PCI DSS Level 1</span>
          </div>

          {/* Linked Cards List */}
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`p-4 rounded-2xl bg-gradient-to-r ${card.gradientClass} text-white shadow-xs space-y-3 border transition-all ${
                  card.isPrimary ? 'border-blue-400/60 ring-2 ring-blue-500/20' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black tracking-wider uppercase">
                      {card.cardType}
                    </div>
                    <span className="text-xs font-bold text-white">{card.bankName}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {card.isPrimary ? (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        Основная карта
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(card.id)}
                        className="text-[9px] font-extrabold text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-full border border-white/20 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>Сделать основной</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="font-mono font-bold text-sm tracking-widest text-slate-100">
                    •••• •••• •••• {card.last4}
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">{card.expDate}</span>
                </div>

                {/* Inline Confirmation or Normal Bottom Bar */}
                {confirmDeleteId === card.id ? (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs animate-fadeIn">
                    <span className="text-[10px] font-bold text-rose-300">
                      Удалить карту •••• {card.last4}?
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(card.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Да, удалить
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDeleteId(null);
                          setDeleteWarning(null);
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Безакцептный холдинг активен</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(card)}
                      aria-label={`Удалить карту ${card.bankName} ${card.last4}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SBP Card linking */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-900">Система быстрых платежей (СБП)</span>
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    0%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Привязан номер: +7 (921) 420-15-03
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-2 py-1 rounded-lg shrink-0">
              Чаевые & Возвраты
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddCardModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50/50 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Привязать карту МИР, Visa, Mastercard</span>
          </button>
        </div>

        {/* 54-FZ Fiscal Receipts & VetIS Documents Section */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Электронные чеки 54-ФЗ и акты ВетИС</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Первый ОФД
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            Все расчеты фискализируются в налоговой службе (ФНС РФ). Электронные чеки с QR-кодом направляются на вашу почту сразу после оплаты.
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Email для чеков:</span>
                <span className="text-xs font-bold text-slate-800 truncate block">{ofdEmail}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const newEmail = prompt('Введите email для отправки чеков 54-ФЗ:', ofdEmail);
                if (newEmail && newEmail.includes('@')) {
                  setOfdEmail(newEmail);
                }
              }}
              className="text-xs font-bold text-blue-600 hover:underline shrink-0 ml-2 cursor-pointer"
            >
              Изменить
            </button>
          </div>

          {/* Sub-filter tabs */}
          <div className="flex space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Все чеки ({FISCAL_RECEIPTS_MOCK.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('HOUSE_CALL')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'HOUSE_CALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Очные выезды (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TELEHEALTH')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'TELEHEALTH'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Вет-Телемед (1)
            </button>
          </div>

          {/* Receipt Cards */}
          <div className="space-y-2.5">
            {filteredReceipts.map((rcpt) => (
              <div
                key={rcpt.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900">{rcpt.code}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ФНС фискализирован
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5 leading-snug">
                      {rcpt.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {rcpt.date}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {rcpt.amountRub.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">
                    {rcpt.fnsFiscalNumber}
                  </span>
                  <div className="flex items-center space-x-2">
                    {rcpt.mercuryVsdUuid && (
                      <span className="text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                        ВСД: {rcpt.mercuryVsdUuid}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => alert(`Загрузка электронного фискального чека ${rcpt.code} (PDF)...`)}
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF чек</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-[10px] text-slate-500 space-y-1 text-center">
          <p className="font-semibold text-slate-700">
            Безопасность расчетов сертифицирована по стандарту PCI DSS Level 1
          </p>
          <p>
            Лицензия Банка России № 3510-К. При привязке карты проводится тестовая авторизация на 1 ₽ с мгновенным возвратом.
          </p>
        </div>

        {/* Bottom Full-width Action */}
        <button
          type="button"
          onClick={() => setIsAddCardModalOpen(true)}
          className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 shrink-0 text-white" />
          <span>Добавить способ оплаты</span>
        </button>
      </div>

      {/* Add Card Modal */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-900">Привязка банковской карты</h4>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Закрыть
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Введите данные карты МИР, Visa или Mastercard для безопасных эскроу-расчетов через ЮKassa.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Банк-эмитент</label>
                <select
                  value={newCardBank}
                  onChange={(e) => setNewCardBank(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white font-medium"
                >
                  <option value="ВТБ">ВТБ (МИР)</option>
                  <option value="Газпромбанк">Газпромбанк (МИР)</option>
                  <option value="Альфа-Банк">Альфа-Банк (МИР)</option>
                  <option value="Банк Санкт-Петербург">Банк «Санкт-Петербург» (МИР)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Номер карты</label>
                <input
                  type="text"
                  placeholder="2200 1234 5678 9034"
                  maxLength={19}
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Срок действия</label>
                  <input
                    type="text"
                    placeholder="12 / 29"
                    maxLength={7}
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={3}
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCardSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Привязать карту (0 ₽ комиссия)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
