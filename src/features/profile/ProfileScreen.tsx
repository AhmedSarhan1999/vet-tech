import React, { useState } from 'react';
import {
  Bell,
  Settings,
  Pencil,
  ShieldCheck,
  MapPin,
  CreditCard,
  Star,
  ChevronRight,
  Globe,
  FileText,
  PhoneCall,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import { PersonalDataEditScreen } from './PersonalDataEditScreen';
import { ReviewsRatingsScreen } from './ReviewsRatingsScreen';
import { PaymentFinancesScreen } from './PaymentFinancesScreen';
import { AddressesManagementScreen } from './AddressesManagementScreen';

export type ProfileSubRoute = 'hub' | 'personal_data' | 'reviews' | 'payments' | 'addresses';

export interface ProfileScreenProps {
  readonly onSignOut?: () => void;
  readonly onSwitchToDoctor?: () => void;
  readonly initialSubRoute?: ProfileSubRoute;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onSignOut,
  onSwitchToDoctor,
  initialSubRoute = 'hub',
}) => {
  const [currentSubRoute, setCurrentSubRoute] = useState<ProfileSubRoute>(initialSubRoute);

  // If inside a sub-route, render the dedicated sub-screen
  if (currentSubRoute === 'personal_data') {
    return <PersonalDataEditScreen onBack={() => setCurrentSubRoute('hub')} />;
  }

  if (currentSubRoute === 'reviews') {
    return <ReviewsRatingsScreen onBack={() => setCurrentSubRoute('hub')} />;
  }

  if (currentSubRoute === 'payments') {
    return <PaymentFinancesScreen onBack={() => setCurrentSubRoute('hub')} />;
  }

  if (currentSubRoute === 'addresses') {
    return <AddressesManagementScreen onBack={() => setCurrentSubRoute('hub')} />;
  }

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-blue-700 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit">
            СПб ВетСлужба 24/7 • ID: VET-OWNER-89214
          </span>
          <h1 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
            Профиль владельца
          </h1>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            aria-label="Уведомления"
            onClick={() => setCurrentSubRoute('personal_data')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/60"
          >
            <Bell className="w-4 h-4 shrink-0" />
          </button>
          <button
            type="button"
            aria-label="Настройки"
            onClick={() => alert('Настройки аккаунта и безопасности 152-ФЗ')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/60"
          >
            <Settings className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* User Identity Card (Screen 308e6c354b174edaa9901cb123591ccc) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 relative overflow-hidden space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3.5 min-w-0">
              {/* User Avatar Initials Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0 ring-2 ring-emerald-400/30">
                АИ
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                  Александр Владимирович Иванов
                </h2>
                <p className="text-xs font-mono font-medium text-slate-600 mt-0.5">
                  +7 (921) 420-15-03
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  ivanov.spb@mail.ru
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentSubRoute('personal_data')}
              aria-label="Редактировать личные данные"
              className="p-2.5 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 transition-all cursor-pointer shrink-0 border border-slate-200/60 hover:border-blue-200 shadow-2xs active:scale-95"
            >
              <Pencil className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Куратор питомцев верифицирован • 152-ФЗ</span>
            </span>
          </div>
        </div>

        {/* Section 1: Dispatch Addresses Management */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Адреса вызова ветслужбы</h3>
                <p className="text-[10px] text-slate-400">Логистика выездных бригад СПб</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              2 адреса
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentSubRoute('addresses')}
            className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-800 truncate">
                  ул. Ленина, д. 28, кв. 42
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                  Основной
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                Петроградский р-н • Подъезд 2, этаж 4, домофон 42#
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>
        </div>

        {/* Section 2: Finances, YooKassa Escrow & 54-FZ Fiscal Receipts */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Финансы, Эскроу ЮKassa и чеки 54-ФЗ</h3>
                <p className="text-[10px] text-slate-400">Безопасный холдинг и онлайн-чеки ОФД</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              0% комиссия
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentSubRoute('payments')}
            className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-800">
                  МИР Сбербанк •••• 4412
                </span>
                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                  Активна
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                СБП привязан • Чеки ОФД отправляются на ivanov.spb@mail.ru
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>
        </div>

        {/* Section 3: Reviews & Ratings Center */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Отзывы и оценки качества</h3>
                <p className="text-[10px] text-slate-400">Оценки врачей выездной ветслужбы</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              4.95 / 5.0
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentSubRoute('reviews')}
            className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="space-y-0.5 min-w-0 pr-2">
              <span className="text-xs font-bold text-slate-800 block">
                4 верифицированных отзыва
              </span>
              <p className="text-[10px] text-slate-400">
                Д-р Романов К. В., Д-р Васильева Е. В., Дежурный телемед
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>
        </div>

        {/* Section 4: Settings, Language, Terms & Support */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
            Регламенты и поддержка
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {/* Language & Region */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 text-slate-700">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">Регион обслуживания</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Санкт-Петербург и ЛО
              </span>
            </div>

            {/* Terms of Service */}
            <button
              type="button"
              onClick={() => alert('Договор оферты на ветеринарные услуги (Закон РФ № 4979-1)')}
              className="py-2.5 w-full flex items-center justify-between text-left text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">Пользовательское соглашение и оферта</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Privacy Policy */}
            <button
              type="button"
              onClick={() => alert('Политика обработки персональных данных по 152-ФЗ РФ')}
              className="py-2.5 w-full flex items-center justify-between text-left text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold">Политика конфиденциальности (152-ФЗ)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* 24/7 Hotline Support */}
            <a
              href="tel:+78129212403"
              className="py-2.5 w-full flex items-center justify-between text-left text-blue-600 font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Диспетчерская служба 24/7: +7 (812) 921-24-03</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
            </a>
          </div>
        </div>

        {onSwitchToDoctor && (
          <button
            type="button"
            onClick={onSwitchToDoctor}
            className="w-full py-3.5 px-4 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 text-teal-800 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Stethoscope className="w-4 h-4 shrink-0 text-teal-600" />
            <span>Переключиться в кабинет ветеринарного врача</span>
          </button>
        )}

        {/* Section 5: Logout Action */}
        <button
          type="button"
          onClick={() => {
            if (onSignOut) {
              onSignOut();
            } else {
              alert('Выход из профиля выполнен');
            }
          }}
          className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-rose-700 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Выйти из профиля</span>
        </button>
      </div>
    </div>
  );
};
