import { InMemoryRepositoryBase } from './in-memory-repository.base';
import { Result } from '@/shared/types/dal';
import { SpeciesDefinition, SpeciesCategory } from '@/shared/types/species';
import { BreedDefinition, BreedRegistryAuthority } from '@/shared/types/breeds';
import { SPECIES_REGISTRY } from '@/domain/taxonomy/species.data';
import { BREEDS_REGISTRY } from '@/domain/taxonomy/breeds.data';

export interface BreedFilter {
  readonly speciesCategory?: SpeciesCategory;
  readonly searchQuery?: string;
  readonly registryAuthority?: BreedRegistryAuthority;
  readonly isBrachycephalic?: boolean;
  readonly isHypoallergenic?: boolean;
}

export class SpeciesRepository extends InMemoryRepositoryBase<SpeciesDefinition> {
  private breeds: Map<string, BreedDefinition> = new Map();

  constructor(
    initialSpecies: readonly SpeciesDefinition[] = SPECIES_REGISTRY,
    initialBreeds: readonly BreedDefinition[] = BREEDS_REGISTRY
  ) {
    super(initialSpecies);
    initialBreeds.forEach((breed) => this.breeds.set(breed.id, breed));
  }

  protected filterItem(item: SpeciesDefinition, filter: { category?: SpeciesCategory; isExotic?: boolean }): boolean {
    if (filter.category && item.category !== filter.category) return false;
    if (filter.isExotic !== undefined && item.isExotic !== filter.isExotic) return false;
    return true;
  }

  async getSpeciesByCategory(category: SpeciesCategory): Promise<Result<SpeciesDefinition | null>> {
    for (const species of this.items.values()) {
      if (species.category === category) {
        return Result.ok(species);
      }
    }
    return Result.ok(null);
  }

  async getBreedsBySpecies(category: SpeciesCategory): Promise<Result<readonly BreedDefinition[]>> {
    const list = Array.from(this.breeds.values()).filter(
      (b) => b.speciesCategory === category
    );
    return Result.ok(list);
  }

  async findBreeds(filter: BreedFilter): Promise<Result<readonly BreedDefinition[]>> {
    let result = Array.from(this.breeds.values());

    if (filter.speciesCategory) {
      result = result.filter((b) => b.speciesCategory === filter.speciesCategory);
    }

    if (filter.registryAuthority) {
      result = result.filter((b) => b.registryAuthority === filter.registryAuthority);
    }

    if (filter.isBrachycephalic !== undefined) {
      result = result.filter((b) => !!b.isBrachycephalic === filter.isBrachycephalic);
    }

    if (filter.isHypoallergenic !== undefined) {
      result = result.filter((b) => !!b.isHypoallergenic === filter.isHypoallergenic);
    }

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.russianName.toLowerCase().includes(q) ||
          b.internationalName.toLowerCase().includes(q) ||
          (b.registryCode && b.registryCode.toLowerCase().includes(q))
      );
    }

    return Result.ok(result);
  }

  async getBreedById(breedId: string): Promise<Result<BreedDefinition | null>> {
    const breed = this.breeds.get(breedId);
    return Result.ok(breed ?? null);
  }
}
