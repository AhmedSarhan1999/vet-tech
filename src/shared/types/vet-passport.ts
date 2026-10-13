/**
 * VetTech OS — Electronic Veterinary Passport (Электронный ветеринарный паспорт)
 * Compliant with:
 * - Russian Federal Law No. 4979-1 "On Veterinary Medicine"
 * - FGIS "VetIS" Subsystem "Horriot" (Animal Identification & Registration)
 * - Order of the Ministry of Agriculture No. 832
 */

import { SpeciesCategory } from './species';
import { BiologicalSex, VaccinationRecord, VeterinaryVitals } from './veterinary';

export type PassportStatus =
  | 'ACTIVE'
  | 'QUARANTINED'
  | 'RESTRICTED_MOVEMENT'
  | 'ARCHIVED'
  | 'PENDING_VETIS_SYNC';

export interface MicrochipDetails {
  readonly chipNumber: string;                 // ISO 11784/11785 (15 digits)
  readonly manufacturerOrCountryCode: string; // e.g. "643" (Russia)
  readonly implantationDateIso: string;
  readonly anatomicalLocation: string;        // e.g. "Левая сторона шеи / Холка"
  readonly isVerified: boolean;
}

export interface AntiParasiteTreatment {
  readonly id: string;
  readonly drugName: string;                  // Препарат (e.g. "Мильбемакс", "Бравекто")
  readonly activeSubstances: string;
  readonly administeredDateIso: string;
  readonly validUntilIso: string;
  readonly treatmentType: 'ENDOPARASITE' | 'ECTOPARASITE' | 'BROAD_SPECTRUM';
  readonly veterinarianName?: string;
}

export interface QuarantineProtocol {
  readonly isQuarantined: boolean;
  readonly reason?: 'RABIES_SUSPICION' | 'UNVACCINATED_BITE_EXPOSURE' | 'EPIDEMIC_ZONE' | 'POST_IMPORT';
  readonly startedAtIso?: string;
  readonly expiresAtIso?: string;
  readonly supervisingVeterinaryOfficer?: string;
  readonly isolationAddress?: string;
  readonly restrictiveOrderNumber?: string;
}

export interface DigitalVetPassport {
  readonly id: string;
  readonly passportSeriesNumber: string;     // Серия и номер бланка паспорта
  readonly horriotId: string;                 // Код ФГИС «ВетИС» Хорриот (RU78-1234567-0001)
  readonly petName: string;
  readonly speciesCategory: SpeciesCategory;
  readonly breedId: string;
  readonly breedNameRu: string;
  readonly sex: BiologicalSex;
  readonly birthDateIso: string;
  readonly weightKg: number;
  readonly colorAndMarkingsRu: string;
  readonly isSterilized: boolean;
  readonly microchip?: MicrochipDetails;
  readonly tattooRkfNumber?: string;         // Клеймо РКФ
  readonly latestVitals?: VeterinaryVitals;
  readonly ownerId: string;
  readonly ownerFullName: string;
  readonly ownerPhone: string;
  readonly ownerEmail?: string;
  readonly residentialAddress: {
    readonly city: string;                   // Санкт-Петербург
    readonly district: string;               // Административный район СПб
    readonly streetAddress: string;
  };
  readonly status: PassportStatus;
  readonly rabiesVaccinations: readonly VaccinationRecord[];
  readonly comprehensiveVaccinations: readonly VaccinationRecord[];
  readonly antiParasiteTreatments: readonly AntiParasiteTreatment[];
  readonly quarantine: QuarantineProtocol;
  readonly issuedAtIso: string;
  readonly issuingClinicName: string;
  readonly issuingClinicVetIsId: string;
  readonly updatedAtIso: string;
}
