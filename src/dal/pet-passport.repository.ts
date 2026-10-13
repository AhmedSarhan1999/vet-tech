import { InMemoryRepositoryBase } from './in-memory-repository.base';
import { Result } from '@/shared/types/dal';
import { DigitalVetPassport, PassportStatus } from '@/shared/types/vet-passport';
import { SpeciesCategory } from '@/shared/types/species';

export interface PassportFilter {
  readonly ownerId?: string;
  readonly microchipNumber?: string;
  readonly horriotId?: string;
  readonly district?: string;
  readonly status?: PassportStatus;
  readonly speciesCategory?: SpeciesCategory;
  readonly searchQuery?: string;
}

export class PetPassportRepository extends InMemoryRepositoryBase<DigitalVetPassport, PassportFilter> {
  protected filterItem(passport: DigitalVetPassport, filter: PassportFilter): boolean {
    if (filter.ownerId && passport.ownerId !== filter.ownerId) {
      return false;
    }
    if (filter.status && passport.status !== filter.status) {
      return false;
    }
    if (filter.speciesCategory && passport.speciesCategory !== filter.speciesCategory) {
      return false;
    }
    if (filter.district && passport.residentialAddress.district !== filter.district) {
      return false;
    }
    if (filter.microchipNumber && passport.microchip?.chipNumber !== filter.microchipNumber) {
      return false;
    }
    if (filter.horriotId && passport.horriotId.toLowerCase() !== filter.horriotId.toLowerCase()) {
      return false;
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchName = passport.petName.toLowerCase().includes(q);
      const matchBreed = passport.breedNameRu.toLowerCase().includes(q);
      const matchOwner = passport.ownerFullName.toLowerCase().includes(q);
      const matchChip = passport.microchip?.chipNumber.includes(q) ?? false;
      const matchHorriot = passport.horriotId.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchOwner && !matchChip && !matchHorriot) {
        return false;
      }
    }
    return true;
  }

  async findByHorriotId(horriotId: string): Promise<Result<DigitalVetPassport | null>> {
    const q = horriotId.trim().toLowerCase();
    for (const item of this.items.values()) {
      if (item.horriotId.toLowerCase() === q) {
        return Result.ok(item);
      }
    }
    return Result.ok(null);
  }

  async findByMicrochip(chipNumber: string): Promise<Result<DigitalVetPassport | null>> {
    const q = chipNumber.trim();
    for (const item of this.items.values()) {
      if (item.microchip?.chipNumber === q) {
        return Result.ok(item);
      }
    }
    return Result.ok(null);
  }

  async findByOwnerId(ownerId: string): Promise<Result<readonly DigitalVetPassport[]>> {
    const matches = Array.from(this.items.values()).filter((item) => item.ownerId === ownerId);
    return Result.ok(matches);
  }
}
