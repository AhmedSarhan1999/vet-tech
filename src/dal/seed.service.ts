import { SpeciesRepository } from './species.repository';
import { PetPassportRepository } from './pet-passport.repository';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import { SPECIES_REGISTRY } from '@/domain/taxonomy/species.data';
import { BREEDS_REGISTRY } from '@/domain/taxonomy/breeds.data';

export class SeedService {
  /**
   * Deterministically populates repositories with verified Russian veterinary registries
   */
  public static async seedAll(
    speciesRepo: SpeciesRepository,
    passportRepo: PetPassportRepository
  ): Promise<{
    readonly speciesCount: number;
    readonly breedsCount: number;
    readonly passportsCount: number;
  }> {
    // 1. Ensure species & breeds exist
    for (const species of SPECIES_REGISTRY) {
      await speciesRepo.create(species);
    }

    // 2. Sample realistic digital passports in Saint Petersburg
    const samplePassports: readonly DigitalVetPassport[] = [
      {
        id: 'pass-spb-78-001',
        passportSeriesNumber: '78-ВЕТ-2024/0912',
        horriotId: 'RU78-1029384-0012',
        petName: 'Норд',
        speciesCategory: 'canine',
        breedId: 'br-can-husky',
        breedNameRu: 'Сибирский хаски',
        sex: 'MALE_CASTRATED',
        birthDateIso: '2021-04-12T00:00:00.000Z',
        weightKg: 24.5,
        colorAndMarkingsRu: 'Серо-белый, глаза голубые',
        isSterilized: true,
        latestVitals: {
          bodyWeightKg: 24.5,
          rectalTemperatureCelsius: 38.6,
          heartRateBpm: 105,
          respiratoryRatePerMin: 22,
          capillaryRefillTimeSeconds: 1.5,
          mucousMembraneColor: 'PINK',
          recordedAtIso: new Date().toISOString(),
        },
        microchip: {
          chipNumber: '643098100234567',
          manufacturerOrCountryCode: '643',
          implantationDateIso: '2021-06-15T10:00:00.000Z',
          anatomicalLocation: 'Левая сторона шеи',
          isVerified: true,
        },
        tattooRkfNumber: 'SPB-8912',
        ownerId: 'usr-spb-01',
        ownerFullName: 'Смирнова Елена Васильевна',
        ownerPhone: '+7 (921) 987-65-43',
        ownerEmail: 'e.smirnova@mail.spb.ru',
        residentialAddress: {
          city: 'Санкт-Петербург',
          district: 'Центральный',
          streetAddress: 'Невский проспект, 104, кв. 18',
        },
        status: 'ACTIVE',
        rabiesVaccinations: [
          {
            id: 'vac-rab-01',
            vaccineName: 'Рабикан (ФГБУ «ВНИИЗЖ»)',
            seriesNumber: 'РБ-24-08',
            administeredDateIso: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
            expirationDateIso: new Date(Date.now() + 245 * 24 * 3600 * 1000).toISOString(),
            veterinarianFullName: 'Ковалев А. С.',
            veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00412',
            vetIsMercuryVsdUuid: '78a9c011-82ff-4b89-8d12-192837465012',
            isRabiesVaccine: true,
          },
        ],
        comprehensiveVaccinations: [
          {
            id: 'vac-comp-01',
            vaccineName: 'Мультикан-8',
            seriesNumber: 'МК-24-11',
            administeredDateIso: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
            expirationDateIso: new Date(Date.now() + 245 * 24 * 3600 * 1000).toISOString(),
            veterinarianFullName: 'Ковалев А. С.',
            veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00412',
            isRabiesVaccine: false,
          },
        ],
        antiParasiteTreatments: [
          {
            id: 'ant-par-01',
            drugName: 'Мильбемакс',
            activeSubstances: 'Мильбемицина оксим, празиквантел',
            administeredDateIso: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
            validUntilIso: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
            treatmentType: 'ENDOPARASITE',
          },
        ],
        quarantine: {
          isQuarantined: false,
        },
        issuedAtIso: '2021-06-15T11:00:00.000Z',
        issuingClinicName: 'СПб ГБУ «Городская ветеринарная станция»',
        issuingClinicVetIsId: 'RU78-CLINIC-0001',
        updatedAtIso: new Date().toISOString(),
      },
      {
        id: 'pass-spb-78-002',
        passportSeriesNumber: '78-ВЕТ-2023/1824',
        horriotId: 'RU78-2049182-0045',
        petName: 'Барсик',
        speciesCategory: 'feline',
        breedId: 'br-fel-british',
        breedNameRu: 'Британская короткошерстная',
        sex: 'MALE_CASTRATED',
        birthDateIso: '2022-08-20T00:00:00.000Z',
        weightKg: 4.8,
        colorAndMarkingsRu: 'Голубой сплошной (Blue)',
        isSterilized: true,
        latestVitals: {
          bodyWeightKg: 4.8,
          rectalTemperatureCelsius: 38.8,
          heartRateBpm: 145,
          respiratoryRatePerMin: 28,
          capillaryRefillTimeSeconds: 1.0,
          mucousMembraneColor: 'PINK',
          recordedAtIso: new Date().toISOString(),
        },
        microchip: {
          chipNumber: '643098100345678',
          manufacturerOrCountryCode: '643',
          implantationDateIso: '2022-10-10T14:00:00.000Z',
          anatomicalLocation: 'Холка',
          isVerified: true,
        },
        ownerId: 'usr-spb-01',
        ownerFullName: 'Смирнова Елена Васильевна',
        ownerPhone: '+7 (921) 987-65-43',
        residentialAddress: {
          city: 'Санкт-Петербург',
          district: 'Петроградский',
          streetAddress: 'Каменноостровский проспект, 26, кв. 4',
        },
        status: 'ACTIVE',
        rabiesVaccinations: [
          {
            id: 'vac-rab-02',
            vaccineName: 'Nobivac Rabies',
            seriesNumber: 'NR-24-03',
            administeredDateIso: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
            expirationDateIso: new Date(Date.now() + 275 * 24 * 3600 * 1000).toISOString(),
            veterinarianFullName: 'Соколова Д. В.',
            veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00289',
            isRabiesVaccine: true,
          },
        ],
        comprehensiveVaccinations: [
          {
            id: 'vac-comp-02',
            vaccineName: 'Nobivac Tricat Trio',
            seriesNumber: 'NT-24-19',
            administeredDateIso: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
            expirationDateIso: new Date(Date.now() + 275 * 24 * 3600 * 1000).toISOString(),
            veterinarianFullName: 'Соколова Д. В.',
            veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00289',
            isRabiesVaccine: false,
          },
        ],
        antiParasiteTreatments: [],
        quarantine: {
          isQuarantined: false,
        },
        issuedAtIso: '2022-10-10T15:00:00.000Z',
        issuingClinicName: 'Ветеринарный центр «Северная Венеция»',
        issuingClinicVetIsId: 'RU78-CLINIC-0042',
        updatedAtIso: new Date().toISOString(),
      },
      {
        id: 'pass-spb-78-003',
        passportSeriesNumber: '78-ВЕТ-2025/3091',
        horriotId: 'RU78-3019283-0089',
        petName: 'Белла',
        speciesCategory: 'canine',
        breedId: 'br-can-frenchie',
        breedNameRu: 'Французский бульдог',
        sex: 'FEMALE_INTACT',
        birthDateIso: '2023-02-14T00:00:00.000Z',
        weightKg: 11.2,
        colorAndMarkingsRu: 'Палевый с черной маской',
        isSterilized: false,
        latestVitals: {
          bodyWeightKg: 11.2,
          rectalTemperatureCelsius: 38.9,
          heartRateBpm: 120,
          respiratoryRatePerMin: 26,
          capillaryRefillTimeSeconds: 1.5,
          mucousMembraneColor: 'PINK',
          recordedAtIso: new Date().toISOString(),
        },
        microchip: {
          chipNumber: '643098100456789',
          manufacturerOrCountryCode: '643',
          implantationDateIso: '2023-04-01T09:00:00.000Z',
          anatomicalLocation: 'Левая сторона шеи',
          isVerified: true,
        },
        ownerId: 'usr-spb-01',
        ownerFullName: 'Смирнова Елена Васильевна',
        ownerPhone: '+7 (921) 987-65-43',
        residentialAddress: {
          city: 'Санкт-Петербург',
          district: 'Петроградский',
          streetAddress: 'Большой проспект П.С., 14, кв. 12',
        },
        status: 'ACTIVE',
        rabiesVaccinations: [
          {
            id: 'vac-rab-03',
            vaccineName: 'Nobivac RL',
            seriesNumber: 'РБ-23-99',
            // Administered 358 days ago: only 7 days remaining!
            administeredDateIso: new Date(Date.now() - 358 * 24 * 3600 * 1000).toISOString(),
            expirationDateIso: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
            veterinarianFullName: 'Макаров П. Н.',
            veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00199',
            isRabiesVaccine: true,
          },
        ],
        comprehensiveVaccinations: [],
        antiParasiteTreatments: [],
        quarantine: {
          isQuarantined: false,
        },
        issuedAtIso: '2023-04-01T10:00:00.000Z',
        issuingClinicName: 'Приморская ветеринарная лечебница',
        issuingClinicVetIsId: 'RU78-CLINIC-0019',
        updatedAtIso: new Date().toISOString(),
      },
    ];

    for (const passport of samplePassports) {
      await passportRepo.create(passport);
    }

    return {
      speciesCount: SPECIES_REGISTRY.length,
      breedsCount: BREEDS_REGISTRY.length,
      passportsCount: samplePassports.length,
    };
  }
}
