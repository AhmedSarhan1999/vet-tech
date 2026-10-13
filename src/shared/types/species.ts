/**
 * VetTech OS — Pure Veterinary Taxonomy: Species Definitions
 * Governed by Russian Federal Law No. 4979-1 "On Veterinary Medicine"
 */

export type SpeciesCategory =
  | 'canine'     // Canis lupus familiaris (Собака)
  | 'feline'     // Felis catus (Кошка)
  | 'rodent'     // Rodentia (Грызуны: дегу, шиншилла, морская свинка, крыса)
  | 'lagomorph' // Lagomorpha (Кроликообразные: декоративные кролики)
  | 'avian'      // Aves (Птицы: попугаи, канарейки)
  | 'reptilian'  // Reptilia (Рептилии: змеи, эублефары, черепахи)
  | 'ferret'     // Mustela putorius furo (Хорек домашний)
  | 'exotic';    // Иные экзотические животные

export type AnimalSizeCategory = 'toy' | 'small' | 'medium' | 'large' | 'giant';

export interface PhysiologicalRange {
  readonly min: number;
  readonly max: number;
  readonly criticalLow?: number;
  readonly criticalHigh?: number;
  readonly unit: string;
}

export interface PhysiologicalNorms {
  readonly rectalTemperatureCelsius: PhysiologicalRange; // Норма ректальной температуры (°C)
  readonly heartRateBpm: PhysiologicalRange;             // Частота сердечных сокращений (уд/мин)
  readonly respiratoryRatePerMin: PhysiologicalRange;    // Частота дыхательных движений (дых/мин)
  readonly capillaryRefillTimeSeconds: PhysiologicalRange; // Скорость наполнения капилляров (СНК, с)
}

export interface SpeciesDefinition {
  readonly id: string;
  readonly category: SpeciesCategory;
  readonly russianName: string;
  readonly latinName: string;
  readonly commonBreedsCount?: number;
  readonly defaultSizeCategory: AnimalSizeCategory;
  readonly physiologicalNorms: PhysiologicalNorms;
  readonly isExotic: boolean;
  readonly requiresSpecialistLicense: boolean;
}
