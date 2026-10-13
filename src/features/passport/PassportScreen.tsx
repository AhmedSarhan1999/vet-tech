import React, { useState, useEffect } from 'react';
import { DigitalVetPassport } from '../../shared/types/vet-passport';
import { PetPassportRepository, SpeciesRepository, SeedService } from '../../dal';
import { useAuth } from '../auth/AuthContext';
import { PetPassportDetail } from './components/PetPassportDetail';
import { PetRegistrationWizard } from './components/PetRegistrationWizard';
import { TherapyMedicationTrackerScreen } from './TherapyMedicationTrackerScreen';
import { Plus, ArrowLeft, Dog, Cat, Rat, Rabbit, PawPrint } from 'lucide-react';
import { useDragScroll } from '../../shared/lib/use-drag-scroll';

export interface PassportScreenProps {
  readonly passportRepo: PetPassportRepository;
  readonly speciesRepo: SpeciesRepository;
  readonly initialSelectedPetId?: string;
  readonly onNavigateToAppointments?: (pet?: DigitalVetPassport) => void;
  readonly onBackToHome?: () => void;
}

export const PassportScreen: React.FC<PassportScreenProps> = ({
  passportRepo,
  speciesRepo,
  initialSelectedPetId,
  onNavigateToAppointments,
  onBackToHome,
}) => {
  const { user } = useAuth();
  const petTabsRef = useDragScroll<HTMLDivElement>();
  const [passports, setPassports] = useState<readonly DigitalVetPassport[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(initialSelectedPetId ?? null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isTherapyTrackerOpen, setIsTherapyTrackerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load passports
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await SeedService.seedAll(speciesRepo, passportRepo);
      const res = await passportRepo.findAll();
      if (res.success) {
        setPassports(res.data);
        if (!selectedPetId && res.data.length > 0) {
          const first = res.data[0];
          if (first) {
            setSelectedPetId(first.id);
          }
        }
      }
      setIsLoading(false);
    }
    loadData();
  }, [passportRepo, speciesRepo, selectedPetId]);

  // When initialSelectedPetId changes externally
  useEffect(() => {
    if (initialSelectedPetId) {
      setSelectedPetId(initialSelectedPetId);
      setIsWizardOpen(false);
      setIsTherapyTrackerOpen(false);
    }
  }, [initialSelectedPetId]);

  const selectedPassport = passports.find((p) => p.id === selectedPetId) ?? passports[0] ?? null;

  const handlePetCreated = (newPassport: DigitalVetPassport) => {
    setPassports((prev) => [...prev, newPassport]);
    setSelectedPetId(newPassport.id);
    setIsWizardOpen(false);
  };

  const renderSpeciesIcon = (cat: string, isSelected: boolean = false) => {
    const iconColor = isSelected ? 'text-white' : undefined;
    switch (cat) {
      case 'canine':
        return <Dog className={`w-4 h-4 shrink-0 ${iconColor ?? 'text-blue-500'}`} />;
      case 'feline':
        return <Cat className={`w-4 h-4 shrink-0 ${iconColor ?? 'text-amber-500'}`} />;
      case 'rodent':
        return <Rat className={`w-4 h-4 shrink-0 ${iconColor ?? 'text-slate-500'}`} />;
      case 'lagomorph':
        return <Rabbit className={`w-4 h-4 shrink-0 ${iconColor ?? 'text-pink-500'}`} />;
      default:
        return <PawPrint className={`w-4 h-4 shrink-0 ${iconColor ?? 'text-teal-500'}`} />;
    }
  };

  // If therapy tracker is active, render dedicated screen
  if (isTherapyTrackerOpen && selectedPassport) {
    return (
      <TherapyMedicationTrackerScreen
        pet={selectedPassport}
        onBack={() => setIsTherapyTrackerOpen(false)}
      />
    );
  }

  // If pet registration wizard is active, render isolated fullscreen takeover
  if (isWizardOpen) {
    return (
      <div className="min-h-full pb-24 font-sans bg-slate-50/60 p-4">
        <PetRegistrationWizard
          speciesRepo={speciesRepo}
          passportRepo={passportRepo}
          currentUserId={user?.uid ?? 'usr-spb-01'}
          currentUserFullName={user?.displayName ?? 'Смирнова Елена Васильевна'}
          currentUserPhone={user?.phoneNumber ?? '+7 (921) 987-65-43'}
          onComplete={handlePetCreated}
          onCancel={() => setIsWizardOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/60">
      {/* Clean High-End Action Bar */}
      <div className="bg-white border-b border-slate-200/80 p-4 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          {onBackToHome ? (
            <button
              type="button"
              onClick={onBackToHome}
              aria-label="Назад на главную"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 shrink-0 text-white" />
            <span>Добавить питомца</span>
          </button>
        </div>

        {/* Pet Selector Tabs */}
        {passports.length > 0 && (
          <div
            ref={petTabsRef}
            style={{ touchAction: 'pan-x' }}
            className="overflow-x-auto no-scrollbar flex gap-2 pt-1 pb-1 cursor-grab active:cursor-grabbing select-none"
          >
            {passports.map((pet) => {
              const isSelected = pet.id === selectedPassport?.id;
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all select-none cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                      : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="shrink-0">{renderSpeciesIcon(pet.speciesCategory, isSelected)}</span>
                  <span className="font-bold">{pet.petName}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-500/40 text-blue-50 border border-blue-400/30'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {pet.weightKg} кг
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-medium">Синхронизация с реестром «Хорриот»...</p>
          </div>
        ) : selectedPassport ? (
          <PetPassportDetail
            passport={selectedPassport}
            onRequestHouseCall={(pet) => onNavigateToAppointments?.(pet)}
            onOpenTherapyTracker={() => setIsTherapyTrackerOpen(true)}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <PawPrint className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Нет зарегистрированных питомцев</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Оформите официальный электронный ветпаспорт животного по правилам Закона № 4979-1
            </p>
            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              + Зарегистрировать первого питомца
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
