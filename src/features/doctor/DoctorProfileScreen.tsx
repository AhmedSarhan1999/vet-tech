import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  RefreshCw,
  LogOut,
  Bell,
  Settings,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
  ChevronRight,
  MapPin,
  Car,
  Star,
  FileSpreadsheet,
  BriefcaseMedical,
} from 'lucide-react';

import { DoctorAccreditationScreen } from './DoctorAccreditationScreen';
import { DoctorLogisticsScreen } from './DoctorLogisticsScreen';
import { DoctorPriceListScreen } from './DoctorPriceListScreen';
import { DoctorMedicalKitScreen } from './DoctorMedicalKitScreen';
import { DoctorReviewsScreen } from './DoctorReviewsScreen';

export interface DoctorProfileScreenProps {
  readonly onSwitchToPetParent?: () => void;
  readonly onSignOut?: () => void;
}

export type DoctorProfileSubScreen =
  | 'accreditation'
  | 'logistics'
  | 'price_list'
  | 'medical_kit'
  | 'reviews'
  | null;

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({
  onSwitchToPetParent,
  onSignOut,
}) => {
  const [activeSubScreen, setActiveSubScreen] = useState<DoctorProfileSubScreen>(null);
  const [isSyncingRegistry, setIsSyncingRegistry] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sub-screens rendering
  if (activeSubScreen === 'accreditation') {
    return <DoctorAccreditationScreen onBack={() => setActiveSubScreen(null)} />;
  }

  if (activeSubScreen === 'logistics') {
    return <DoctorLogisticsScreen onBack={() => setActiveSubScreen(null)} />;
  }

  if (activeSubScreen === 'price_list') {
    return <DoctorPriceListScreen onBack={() => setActiveSubScreen(null)} />;
  }

  if (activeSubScreen === 'medical_kit') {
    return <DoctorMedicalKitScreen onBack={() => setActiveSubScreen(null)} />;
  }

  if (activeSubScreen === 'reviews') {
    return <DoctorReviewsScreen onBack={() => setActiveSubScreen(null)} />;
  }

  const handleSyncWithVetis = () => {
    setIsSyncingRegistry(true);
    setTimeout(() => {
      setIsSyncingRegistry(false);
      setSyncToast('Синхронизация с ФГИС «ВетИС» (Хорриот) и Россельхознадзором успешна!');
      setTimeout(() => setSyncToast(null), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* A. Sticky Header (Screen image_07d9f5) */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black text-blue-700 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block w-fit">
            СПб ВетСлужба 24/7 PRO • ID: SPB-VET-78-014
          </span>
          <h1 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
            Клинический профиль врача
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onSwitchToPetParent}
            className="flex items-center space-x-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Переключиться в кабинет владельца"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] hidden sm:inline">Владелец</span>
          </button>

          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 relative"
            aria-label="Уведомления"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubScreen('logistics')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
            aria-label="Настройки полигона"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Doctor Primary Identity Card (High-contrast clinical light surface) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
          <div className="flex items-start gap-3.5">
            {/* Avatar with Active Online Beacon */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md ring-2 ring-blue-400/30">
                РД
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 tracking-wider">
                  ВЕТВРАЧ ПЕРВОГО КОНТАКТА • СПбГУВМ
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 truncate">
                Д-р Романов Д. С.
              </h2>
              <p className="text-xs text-slate-600 font-semibold">
                Ветеринарный терапевт, хирург • Стаж 11 лет
              </p>

              {/* Contacts row */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600">
                <a
                  href="tel:+79218881544"
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-mono text-[11px]"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span>+7 (921) 888-15-44</span>
                </a>
                <span className="text-slate-300">•</span>
                <span className="flex items-center space-x-1 text-slate-700 font-mono text-[11px]">
                  <Mail className="w-3 h-3 text-indigo-600" />
                  <span>dr.romanov@vet-spb.ru</span>
                </span>
              </div>
            </div>
          </div>

          {/* Regulatory Accreditation Badge */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-[11px]">
                Верифицирован в ФГИС «ВетИС» (Хорриот & Меркурий) • АТТЕСТОВАН
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              ГОСТ Р
            </span>
          </div>
        </div>

        {/* B. Veterinary Accreditation & Registries Section */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Ветеринарная аккредитация и реестры</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">ВЕТИС / СПбГУВМ</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubScreen('accreditation')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5 cursor-pointer"
            >
              <span>Подробнее</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Tile 1: Education */}
            <div
              onClick={() => setActiveSubScreen('accreditation')}
              className="p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900">
                  Ветеринария • СПбГУВМ (Диплом с отличием)
                </h4>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Верифицирован</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Квалификация: Ветеринарный врач • Лицензия УВ-78-102
              </p>
            </div>

            {/* Tile 2: FGIS VetIS Registry */}
            <div
              onClick={() => setActiveSubScreen('accreditation')}
              className="p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl border border-slate-200 transition-colors cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-800 text-xs">
                  # VET-78-04891 • Оформление ВСД и ветпаспортов
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ВетИС: Активен
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Право официального чипирования, вакцинации и выдачи ветсвидетельств
              </p>
            </div>

            {/* Tile 3: UKEP Digital Signature */}
            <div
              onClick={() => setActiveSubScreen('accreditation')}
              className="p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-1 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-900 uppercase flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>КриптоПро CSP • ГОСТ Р 34.10-2012</span>
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              </div>
              <p className="text-[11px] text-indigo-950 leading-tight">
                Действителен до июля 2027 г. Подписание электронных паспортов, ВСД и актов клинического осмотра
              </p>
            </div>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSyncWithVetis}
            disabled={isSyncingRegistry}
            className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncingRegistry ? 'animate-spin' : ''}`} />
            <span>Синхронизировать статус с ВетИС / Россельхознадзор</span>
          </button>

          {syncToast && (
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold text-center animate-fadeIn">
              {syncToast}
            </div>
          )}
        </div>

        {/* C. Service Zone & Zoo-Logistics Section */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Зона выездов и зоо-логистика</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              СПб ВетКластер
            </span>
          </div>

          {/* Interactive Cluster Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50/70 to-slate-50 rounded-2xl border border-blue-200/80 space-y-2.5">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">
                СЕКТОР VET-СЕВЕР • GPS спецавто активен
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Петроградский р-н + Крестовский и Васильевский о-ва
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Радиус выезда:</span>
                <strong className="text-slate-900 font-mono">4.8 км</strong> (~15–20 мин)
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Транспорт:</span>
                <span className="text-slate-900 font-bold flex items-center space-x-1">
                  <Car className="w-3 h-3 text-blue-600" />
                  <span>Renault Duster (#14)</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSubScreen('logistics')}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
            >
              <span>Скорректировать полигон и радиус на карте →</span>
            </button>
          </div>
        </div>

        {/* D. Practice Management & Mobile Kit (Оперативный пул) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Оперативный пул и практика
          </h3>

          <div className="space-y-2">
            {/* Item 1: Reviews */}
            <div
              onClick={() => setActiveSubScreen('reviews')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Рейтинг и отзывы владельцев
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    ★ 4.98 • 142 верифицированных отзыва кураторов
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Item 2: Price List */}
            <div
              onClick={() => setActiveSubScreen('price_list')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Прейскурант ветуслуг и процедур
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    18 процедур • Чипирование, вакцинация Nobivac, УЗИ
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Item 3: Medical Kit */}
            <div
              onClick={() => setActiveSubScreen('medical_kit')}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <BriefcaseMedical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Укладка и биопрепараты
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    24 позиции • Холод +2..+8°C • 98% готовность
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* E. Shift Termination & Regulatory Footer */}
        <div className="space-y-3 pt-2">
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full py-4 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-200 rounded-2xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center space-x-2 cursor-pointer active:scale-98 shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Завершить дежурство и выйти из аккаунта</span>
            </button>
          )}

          <div className="text-center space-y-1 text-[10px] text-slate-400">
            <p>
              ФГИС ВЕТИС • УПРАВЛЕНИЕ ВЕТЕРИНАРИИ СПБ • Лицензия УВ-78-102-ВЕТ
            </p>
            <p className="font-mono">
              Шифрование ГОСТ Р 34.10-2012 • 422-ФЗ НПД • 54-ФЗ Онлайн-касса
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
