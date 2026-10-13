import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PetPassportRepository, SeedService, SpeciesRepository } from '@/dal';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import { DashboardHeader } from './components/DashboardHeader';
import { PetCarousel } from './components/PetCarousel';
import { DispatchActionCards } from './components/DispatchActionCards';
import { PhoneCall, X } from 'lucide-react';

export interface HomeScreenProps {
  onNavigateToTab?: (tab: 'appointments' | 'passport' | 'profile' | 'chats') => void;
  onOpenEmergencyModal?: () => void;
  onProfileClick?: () => void;
  onSelectPetForPassport?: (petId: string) => void;
  onSelectPetForDispatch?: (pet: DigitalVetPassport) => void;
  onRequestHouseCall?: () => void;
  onOpenTelehealth?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTab,
  onProfileClick,
  onSelectPetForPassport,
  onSelectPetForDispatch,
  onRequestHouseCall,
  onOpenTelehealth,
}) => {
  const passportRepo = useMemo(() => new PetPassportRepository(), []);
  const speciesRepo = useMemo(() => new SpeciesRepository(), []);

  const [pets, setPets] = useState<readonly DigitalVetPassport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPet, setSelectedPet] = useState<DigitalVetPassport | null>(null);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState<boolean>(true);

  // Load pets from repository
  useEffect(() => {
    async function loadPets() {
      setIsLoading(true);
      await SeedService.seedAll(speciesRepo, passportRepo);
      const res = await passportRepo.findAll();
      if (res.success) {
        setPets(res.data);
      }
      setIsLoading(false);
    }

    loadPets();
  }, [passportRepo, speciesRepo]);

  const handleHouseCallClick = useCallback(() => {
    if (onRequestHouseCall) {
      onRequestHouseCall();
    } else {
      onNavigateToTab?.('appointments');
    }
  }, [onRequestHouseCall, onNavigateToTab]);

  const handleTelehealthClick = useCallback(() => {
    if (onOpenTelehealth) {
      onOpenTelehealth();
    } else {
      onNavigateToTab?.('chats');
    }
  }, [onOpenTelehealth, onNavigateToTab]);

  return (
    <div className="w-full space-y-4 pb-4">
      {/* 1. Header with Regulatory Tag, User Greeting, Location Anchor */}
      <DashboardHeader
        districtName="Петроградский р-н, Санкт-Петербург"
        onProfileClick={onProfileClick}
        onNotificationClick={() => alert('Уведомление: Плановая вакцинация для собаки Белла через 7 дней')}
        unreadNotificationsCount={1}
      />

      {/* 2. Urgent Emergency 24/7 Call Banner */}
      {showEmergencyBanner && (
        <aside
          aria-label="Экстренная ветеринарная служба"
          className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-2 shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <PhoneCall className="shrink-0 w-4 h-4 text-red-600 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs text-red-950 block leading-tight truncate">
                Экстренная скорая вет-помощь 24/7
              </span>
              <span className="text-[10px] text-red-700 font-medium block truncate mt-0.5">
                Бригады реанимации на дежурстве во всех районах СПб
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEmergencyBanner(false)}
            className="shrink-0 p-1.5 text-red-400 hover:text-red-700 hover:bg-red-100/60 rounded-lg transition-colors"
            title="Скрыть"
            aria-label="Закрыть уведомление"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </aside>
      )}

      {/* 3. Pet Carousel (Питомцы под защитой) */}
      <PetCarousel
        pets={pets}
        isLoading={isLoading}
        onViewAllPassports={() => onNavigateToTab?.('passport')}
        onSelectPet={(pet) => setSelectedPet(pet)}
        onAddPet={() => onNavigateToTab?.('passport')}
      />

      {/* 4. Service Dispatch Action Cards & Trust Banners */}
      <DispatchActionCards
        onHouseCallClick={handleHouseCallClick}
        onTelehealthClick={handleTelehealthClick}
      />

      {/* Modal / Quick View if a pet is selected */}
      {selectedPet && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setSelectedPet(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-3.5 shadow-2xl border border-vet-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-vet-blue-600 tracking-wider">
                  Электронный паспорт питомца
                </span>
                <h3 className="text-base font-extrabold text-vet-slate-900">
                  {selectedPet.petName}
                </h3>
                <p className="text-xs text-vet-slate-500">
                  {selectedPet.breedNameRu} • {selectedPet.residentialAddress.district} район
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPet(null)}
                className="w-8 h-8 rounded-full bg-vet-slate-100 flex items-center justify-center text-vet-slate-500 hover:bg-vet-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-vet-slate-50 border border-vet-slate-100 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-vet-slate-500 font-sans">ВетИС Хорриот:</span>
                <span className="font-bold text-vet-blue-700">{selectedPet.horriotId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vet-slate-500 font-sans">Микрочип:</span>
                <span className="text-vet-slate-800">{selectedPet.microchip?.chipNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vet-slate-500 font-sans">Бланк паспорта:</span>
                <span className="text-vet-slate-800">{selectedPet.passportSeriesNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const petId = selectedPet.id;
                  setSelectedPet(null);
                  if (onSelectPetForPassport) {
                    onSelectPetForPassport(petId);
                  } else {
                    onNavigateToTab?.('passport');
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-vet-blue-600 hover:bg-vet-blue-700 text-white text-xs font-bold transition-all text-center"
              >
                Открыть паспорт
              </button>
              <button
                type="button"
                onClick={() => {
                  const pet = selectedPet;
                  setSelectedPet(null);
                  if (onSelectPetForDispatch) {
                    onSelectPetForDispatch(pet);
                  } else {
                    onNavigateToTab?.('appointments');
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-vet-teal-600 hover:bg-vet-teal-700 text-white text-xs font-bold transition-all text-center"
              >
                Вызвать врача
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
