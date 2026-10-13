import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  Receipt,
  Heart,
  ChevronRight,
  Check,
  Star,
  UserCheck,
  Shield,
} from 'lucide-react';

export interface DoctorFinalSettlementScreenProps {
  readonly onReturnToRadar: () => void;
  readonly onBack?: () => void;
}

export const DoctorFinalSettlementScreen: React.FC<DoctorFinalSettlementScreenProps> = ({
  onReturnToRadar,
}) => {
  const [isPayoutProcessed, setIsPayoutProcessed] = useState<boolean>(false);
  const [showTaxDetails, setShowTaxDetails] = useState<boolean>(false);

  // Patient Behavioral Evaluation State (Screen image_07d9d6)
  const [petRating, setPetRating] = useState<number>(5);
  const [selectedPetTags, setSelectedPetTags] = useState<string[]>([
    'Спокойный при манипуляциях',
    'Умеренный стресс при термометрии',
    'Фиксация владельцем достаточна',
    'Попытки агрессии отсутствуют',
  ]);
  const [petNote, setPetNote] = useState<string>(
    'Норд вел себя отлично, дал провести аускультацию и забор мазка без седации. Мягкий намордник надевался только на время ректальной термометрии.'
  );

  // Client Compliance Evaluation State
  const [clientRating, setClientRating] = useState<number>(5);
  const [selectedClientTags, setSelectedClientTags] = useState<string[]>([
    'Изолировал других животных',
    'Подготовил чистую зону и пеленку',
    'Предоставил ветпаспорт вовремя',
    'Четко выполнял команды врача',
  ]);

  const petBehaviorTags = [
    'Спокойный при манипуляциях',
    'Умеренный стресс при термометрии',
    'Фиксация владельцем достаточна',
    'Попытки агрессии отсутствуют',
    'Требуется намордник на будущее',
  ];

  const clientComplianceTags = [
    'Изолировал других животных',
    'Подготовил чистую зону и пеленку',
    'Предоставил ветпаспорт вовремя',
    'Четко выполнял команды врача',
    'Имеет средства фиксации',
  ];

  const togglePetTag = (tag: string) => {
    setSelectedPetTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleClientTag = (tag: string) => {
    setSelectedClientTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleInstantPayout = () => {
    setIsPayoutProcessed(true);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Bar Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Финансовый расчет визита
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Заказ #ВЕТ-8492 • Закрытие смены и взаимная оценка
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          54-ФЗ / ОФД
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* A. Header & Successful Completion Banner */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 rounded-3xl p-5 border-2 border-emerald-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>ВЕТ-ПРИЕМ УСПЕШНО ЗАВЕРШЕН</span>
            </span>

            <span className="text-[10px] font-mono font-bold text-slate-400">
              38 мин
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Хаски Норд • Очный вызов
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>г. Санкт-Петербург, ул. Ленина, д. 28</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Петроградский район • Куратор: Александр Н. Смирнов
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-2xl border border-emerald-200 text-center shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-600 mx-auto" />
              <span className="text-[10px] font-bold text-slate-700 block mt-0.5">38 мин</span>
            </div>
          </div>
        </div>

        {/* B. Certified Clinical Protocol Summary */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Заверенный протокол #ВЕТ-78-04
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              УКЭП активна
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">Пациент:</span>
              <span className="font-bold">Норд (28.4 кг, Т 38.6°C норма)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">Экспресс-тест:</span>
              <span className="font-bold text-emerald-700 font-mono">CPV Ag Negative (-), Лот #CPV-2026-91</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">Диагноз:</span>
              <span className="font-bold">Острый катаральный трахеобронхит (СПбГУВМ)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500">Назначения:</span>
              <span className="font-bold">Синулокс 250 мг 1.5 таб q12h 10 дней</span>
            </div>
          </div>

          {/* Digital Signature & VetIS Sync stamp */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ЭЦП врача: Романов К. В. (Сертификат #78-Vet-2026)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              ВетИС Синхронизирован
            </span>
          </div>
        </div>

        {/* C. MUTUAL CLIENT & PET EVALUATION BLOCK (Screen image_07d9d6) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-blue-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Оценка зообезопасности и поведения
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              ст. 2.1 Закона 4979-1
            </span>
          </div>

          {/* Section 1: Patient Behavior Evaluation */}
          <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Поведение питомца
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Хаски Норд (3 года, 28.4 кг)
                </h4>
              </div>

              {/* 5-Star Behavioral Rating */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPetRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    aria-label={`Оценка ${star} из 5`}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= petRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black font-mono text-slate-800 ml-1">
                  {petRating}.0
                </span>
              </div>
            </div>

            {/* Rapid Behavioral Tags */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Факторы темперамента при манипуляциях:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {petBehaviorTags.map((tag) => {
                  const isSelected = selectedPetTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => togglePetTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinician Field Note */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Заметка ветврача в ветеринарный паспорт:
              </span>
              <textarea
                rows={2}
                value={petNote}
                onChange={(e) => setPetNote(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          </div>

          {/* Section 2: Client & Caregiver Compliance Evaluation */}
          <div className="space-y-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Оценка куратора / владельца
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Александр Н. Смирнов</span>
                </h4>
              </div>

              {/* 5-Star Compliance Rating */}
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setClientRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    aria-label={`Оценка куратора ${star} из 5`}
                  >
                    <Star
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= clientRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-black font-mono text-slate-800 ml-1">
                  {clientRating}.0
                </span>
              </div>
            </div>

            {/* Rapid Compliance Tags */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Соблюдение регламента зообезопасности:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {clientComplianceTags.map((tag) => {
                  const isSelected = selectedClientTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleClientTag(tag)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Risk Profile Synchronization Badge */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Данные переданы в профиль зообезопасности клиента (ст. 2.1 Закона РФ № 4979-1)</span>
            </div>
          </div>
        </div>

        {/* D. Final Itemized Accounting & Clinician Payout Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Финансовый расчет заказа #ВЕТ-8492
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">54-ФЗ Онлайн-касса</span>
          </div>

          {/* Client check summary */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Базовый очный вызов врача:</span>
              <span className="font-mono font-bold text-slate-900">2 800 ₽</span>
            </div>
            <div className="flex justify-between">
              <span>Экспресс-тест CPV Ag (акцептован в приложении):</span>
              <span className="font-mono font-bold text-slate-900">+1 200 ₽</span>
            </div>
            <div className="pt-1.5 border-t border-slate-100 flex justify-between font-bold text-slate-800">
              <span>Итого чек клиента (ЮKassa холдинг):</span>
              <span className="font-mono">4 000 ₽</span>
            </div>
          </div>

          {/* Commission & Tip breakdown */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Комиссия сервиса и эквайринг (5% + 350 ₽):</span>
              <span className="font-mono text-rose-600 font-bold">-550 ₽</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Прямые чаевые от владельца (СБП 0% комиссии):</span>
              </span>
              <span className="font-mono">+500 ₽</span>
            </div>
          </div>

          {/* Net Clinician Earnings Box */}
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-100">
              <span className="uppercase font-bold tracking-wider">Чистый доход врача к выплате:</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                Эскроу разблокирован
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black font-mono tracking-tight">
                3 950 ₽
              </span>
              <span className="text-xs text-emerald-100">на счет врача</span>
            </div>

            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Средства доступны к мгновенному выводу через СБП прямо сейчас без удержаний.
            </p>
          </div>

          {/* 422-FZ Tax Automation Notice */}
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-950 space-y-1">
            <div
              onClick={() => setShowTaxDetails(!showTaxDetails)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center space-x-1.5 font-bold text-blue-900">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Автоматический учет налога самозанятого (422-ФЗ РФ)</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-blue-600 transition-transform ${
                  showTaxDetails ? 'rotate-90' : ''
                }`}
              />
            </div>

            <p className="text-[11px] text-blue-800 leading-tight">
              Налог на профессиональный доход (4% = 160 ₽) автоматически задекларирован в приложении «Мой Налог» ФНС России. Чек сформирован.
            </p>
          </div>
        </div>

        {/* E. Payout Action Controls */}
        <div className="space-y-2.5 pt-1">
          {/* SBP Instant Payout Button */}
          <button
            type="button"
            onClick={handleInstantPayout}
            disabled={isPayoutProcessed}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            {isPayoutProcessed ? (
              <>
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-slate-800">3 950 ₽ зачислены на счет по СБП</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 shrink-0" />
                <span>Вывести 3 950 ₽ моментально по СБП →</span>
              </>
            )}
          </button>

          {isPayoutProcessed && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Перевод 3 950 ₽ успешно отправлен на карту Т-Банк через СБП!</span>
            </div>
          )}

          {/* Secondary Link Button: Return to Radar */}
          <button
            type="button"
            onClick={onReturnToRadar}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
          >
            <span>Вернуться на Вет-Радар дежурства (Петроградский кластер)</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
