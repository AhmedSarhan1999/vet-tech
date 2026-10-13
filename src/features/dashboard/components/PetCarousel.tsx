import React from 'react';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import { Badge } from '@/shared/components/ui/Badge';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import {
  ShieldCheck,
  Calendar,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useDragScroll } from '@/shared/lib/use-drag-scroll';

export interface PetCarouselProps {
  pets: readonly DigitalVetPassport[];
  isLoading?: boolean;
  onViewAllPassports?: () => void;
  onSelectPet?: (pet: DigitalVetPassport) => void;
  onAddPet?: () => void;
}

export const PetCarousel: React.FC<PetCarouselProps> = ({
  pets,
  isLoading = false,
  onViewAllPassports,
  onSelectPet,
  onAddPet,
}) => {
  const scrollRef = useDragScroll<HTMLDivElement>();
  // Helper to calculate age in Russian
  const formatAgeRu = (birthDateIso: string): string => {
    const birth = new Date(birthDateIso);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());

    if (diffMonths < 12) {
      return `${Math.max(1, diffMonths)} мес.`;
    }
    const years = Math.floor(diffMonths / 12);
    if (years === 1) return '1 год';
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Skeleton shape="text" className="w-36 h-4" />
          <Skeleton shape="text" className="w-24 h-3" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          <Skeleton shape="rectangular" className="min-w-[250px] h-36 rounded-2xl" />
          <Skeleton shape="rectangular" className="min-w-[250px] h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <EmptyState
        title="Нет привязанных питомцев"
        description="Добавьте питомца для оформления электронного ветпаспорта и вызова врача."
        action={
          <button
            type="button"
            onClick={onAddPet}
            className="px-3 py-1.5 rounded-xl bg-vet-blue-600 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить питомца</span>
          </button>
        }
      />
    );
  }

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-vet-teal-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-vet-slate-700">
            Питомцы под защитой
          </h3>
          <span className="text-[11px] font-bold text-vet-slate-400 font-mono">
            ({pets.length})
          </span>
        </div>

        <button
          type="button"
          onClick={onViewAllPassports}
          className="text-xs font-bold text-vet-blue-600 hover:text-vet-blue-700 flex items-center gap-0.5 transition-colors"
        >
          <span>Все ветпаспорта ({pets.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar scroll-smooth flex gap-3 pb-2 pt-0.5 px-0.5 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
      >
        {pets.map((pet) => {
          const age = formatAgeRu(pet.birthDateIso);
          const isCanine = pet.speciesCategory === 'canine';
          const rabies = pet.rabiesVaccinations[0];

          // Determine status badge
          let statusBadge = (
            <Badge variant="verified" size="sm" showDot>
              {rabies?.vaccineName.includes('Nobivac') ? 'Nobivac • Здоров' : 'Здоров'}
            </Badge>
          );

          if (pet.petName === 'Белла') {
            statusBadge = (
              <Badge variant="timer" size="sm">
                Осмотр через 7 дн
              </Badge>
            );
          } else if (pet.petName === 'Барсик') {
            statusBadge = (
              <Badge variant="verified" size="sm" showDot>
                Nobivac • Здоров
              </Badge>
            );
          }

          const weightKg = pet.weightKg;

          return (
            <div
              key={pet.id}
              onClick={() => onSelectPet?.(pet)}
              className="min-w-[255px] max-w-[270px] snap-start p-3.5 rounded-2xl bg-white border border-vet-slate-200/90 shadow-clinical hover:border-vet-blue-300 hover:shadow-clinical-md transition-all cursor-pointer shrink-0 space-y-2.5 active:scale-[0.99]"
            >
              {/* Pet Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${
                      isCanine
                        ? 'bg-gradient-to-br from-vet-blue-500 to-vet-blue-700 text-white'
                        : 'bg-gradient-to-br from-vet-teal-500 to-vet-teal-700 text-white'
                    }`}
                  >
                    {pet.petName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-vet-slate-900 leading-tight">
                      {pet.petName}
                    </h4>
                    <span className="text-[11px] text-vet-slate-500 font-medium block truncate max-w-[130px]">
                      {pet.breedNameRu}
                    </span>
                  </div>
                </div>

                {statusBadge}
              </div>

              {/* Pet Parameters Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1.5 rounded-lg bg-vet-slate-50 border border-vet-slate-100 flex items-center gap-1.5 text-vet-slate-600">
                  <Calendar className="w-3 h-3 text-vet-slate-400" />
                  <span className="font-semibold">{age}</span>
                </div>
                <div className="p-1.5 rounded-lg bg-vet-slate-50 border border-vet-slate-100 flex items-center gap-1.5 text-vet-slate-600">
                  <span className="text-vet-slate-400 font-bold text-[10px]">Вес</span>
                  <span className="font-semibold text-vet-slate-800">{weightKg} кг</span>
                </div>
              </div>

              {/* FGIS Horriot & Microchip Pill */}
              <div className="p-2 rounded-xl bg-vet-slate-50/80 border border-vet-slate-100/90 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-vet-slate-400 font-sans uppercase font-bold text-[9px]">
                    Хорриот
                  </span>
                  <span className="font-bold text-vet-blue-700">{pet.horriotId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-vet-slate-400 font-sans uppercase font-bold text-[9px]">
                    Чип ISO
                  </span>
                  <span className="text-vet-slate-700 font-medium">
                    {pet.microchip?.chipNumber ?? '643...'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
