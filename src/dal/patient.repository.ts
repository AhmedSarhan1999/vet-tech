import { InMemoryRepositoryBase } from './in-memory-repository.base';
import {
  VeterinaryPatient,
  VeterinarySpecies,
  SpbDistrict,
  RabiesImmunityStatus,
} from '@/shared/types/veterinary';

export interface PatientFilter {
  readonly species?: VeterinarySpecies;
  readonly district?: SpbDistrict;
  readonly rabiesStatus?: RabiesImmunityStatus;
  readonly searchQuery?: string;
}

/**
 * InMemoryPatientRepository
 * Decoupled repository for veterinary patient records.
 * Can be replaced by FirebasePatientRepository or PostgresPatientRepository without altering UI/domain code.
 */
export class InMemoryPatientRepository extends InMemoryRepositoryBase<
  VeterinaryPatient,
  PatientFilter
> {
  protected filterItem(patient: VeterinaryPatient, filter: PatientFilter): boolean {
    if (filter.species && patient.species !== filter.species) {
      return false;
    }
    if (filter.district && patient.residentialAddress.district !== filter.district) {
      return false;
    }
    if (filter.rabiesStatus && patient.rabiesStatus !== filter.rabiesStatus) {
      return false;
    }
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      const matchName = patient.petName.toLowerCase().includes(q);
      const matchBreed = patient.breed.toLowerCase().includes(q);
      const matchChip = patient.identification.microchipNumber?.toLowerCase().includes(q) ?? false;
      const matchHorriot = patient.identification.horriotId.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchChip && !matchHorriot) {
        return false;
      }
    }
    return true;
  }
}
