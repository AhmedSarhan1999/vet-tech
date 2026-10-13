/**
 * VetTech OS — Pure Veterinary Domain Models
 * Strictly Governed by:
 * - Russian Federal Law No. 4979-1 "On Veterinary Medicine"
 * - FGIS "VetIS" (Subsystems: "Horriot" for Animal Identification, "Mercury" for VSD)
 * - Veterinary Sanitary Rules & Mandatory Rabies Quarantine Directives
 */

/**
 * Validated Veterinary Species Taxonomy
 */
export type VeterinarySpecies =
  | 'CANINE'     // Canis lupus familiaris (Собака)
  | 'FELINE'     // Felis catus (Кошка)
  | 'EQUINE'     // Equus caballus (Лошадь)
  | 'RODENT'     // Rodentia (Грызуны - дегу, шиншилла, хомяк, крыса)
  | 'LAGOMORPH' // Lagomorpha (Кролики декоративные)
  | 'AVIAN'      // Aves (Птицы - попугаи, канарейки)
  | 'REPTILIAN'  // Reptilia (Рептилии - змеи, ящерицы, черепахи)
  | 'FERRET'     // Mustela putorius furo (Хорек)
  | 'EXOTIC';    // Другие экзотические домашние животные

export type BiologicalSex =
  | 'MALE_INTACT'
  | 'MALE_CASTRATED'
  | 'FEMALE_INTACT'
  | 'FEMALE_STERILIZED';

/**
 * FGIS VetIS "Horriot" Mandatory Identification
 * Compliant with Order of the Ministry of Agriculture No. 832
 */
export interface VetISIdentification {
  readonly horriotId: string;                 // Example: "RU78-2026-A91823"
  readonly microchipNumber?: string;          // ISO 11784/11785 (15 digits)
  readonly tattooNumber?: string;             // Клеймо РКФ / СКОР
  readonly veterinaryPassportNumber: string;  // Международный ветпаспорт
  readonly registrationDateIso: string;
  readonly isHorriotSynced: boolean;
}

/**
 * Mandatory Rabies (Бешенство) Vaccination State
 * Under Law 4979-1, pets without verified active rabies vaccination
 * trigger quarantine protocols during house calls.
 */
export type RabiesImmunityStatus =
  | 'VERIFIED_ACTIVE'      // Действующая вакцинация (срок < 12 мес)
  | 'EXPIRING_CRITICAL'    // Истекает в течение 14 дней
  | 'EXPIRED_RESTRICTED'   // Просрочена (ограничение манипуляций)
  | 'UNVACCINATED_ALERT';  // Отсутствует (требуется экстренная вакцинация)

export interface VaccinationRecord {
  readonly id: string;
  readonly vaccineName: string;
  readonly seriesNumber: string;
  readonly administeredDateIso: string;
  readonly expirationDateIso: string;
  readonly veterinarianFullName: string;
  readonly veterinaryClinicLicense: string;
  readonly vetIsMercuryVsdUuid?: string;      // Ветеринарно-сопроводительный документ
  readonly isRabiesVaccine: boolean;
}

/**
 * Strict Veterinary Triage Urgency Level
 * Mobile Emergency House-Call & Telemed Protocol
 */
export type VeterinaryTriageLevel =
  | 'CODE_RED_CRITICAL'   // Острое угрожающее жизни состояние (ДТП, судороги, одышка, заворот желудка)
  | 'CODE_ORANGE_URGENT'  // Экстренная помощь до 30 минут (острая боль, непрекращающаяся рвота)
  | 'CODE_YELLOW_PRIORITY'// Приоритетный выезд до 2 часов (вялость, отказ от корма, травма лапы)
  | 'CODE_GREEN_ROUTINE'  // Плановый выезд / Вакцинация / Чипирование
  | 'CODE_BLUE_TELEMED';  // Первичная телемедицинская консультация / Второе мнение

/**
 * Saint Petersburg City Administrative Districts (Районы Санкт-Петербурга)
 */
export type SpbDistrict =
  | 'Адмиралтейский'
  | 'Василеостровский'
  | 'Выборгский'
  | 'Калининский'
  | 'Кировский'
  | 'Колпинский'
  | 'Красногвардейский'
  | 'Красносельский'
  | 'Кронштадтский'
  | 'Курортный'
  | 'Московский'
  | 'Невский'
  | 'Петроградский'
  | 'Петродворцовый'
  | 'Приморский'
  | 'Пушкинский'
  | 'Фрунзенский'
  | 'Центральный';

/**
 * Veterinary Physical Exam Vitals
 */
export interface VeterinaryVitals {
  readonly bodyWeightKg: number;
  readonly rectalTemperatureCelsius?: number; // 37.5 - 39.2 °C (типичная норма плотоядных)
  readonly heartRateBpm?: number;
  readonly respiratoryRatePerMin?: number;
  readonly capillaryRefillTimeSeconds?: number; // СНК (норма < 2 сек)
  readonly mucousMembraneColor?: 'PINK' | 'PALE' | 'CYANOTIC' | 'ICTERIC' | 'HYPEREMIC';
  readonly recordedAtIso: string;
}

/**
 * Pure Veterinary Patient Record
 */
export interface VeterinaryPatient {
  readonly id: string;
  readonly petName: string;
  readonly species: VeterinarySpecies;
  readonly breed: string;
  readonly birthDateIso: string;
  readonly sex: BiologicalSex;
  readonly weightKg: number;
  readonly ownerFullName: string;
  readonly ownerPhone: string;
  readonly residentialAddress: {
    readonly district: SpbDistrict;
    readonly street: string;
    readonly building: string;
    readonly apartment?: string;
    readonly intercomCode?: string;
    readonly lat?: number;
    readonly lng?: number;
  };
  readonly identification: VetISIdentification;
  readonly rabiesStatus: RabiesImmunityStatus;
  readonly latestVitals?: VeterinaryVitals;
  readonly isSterilized: boolean;
  readonly chronicConditions: readonly string[];
  readonly knownAllergies: readonly string[];
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
}

/**
 * Veterinary House-Call Service Request (Выезд ветеринарного врача на дом)
 */
export interface VeterinaryHouseCall {
  readonly id: string;
  readonly patientId: string;
  readonly triageLevel: VeterinaryTriageLevel;
  readonly chiefComplaint: string;
  readonly district: SpbDistrict;
  readonly estimatedArrivalMinutes?: number;
  readonly status: 'DISPATCH_PENDING' | 'DOCTOR_EN_ROUTE' | 'ON_SITE_EXAM' | 'COMPLETED' | 'CANCELLED';
  readonly assignedVeterinarian?: {
    readonly id: string;
    readonly fullName: string;
    readonly specialisation: string;
    readonly carModel?: string;
    readonly licenseNumber: string;
  };
  readonly requestedAtIso: string;
}
