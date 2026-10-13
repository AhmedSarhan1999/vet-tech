import React, { useState, useEffect, useMemo } from 'react';
import { DigitalVetPassport } from '../../shared/types/vet-passport';
import { PetPassportRepository, SpeciesRepository, SeedService } from '../../dal';
import { useAuth } from '../auth/AuthContext';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Car,
  Zap,
  Edit3,
  Lock,
  CheckCircle2,
  Clock,
  Briefcase,
  X,
} from 'lucide-react';

import { BookingSlotScreen } from '../booking';
import { useDragScroll } from '../../shared/lib/use-drag-scroll';
import { BookingRepository } from '@/dal/booking.repository';
import { BookingOrder } from '@/shared/types/booking';

export interface DispatchScreenProps {
  readonly passportRepo: PetPassportRepository;
  readonly speciesRepo: SpeciesRepository;
  readonly bookingRepo?: BookingRepository;
  readonly preselectedPet?: DigitalVetPassport;
  readonly onBackToHome?: () => void;
  readonly onNavigateToPassport?: (petId: string) => void;
  readonly onSelectDoctorForBooking?: (doctor: DoctorProfile, pet: DigitalVetPassport | null) => void;
  readonly onCompleteBooking?: (order?: BookingOrder) => void;
}

type SpecializationTabId = 'therapist' | 'surgeon' | 'exotic';

export interface DoctorProfile {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly education: string;
  readonly experienceYears: number;
  readonly rating: number;
  readonly callsCount: number;
  readonly vetIsLicense: string;
  readonly equipment: string;
  readonly vehicle: string;
  readonly etaMinutes: number;
  readonly locationNote: string;
  readonly priceRubles: number;
  readonly priceDescription: string;
  readonly category: SpecializationTabId;
  readonly avatarUrl?: string;
  readonly avatarInitials: string;
  readonly isPrimaryChoice?: boolean;
}

const VERIFIED_DOCTORS: readonly DoctorProfile[] = [
  {
    id: 'doc-romanov',
    name: 'Д-р Романов Дмитрий С.',
    title: 'Ветврач-терапевт, хирург',
    education: 'СПбГУВМ',
    experienceYears: 11,
    rating: 4.98,
    callsCount: 320,
    vetIsLicense: 'ВетИС «Хорриот» #RU-78/VET • Лицензия УВ...',
    equipment: 'Укладка: Чип-сканер ISO, лампа Вуда, тесты п...',
    vehicle: 'Renault Duster',
    etaMinutes: 15,
    locationNote: 'Большой пр. П.С.',
    priceRubles: 3200,
    priceDescription: 'ОСМОТР + ТЕРМОМЕТРИЯ + ВЕТИС',
    category: 'therapist',
    avatarInitials: 'РД',
    isPrimaryChoice: true,
  },
  {
    id: 'doc-smirnova',
    name: 'Д-р Смирнова Екатерина В.',
    title: 'Ветврач-инфекционист / Неотложная помощь',
    education: 'СПбГУВМ',
    experienceYears: 8,
    rating: 4.95,
    callsCount: 180,
    vetIsLicense: 'ВетИС «Хорриот» #RU-78/VET • Лицензия УВ...',
    equipment: 'Укладка: Инфузомат, пульсоксиметр, экспресс-ПЦР',
    vehicle: 'Skoda Yeti',
    etaMinutes: 25,
    locationNote: 'Каменноостровский',
    priceRubles: 3500,
    priceDescription: 'Расширенный ветприем',
    category: 'therapist',
    avatarInitials: 'СЕ',
    isPrimaryChoice: false,
  },
  {
    id: 'doc-vasiliev',
    name: 'Д-р Васильев Кирилл М.',
    title: 'Ветеринарный врач общей практики',
    education: 'СПбГАВМ',
    experienceYears: 6,
    rating: 4.91,
    callsCount: 115,
    vetIsLicense: 'ВетИС «Хорриот» #RU-78/VET • Лицензия УВ...',
    equipment: 'Укладка: Отоскоп, офтальмоскоп, микроскоп',
    vehicle: 'Kia Rio',
    etaMinutes: 30,
    locationNote: 'м. Чкаловская',
    priceRubles: 2900,
    priceDescription: 'Базовый выезд ветврача',
    category: 'therapist',
    avatarInitials: 'ВК',
    isPrimaryChoice: false,
  },
];

export const DispatchScreen: React.FC<DispatchScreenProps> = ({
  passportRepo,
  speciesRepo,
  bookingRepo,
  preselectedPet,
  onBackToHome,
  onNavigateToPassport,
  onSelectDoctorForBooking,
  onCompleteBooking,
}) => {
  const { user } = useAuth();
  const [pets, setPets] = useState<readonly DigitalVetPassport[]>([]);
  const [selectedPet, setSelectedPet] = useState<DigitalVetPassport | null>(preselectedPet ?? null);
  const [activeTab, setActiveTab] = useState<SpecializationTabId>('therapist');
  const [callReason, setCallReason] = useState<string>('Вялость, отказ от корма, подозрение на ОРВИ');
  const [isEditingReason, setIsEditingReason] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [isConfirmedDispatch, setIsConfirmedDispatch] = useState<boolean>(false);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(null);
  const filterTabsRef = useDragScroll<HTMLDivElement>();

  // Load pets from DAL
  useEffect(() => {
    async function loadPetsData() {
      await SeedService.seedAll(speciesRepo, passportRepo);
      const res = await passportRepo.findAll();
      if (res.success && res.data.length > 0) {
        setPets(res.data);
        if (!selectedPet) {
          const defaultPet = res.data.find((p) => p.petName === 'Норд') ?? res.data[0] ?? null;
          setSelectedPet(defaultPet);
        }
      }
    }
    loadPetsData();
  }, [passportRepo, speciesRepo, selectedPet]);

  useEffect(() => {
    if (preselectedPet) {
      setSelectedPet(preselectedPet);
    }
  }, [preselectedPet]);

  // Format pet age
  const petAgeFormatted = useMemo(() => {
    if (!selectedPet) return '3 года';
    const birth = new Date(selectedPet.birthDateIso);
    const now = new Date();
    const diffYears = now.getFullYear() - birth.getFullYear();
    if (diffYears <= 1) return '1 год';
    if (diffYears >= 2 && diffYears <= 4) return `${diffYears} года`;
    return `${diffYears} лет`;
  }, [selectedPet]);

  const activePetMicrochipShort = useMemo(() => {
    if (!selectedPet?.microchip?.chipNumber) return '#643094100';
    return `#${selectedPet.microchip.chipNumber.slice(0, 9)}`;
  }, [selectedPet]);

  // Filter doctors by tab
  const filteredDoctors = useMemo(() => {
    return VERIFIED_DOCTORS.filter((doc) => {
      if (activeTab === 'therapist') return doc.category === 'therapist';
      if (activeTab === 'surgeon') return doc.category === 'surgeon' || doc.title.includes('хирург');
      if (activeTab === 'exotic') return doc.category === 'exotic';
      return true;
    });
  }, [activeTab]);

  const handleSelectDoctor = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    if (onSelectDoctorForBooking) {
      onSelectDoctorForBooking(doc, selectedPet);
    } else {
      setBookingDoctor(doc);
    }
  };

  const handleExpressDispatch = () => {
    const defaultHeroDoctor = VERIFIED_DOCTORS[0];
    if (defaultHeroDoctor) {
      handleSelectDoctor(defaultHeroDoctor);
    }
  };

  if (bookingDoctor) {
    return (
      <BookingSlotScreen
        doctor={bookingDoctor}
        pet={selectedPet}
        onBack={() => setBookingDoctor(null)}
        bookingRepo={bookingRepo}
        onCompleteBooking={(order) => {
          setBookingDoctor(null);
          onCompleteBooking?.(order);
        }}
      />
    );
  }

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* A. TOP NAVIGATION & HEADER (SLEEK STICKY BAR)            */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                aria-label="Назад на главную"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                СПб ВетСлужба 24/7
              </h1>
              <div className="text-[10px] font-extrabold text-blue-700 tracking-wider uppercase mt-0.5 truncate">
                ВЫЗОВ ВЕТВРАЧА • ПЕТРОГРАДСКИЙ Р-Н
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-800 shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'В'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* ACTIVE PET CONTEXT CARD (Subtle Blue Capsule)            */}
        {/* ========================================================= */}
        {selectedPet && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                  {selectedPet.speciesCategory === 'canine' ? '🐕' : '🐈'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 truncate">
                    {selectedPet.petName} • {selectedPet.breedNameRu}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {petAgeFormatted} • {selectedPet.weightKg} кг • Чип {activePetMicrochipShort}
                  </div>
                </div>
              </div>

              {onNavigateToPassport && (
                <button
                  type="button"
                  onClick={() => onNavigateToPassport(selectedPet.id)}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-200 px-2.5 py-1 rounded-xl shrink-0 transition-all hover:shadow-xs active:scale-95"
                >
                  Ветпаспорт
                </button>
              )}
            </div>

            {/* Editable Chief Complaint Tag */}
            <div className="pt-2 border-t border-blue-100/80 flex items-center justify-between gap-2 text-xs">
              {!isEditingReason ? (
                <>
                  <div className="text-[11px] text-slate-700 truncate flex-1">
                    <span className="font-extrabold text-blue-900">Повод:</span> {callReason}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingReason(true)}
                    className="p-1 text-slate-400 hover:text-blue-700 rounded-md transition-colors shrink-0"
                    title="Изменить повод вызова"
                  >
                    <Edit3 className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-1.5 w-full">
                  <input
                    type="text"
                    value={callReason}
                    onChange={(e) => setCallReason(e.target.value)}
                    className="flex-1 text-xs bg-white border border-blue-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingReason(false)}
                    className="px-2.5 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-lg shrink-0"
                  >
                    OK
                  </button>
                </div>
              )}
            </div>

            {/* Multiple pet quick selector pills */}
            {pets.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pt-0.5">
                {pets.map((p) => {
                  const isCur = p.id === selectedPet.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPet(p)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                        isCur
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-blue-100 hover:bg-blue-50'
                      }`}
                    >
                      {p.petName} ({p.weightKg} кг)
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* ========================================================= */}
        {/* B. SPECIALIZATION FILTER TABS                            */}
        {/* ========================================================= */}
        <div
          ref={filterTabsRef}
          className="overflow-x-auto no-scrollbar scroll-smooth flex gap-2 cursor-grab active:cursor-grabbing select-none"
        >
          <button
            type="button"
            onClick={() => setActiveTab('therapist')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeTab === 'therapist'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Ветеринары-терапевты</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'therapist'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('surgeon')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeTab === 'surgeon'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Ветхирурги / Травматологи</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'surgeon'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              2
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exotic')}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              activeTab === 'exotic'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>Ратологи / Экзоты</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* C. EXPRESS DISPATCH HERO BANNER (Clinical Blue Gradient)  */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 shadow-lg space-y-3 relative overflow-hidden">
          {/* Subtle Ambient Pulse */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Tags */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-100 flex items-center space-x-1">
              <span className="shrink-0 inline-flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              </span>
              <span>СРОЧНЫЙ ВЫЕЗД • АВТОСОПРОВОЖДЕНИЕ</span>
            </span>

            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-sm shrink-0 border border-white/20 flex items-center space-x-1">
              <Clock className="w-3 h-3 shrink-0" />
              <span>ETA ~20 мин</span>
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-base font-black tracking-tight leading-snug">
              Ближайший дежурный ветэкипаж
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
              Автоматический подбор аттестованного ветеринарного врача в радиусе 3 км по Петроградскому району. Доезд ~20-25 мин со сканером чипов и реанимационным набором.
            </p>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-2 border-t border-white/20 flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-extrabold text-blue-200 uppercase tracking-wider block">
                ФИКСИРОВАННЫЙ ТАРИФ ОСМОТРА:
              </span>
              <span className="text-lg font-black text-white">3 200 ₽</span>
            </div>

            <button
              type="button"
              onClick={handleExpressDispatch}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0 min-h-[44px] flex items-center justify-center space-x-1"
            >
              <span>Вызвать экстренно</span>
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* D. AVAILABLE DOCTORS LIST                                */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <span>Ветеринары онлайн</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>GPS АКТИВЕН</span>
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">СПбГУВМ</span>
          </div>

          {filteredDoctors.map((doc) => {
            const isPrimary = doc.isPrimaryChoice;

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl bg-white border transition-all space-y-3 ${
                  isPrimary
                    ? 'border-blue-300 shadow-clinical ring-1 ring-blue-50'
                    : 'border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Doctor Header & Bio */}
                <div className="flex items-start space-x-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                        isPrimary
                          ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {doc.avatarInitials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 truncate">{doc.name}</h4>
                      <span className="flex items-center space-x-0.5 text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                        <span>{doc.rating}</span>
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
                      {doc.title} • {doc.education}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      ★ {doc.rating} • {doc.callsCount}+ выездов • Стаж {doc.experienceYears} лет
                    </p>
                  </div>
                </div>

                {/* Feature Pills */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700">
                    <span className="shrink-0 inline-flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    </span>
                    <span className="truncate">{doc.vetIsLicense}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-slate-700">
                    <span className="shrink-0 inline-flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    </span>
                    <span className="truncate">{doc.equipment}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-700">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="shrink-0 inline-flex items-center justify-center">
                        <Car className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      </span>
                      <span className="truncate">
                        {doc.vehicle} • Доезд: ~{doc.etaMinutes} мин ({doc.locationNote})
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                      ~{doc.etaMinutes} мин
                    </span>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block truncate">
                      {doc.priceDescription}:
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {doc.priceRubles.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectDoctor(doc)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shrink-0 min-h-[44px] flex items-center justify-center space-x-1 ${
                      isPrimary
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <span>Выбрать ветврача</span>
                    <span className="text-sm">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* E. ESCROW & LEGAL SECURITY CARD                          */}
        {/* ========================================================= */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
              <ShieldCheck className="w-4 h-4 shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                  Безопасная сделка ЮKassa & Закон РФ № 4979-1 «О ветеринарии»
                </h4>
                <span className="text-[9px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.2 rounded shrink-0">
                  ВетИС Хорриот
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-1.5">
                Средства замораживаются на вашей карте и списываются исключительно после завершения осмотра, внесения записей в электронный ветпаспорт ФГИС «ВетИС» (Хорриот) и подписания электронного акта владельцем животного.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-y-1 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Безопасный эквайринг ЮKassa</span>
            </span>
            <span>•</span>
            <span>Чек ФНС 54-ФЗ</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">0% скрытых комиссий</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CONFIRMED DISPATCH MODAL / RADAR ACTIVE STATE            */}
      {/* ========================================================= */}
      {isConfirmedDispatch && selectedDoctor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsConfirmedDispatch(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-blue-700 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                  Экипаж назначен • ФГИС «ВетИС»
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Врач направлен к питомцу
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmedDispatch(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 shrink-0"
              >
                <X className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Doctor Info Capsule */}
            <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-base shrink-0 shadow-xs">
                {selectedDoctor.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-extrabold text-slate-900 truncate">
                  {selectedDoctor.name}
                </h4>
                <p className="text-[11px] text-blue-800 font-semibold truncate">
                  {selectedDoctor.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  🚗 {selectedDoctor.vehicle} • Доезд: ~{selectedDoctor.etaMinutes} мин
                </p>
              </div>
            </div>

            {/* Patient & Address */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Пациент:</span>
                <span className="font-bold text-slate-800">
                  {selectedPet?.petName} ({selectedPet?.weightKg} кг)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Адрес выезда:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
                  {selectedPet?.residentialAddress.district} р-н,{' '}
                  {selectedPet?.residentialAddress.streetAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Повод вызова:</span>
                <span className="font-medium text-blue-700 text-right truncate max-w-[200px]">
                  {callReason}
                </span>
              </div>
            </div>

            {/* Escrow Status Hold */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block">ЮKassa Escrow Холд</span>
                  <span className="text-[10px] text-emerald-700">
                    {selectedDoctor.priceRubles.toLocaleString('ru-RU')} ₽ заблокировано
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                ✓ Авторизовано
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmedDispatch(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-all min-h-[44px]"
            >
              Понятно, ожидаю экипаж
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
