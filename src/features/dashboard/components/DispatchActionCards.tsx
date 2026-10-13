import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import {
  Car,
  Video,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export interface DispatchActionCardsProps {
  onHouseCallClick?: () => void;
  onTelehealthClick?: () => void;
}

export const DispatchActionCards: React.FC<DispatchActionCardsProps> = ({
  onHouseCallClick,
  onTelehealthClick,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. HERO HOUSE CALL DISPATCH CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vet-blue-900 via-vet-slate-900 to-vet-blue-950 text-white p-4 sm:p-5 shadow-clinical-lg border border-vet-blue-800/60 space-y-3.5">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-vet-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Urgent ETA Badge */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="timer"
            size="sm"
            className="bg-amber-400 text-amber-950 font-black border-amber-300 shadow-sm"
          >
            <Clock className="w-3 h-3 mr-0.5" />
            <span>Срочный выезд 20-30 мин</span>
          </Badge>
          <span className="text-[10px] text-vet-blue-200 font-mono font-medium">
            СПбГУВМ • ВетИС.Хорриот
          </span>
        </div>

        {/* Title & Clinical Equipment */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-vet-blue-500/30 border border-vet-blue-400/40 flex items-center justify-center text-vet-blue-300">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black tracking-tight text-white">
              Вызов ветеринарного врача на дом
            </h3>
          </div>

          <p className="text-xs text-vet-slate-300 leading-relaxed">
            Круглосуточный выезд сертифицированных врачей в Санкт-Петербурге. Врач прибудет с герметичным стерильным боксом, ISO-сканером микрочипов, лампой Вуда и набором экспресс-диагностики.
          </p>
        </div>

        {/* Regulatory Badges Row */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-vet-slate-800/90 border border-vet-slate-700 text-vet-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-vet-verified-400" />
            <span>Лицензия Россельхознадзора</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-vet-slate-800/90 border border-vet-slate-700 text-vet-slate-300 flex items-center gap-1">
            <FileCheck2 className="w-3 h-3 text-vet-blue-400" />
            <span>ФГИС «ВетИС» (Меркурий)</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-vet-slate-800/90 border border-vet-slate-700 text-vet-slate-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-vet-teal-400" />
            <span>Электронный ветпаспорт</span>
          </span>
        </div>

        {/* Pricing & CTA Button - Restructured for Zero-Collision & Clean Clinical Polish */}
        <div className="pt-3 border-t border-vet-slate-800/80 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">от 3 500 ₽</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                Фикс. цена
              </span>
            </div>
            <span className="text-[11px] text-vet-slate-400 font-medium">
              базовый осмотр + термометрия + ВетИС
            </span>
          </div>

          <button
            type="button"
            onClick={onHouseCallClick}
            className="w-full min-h-[46px] px-5 py-3 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
          >
            <span>Вызвать ветврача сейчас</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {/* 2. TELEHEALTH VIDEO CARD */}
      <div className="p-4 rounded-2xl bg-white border border-vet-slate-200/90 shadow-clinical hover:border-vet-teal-300 transition-all space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-vet-teal-50 border border-vet-teal-200 text-vet-teal-700 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-vet-slate-900">
                Онлайн-консультация с дежурным ветврачом
              </h4>
              <p className="text-[11px] text-vet-slate-500">
                Видеосвязь за 5 минут: экспресс-триаж и расшифровка анализов
              </p>
            </div>
          </div>
          <span className="font-extrabold text-xs text-vet-teal-700 whitespace-nowrap">
            от 1 200 ₽
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[11px] text-vet-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-vet-verified-500 animate-pulse" />
            <span>Врач на смене онлайн</span>
          </div>

          <Button
            variant="teal"
            size="sm"
            onClick={onTelehealthClick}
            icon={<Video className="w-3.5 h-3.5" />}
          >
            Начать видеоконсультацию
          </Button>
        </div>
      </div>

      {/* 3. TRUST & SAFETY BANNERS */}
      <div className="space-y-2 pt-1">
        {/* Escrow Banner */}
        <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
          <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-900 block text-[11px]">
              Эскроу-защита ЮKassa Вет-Сделка
            </span>
            <p className="text-[10px] text-emerald-800 leading-relaxed">
              Средства холдируются на карте и переводятся клинике/врачу только после очного осмотра, идентификации чипа и закрытия протокола в ВетИС по закону № 4979-1.
            </p>
          </div>
        </div>

        {/* Biosecurity Banner */}
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
          <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-amber-950 block text-[11px]">
              Протокол фиксации и зообезопасности
            </span>
            <p className="text-[10px] text-amber-800 leading-relaxed">
              Подготовьте поводок, мягкий намордник для собак или переноску для кошек перед визитом врача для безопасного клинического осмотра.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
