/**
 * VetTech OS — Breed Registry Authority Models
 * Governed by:
 * - Russian Kynological Federation (РКФ / RKF) Standards for Canines
 * - World Cat Federation (WCF / FIFe) Standards for Felines
 */

import { SpeciesCategory, AnimalSizeCategory } from './species';

export type BreedRegistryAuthority =
  | 'RKF'          // Российская Кинологическая Федерация (РКФ / FCI)
  | 'WCF'          // World Cat Federation (Всемирная федерация кошек)
  | 'FIFE'         // Fédération Internationale Féline
  | 'TICA'         // The International Cat Association
  | 'INDEPENDENT'  // Национальные реестры / Экзотические клубы
  | 'NON_PEDIGREE';// Метис / Беспородный (Метис)

export interface GeneticPredisposition {
  readonly conditionName: string;
  readonly severity: 'MONITOR' | 'HIGH_RISK' | 'CRITICAL';
  readonly clinicalNote: string;
}

export interface WeightRangeKg {
  readonly min: number;
  readonly max: number;
}

export interface BreedDefinition {
  readonly id: string;
  readonly speciesCategory: SpeciesCategory;
  readonly russianName: string;
  readonly internationalName: string;
  readonly registryAuthority: BreedRegistryAuthority;
  readonly registryCode?: string;       // Код породы РКФ или WCF (e.g., "166" для немецкой овчарки, "MCO" для мейн-куна)
  readonly sizeCategory: AnimalSizeCategory;
  readonly averageWeightKg: WeightRangeKg;
  readonly geneticPredispositions: readonly GeneticPredisposition[];
  readonly isBrachycephalic?: boolean;   // Брахицефалический синдром (мопсы, бульдоги, персы)
  readonly isHypoallergenic?: boolean;
  readonly isCrossBreed?: boolean;       // Метис
}
