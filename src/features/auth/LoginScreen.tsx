import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '@/shared/types/auth';
import { Button, Input, Card, Badge } from '@/shared/components/ui';
import {
  Stethoscope,
  Heart,
  Smartphone,
  Lock,
  ArrowRight,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Award,
  Zap,
  Headphones,
} from 'lucide-react';
import { DoctorOnboardingScreen } from '../doctor/DoctorOnboardingScreen';

export const LoginScreen: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    signInWithGoogle,
    signInWithPhone,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [rawPhone, setRawPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Phone masking function for +7 (9XX) XXX-XX-XX
  const formatRussianPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    let cleanDigits = digits;

    if (cleanDigits.startsWith('7') || cleanDigits.startsWith('8')) {
      cleanDigits = cleanDigits.slice(1);
    }

    cleanDigits = cleanDigits.slice(0, 10);

    if (cleanDigits.length === 0) {
      return '';
    }

    let formatted = '+7 (';
    if (cleanDigits.length > 0) {
      formatted += cleanDigits.substring(0, Math.min(3, cleanDigits.length));
    }
    if (cleanDigits.length >= 3) {
      formatted += ') ';
      formatted += cleanDigits.substring(3, Math.min(6, cleanDigits.length));
    }
    if (cleanDigits.length >= 6) {
      formatted += '-';
      formatted += cleanDigits.substring(6, Math.min(8, cleanDigits.length));
    }
    if (cleanDigits.length >= 8) {
      formatted += '-';
      formatted += cleanDigits.substring(8, Math.min(10, cleanDigits.length));
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRussianPhone(e.target.value);
    setRawPhone(formatted);
    if (phoneError) setPhoneError(null);
    if (error) clearError();
  };

  const handleRoleToggle = (role: UserRole) => {
    setActiveRole(role);
    if (error) clearError();
  };

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length < 11) {
      setPhoneError('Введите полный 10-значный номер телефона');
      return;
    }

    // Per directive: sign-in action connects to Firebase Google Auth via isolated repository adapter
    // or simulated phone entry for testing.
    await signInWithGoogle(activeRole);
  };

  const handleGoogleSso = async () => {
    await signInWithGoogle(activeRole);
  };

  const handlePhoneSimulated = async () => {
    const digits = rawPhone.replace(/\D/g, '');
    const phoneToUse = digits.length >= 11 ? rawPhone : '+7 (921) 987-65-43';
    await signInWithPhone(phoneToUse, activeRole);
  };

  const handleAdminBypass = async () => {
    await signInWithPhone('+7 (812) 200-78-00', 'admin');
  };

  if (isOnboardingOpen) {
    return (
      <DoctorOnboardingScreen
        onBack={() => setIsOnboardingOpen(false)}
        onCompleted={() => setIsOnboardingOpen(false)}
      />
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Brand Header & Regulatory Badges */}
      <div className="text-center pt-2 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-vet-blue-600 text-white shadow-clinical">
          <Stethoscope className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-xl font-black text-vet-slate-900 tracking-tight">
            VetTech OS
          </h1>
          <p className="text-xs text-vet-slate-500 font-medium">
            Телемедицина и экстренный выезд ветеринарного врача • Санкт-Петербург
          </p>
        </div>

        {/* Regulatory Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <Badge variant="verified" size="sm" showDot>
            ФГИС «ВетИС» (Хорриот)
          </Badge>
          <Badge variant="neutral" size="sm">
            4979-1-ФЗ
          </Badge>
          <Badge variant="teal" size="sm">
            152-ФЗ Защита ПДн
          </Badge>
        </div>
      </div>

      {/* Admin Situational Center Quick Access Gateway */}
      <div
        onClick={handleAdminBypass}
        className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 hover:border-blue-500 cursor-pointer shadow-xs transition-all space-y-2 group active:scale-98"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 leading-tight">
                Ситуационный центр СПб (Диспетчер / Админ)
              </h3>
              <span className="text-[10px] font-mono font-bold text-blue-700">
                Кузнецов И. В. • СПбГУВМ
              </span>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            24/7 Дежурство
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Управление выездными бригадами, мониторинг SOS и ВетИС-арбитраж 24/7
        </p>
        <div className="pt-0.5 flex items-center justify-between text-[11px] font-black text-blue-700">
          <span>Войти в ситуационный командный центр →</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <aside
          aria-label="Сообщение об ошибке"
          className="p-3 rounded-xl bg-vet-emergency-50 border border-vet-emergency-200 text-xs text-vet-emergency-800 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 text-vet-emergency-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Ошибка аутентификации:</span>
            <span>{error}</span>
          </div>
        </aside>
      )}

      {/* Dual-Role Toggle (Владелец питомца vs Ветеринарный врач) */}
      <div className="p-1 bg-vet-slate-200/80 rounded-2xl grid grid-cols-2 gap-1 select-none">
        <button
          type="button"
          onClick={() => handleRoleToggle('pet_parent')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeRole === 'pet_parent'
              ? 'bg-white text-vet-blue-700 shadow-clinical'
              : 'text-vet-slate-600 hover:text-vet-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Владелец питомца</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleToggle('veterinarian')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeRole === 'veterinarian'
              ? 'bg-white text-vet-teal-700 shadow-clinical'
              : 'text-vet-slate-600 hover:text-vet-slate-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Ветеринарный врач</span>
        </button>
      </div>

      {/* Role Context Hint */}
      <div className="p-3 rounded-xl bg-white border border-vet-slate-200/80 text-xs text-vet-slate-600 leading-relaxed flex items-center gap-2.5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            activeRole === 'pet_parent'
              ? 'bg-vet-blue-50 text-vet-blue-600'
              : 'bg-vet-teal-50 text-vet-teal-600'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <p className="text-[11px]">
          {activeRole === 'pet_parent'
            ? 'Личный кабинет владельца: электронный паспорт питомца, срочный вызов врача в СПб и онлайн-консультации.'
            : 'Клинический кабинет ветеринарного врача: вызовы скорой помощи по районам СПб, журнал ВетИС и телемедицина.'}
        </p>
      </div>

      {/* Dual Pathway for Doctor: Apply for Duty */}
      {activeRole === 'veterinarian' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
              Новый специалист выездной службы
            </span>
            <span className="text-[9px] font-mono font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
              ВетИС 4979-1
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            Врачам и фельдшерам Санкт-Петербурга: подайте заявку на аккредитацию для доступа к дежурствам и скорой ветпомощи.
          </p>
          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Подать заявку на дежурство (ВетИС / 4979-1) →</span>
          </button>
        </div>
      )}

      {/* Main Authentication Card */}
      <Card variant="elevated" className="space-y-4">
        <form onSubmit={handleSmsSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-vet-slate-800 uppercase tracking-wide">
              Номер телефона
            </label>
            <Input
              type="tel"
              placeholder="+7 (9XX) XXX-XX-XX"
              value={rawPhone}
              onChange={handlePhoneChange}
              error={phoneError ?? undefined}
              icon={<Smartphone className="w-4 h-4" />}
              autoComplete="tel"
            />
            <p className="text-[11px] text-vet-slate-500">
              Для тестирования: нажмите «Получить код в SMS» для запуска Google Sign-In.
            </p>
          </div>

          <Button
            type="submit"
            variant={activeRole === 'veterinarian' ? 'teal' : 'primary'}
            size="lg"
            fullWidth
            loading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Получить код в SMS
          </Button>

          {/* Quick simulated phone login button */}
          <button
            type="button"
            onClick={handlePhoneSimulated}
            className="w-full text-center text-[11px] text-vet-slate-500 hover:text-vet-blue-600 font-medium py-1 transition-colors flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Быстрый тестовый вход без SMS (демо-режим)</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-vet-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-vet-slate-400 font-semibold uppercase tracking-wider relative">
            или через сервисы
          </span>
        </div>

        {/* Firebase Google SSO Testing Trigger */}
        <button
          type="button"
          onClick={handleGoogleSso}
          disabled={isLoading}
          className="w-full h-11 px-4 rounded-xl border border-vet-slate-300 hover:border-vet-slate-400 bg-white hover:bg-vet-slate-50 active:bg-vet-slate-100 flex items-center justify-center gap-2.5 text-xs font-bold text-vet-slate-800 shadow-sm transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Войти через Google (Firebase Auth)</span>
        </button>

        {/* Russian National & Banking SSO Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          {/* Госуслуги (ЕСИА) */}
          <button
            type="button"
            onClick={handleGoogleSso}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100 text-sky-900 transition-all text-center"
            title="Единая система идентификации и аутентификации"
          >
            <span className="font-extrabold text-[11px] text-sky-700 tracking-tight">ЕСИА</span>
            <span className="text-[10px] text-sky-800 font-medium">Госуслуги</span>
          </button>

          {/* Сбер ID */}
          <button
            type="button"
            onClick={handleGoogleSso}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 transition-all text-center"
            title="Вход со Сбер ID"
          >
            <span className="font-extrabold text-[11px] text-emerald-700 tracking-tight">СБЕР</span>
            <span className="text-[10px] text-emerald-800 font-medium">Сбер ID</span>
          </button>

          {/* Т-ID */}
          <button
            type="button"
            onClick={handleGoogleSso}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 transition-all text-center"
            title="Вход с Т-Банк ID"
          >
            <span className="font-extrabold text-[11px] text-amber-700 tracking-tight">Т-ID</span>
            <span className="text-[10px] text-amber-800 font-medium">Т-Банк</span>
          </button>
        </div>
      </Card>

      {/* Specialist Application Card */}
      <Card
        variant="interactive"
        className="bg-gradient-to-br from-vet-teal-50 to-white border-vet-teal-200"
        onClick={() => handleRoleToggle('veterinarian')}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-vet-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-vet-teal-950">
                Вы ветеринарный врач в Санкт-Петербурге?
              </h4>
              <Badge variant="teal" size="sm">
                СПб
              </Badge>
            </div>
            <p className="text-[11px] text-vet-teal-800 leading-relaxed">
              Присоединяйтесь к мобильной выездной службе и телемедицине VetTech OS. Работа в выбранных районах (Центральный, Приморский и др.), официальное оформление в ФГИС «ВетИС».
            </p>
            <div className="pt-1 text-[11px] font-bold text-vet-teal-700 flex items-center gap-1">
              <span>Переключить на вход для врачей</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance & Security Footer */}
      <div className="text-center pt-2 pb-4 space-y-1 text-[11px] text-vet-slate-400">
        <div className="flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-vet-slate-400" />
          <span>Шифрование данных ГОСТ / AES-256 (152-ФЗ РФ)</span>
        </div>
        <p className="text-[10px] leading-tight text-vet-slate-400 max-w-xs mx-auto">
          Нажимая «Получить код в SMS», вы соглашаетесь с условиями ветеринарного обслуживания и обработкой данных.
        </p>
      </div>
    </div>
  );
};
