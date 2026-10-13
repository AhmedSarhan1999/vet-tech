import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Building,
  GraduationCap,
  KeyRound,
} from 'lucide-react';

export interface DoctorAccreditationScreenProps {
  readonly onBack: () => void;
}

export const DoctorAccreditationScreen: React.FC<DoctorAccreditationScreenProps> = ({
  onBack,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Bar Header */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Ветеринарная аккредитация и реестры
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              ВЕТИС • СПбГУВМ • Минсельхоз РФ
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          Аттестован
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50/50 rounded-3xl p-5 border-2 border-emerald-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>СТАТУС: ВЕРИФИЦИРОВАННЫЙ ВЕТВРАЧ РФ</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              ID: SPB-VET-78-014
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Врач подтвердил диплом государственного образца, прошел проверку в Россельхознадзоре и имеет активный сертификат УКЭП по ГОСТ Р 34.10-2012 для оформления ветеринарных сопроводительных документов (ВСД).
          </p>
        </div>

        {/* 1. Higher Veterinary Education */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Базовое высшее образование
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Диплом с отличием
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">ВУЗ:</span>
              <strong className="text-slate-900">
                Санкт-Петербургский государственный университет ветеринарной медицины (СПбГУВМ)
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Специальность:</span>
                <span className="text-slate-800 font-semibold">Ветеринария (06.05.01)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Год выпуска:</span>
                <span className="text-slate-800 font-semibold">2015 г. (Стаж 11 лет)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Номер диплома:</span>
                <span className="font-mono font-bold text-slate-900">ВСА #092812/СПб</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Регистрационный номер:</span>
                <span className="font-mono font-bold text-slate-900">РЕГ-15-4402</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Registry & Licenses in FGIS VetIS */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Реестры Россельхознадзора и ВетИС
              </h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Хорриот / Меркурий
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">UUID врача в ФГИС «Хорриот»:</span>
                <span className="font-mono font-bold text-blue-800 text-[11px]">
                  78-DOC-HORRIOT-5920-E
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Право маркирования, официального чипирования и внесения вакцинаций от бешенства.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Лицензия Управления ветеринарии СПб:</span>
                <span className="font-mono font-bold text-slate-900">УВ-78-102-ВЕТ</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Бессрочная лицензия на оказание лечебно-профилактической ветеринарной помощи.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Qualified Enhanced Digital Signature (UKEP) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-indigo-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Квалифицированная ЭЦП врача (УКЭП)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">
              ГОСТ Р 34.10-2012
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Криптопровайдер:</span>
                <span className="font-bold text-slate-900">КриптоПро CSP 5.0 R3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Номер сертификата:</span>
                <span className="font-mono font-bold text-slate-900">78-Vet-2026-9812-UKEP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Срок действия:</span>
                <span className="text-emerald-700 font-bold">до 18 июля 2027 г.</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-tight">
              Используется для удаленного заверения протоколов осмотра, автоматического экспорта ветпаспортов и подписи фискальных актов по 54-ФЗ.
            </p>
          </div>
        </div>

        {/* Re-sync Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'Синхронизация с реестрами...'
                : 'Синхронизировать статус с ВетИС / Госуслугами'}
            </span>
          </button>

          {syncSuccess && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Данные аккредитации успешно подтверждены в Россельхознадзоре!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
