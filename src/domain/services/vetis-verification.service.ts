import { horriotIdSchema, isoMicrochipSchema, HORRIOT_ID_REGEX } from '@/domain/validation/vetis.validator';

export interface HorriotVerificationResult {
  readonly isValid: boolean;
  readonly horriotId: string;
  readonly regionCode?: string;
  readonly regionName?: string;
  readonly error?: string;
}

export interface MicrochipVerificationResult {
  readonly isValid: boolean;
  readonly chipNumber: string;
  readonly countryCode?: string;
  readonly countryName?: string;
  readonly isRussianFederationStandard: boolean;
  readonly error?: string;
}

const REGION_MAP_RU: Record<string, string> = {
  '78': 'г. Санкт-Петербург',
  '47': 'Ленинградская область',
  '77': 'г. Москва',
  '50': 'Московская область',
  '23': 'Краснодарский край',
  '54': 'Новосибирская область',
  '66': 'Свердловская область',
  '16': 'Республика Татарстан',
};

const COUNTRY_CHIP_MAP: Record<string, string> = {
  '643': 'Российская Федерация (РФ)',
  '112': 'Республика Беларусь',
  '398': 'Республика Казахстан',
  '804': 'Украина',
  '900': 'Международный чип (Trovan / общий пул)',
  '981': 'Datamars / Индивидуальный производитель',
  '985': 'Destron Fearing',
};

export class VetISVerificationService {
  /**
   * Verifies Russian National Veterinary Identification Code (Horriot)
   */
  public verifyHorriotId(rawInput: string): HorriotVerificationResult {
    const trimmed = rawInput.trim();
    const parseResult = horriotIdSchema.safeParse(trimmed);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return {
        isValid: false,
        horriotId: trimmed,
        error: issue ? issue.message : 'Недействительный формат Хорриот ID',
      };
    }

    const match = trimmed.match(HORRIOT_ID_REGEX);
    const regionCode = match?.[1] ?? '78';
    const regionName = REGION_MAP_RU[regionCode] ?? `Субъект РФ № ${regionCode}`;

    return {
      isValid: true,
      horriotId: trimmed,
      regionCode,
      regionName,
    };
  }

  /**
   * Verifies ISO 11784/11785 15-digit Microchip
   */
  public verifyMicrochip(rawInput: string): MicrochipVerificationResult {
    const trimmed = rawInput.trim();
    const parseResult = isoMicrochipSchema.safeParse(trimmed);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return {
        isValid: false,
        chipNumber: trimmed,
        isRussianFederationStandard: false,
        error: issue ? issue.message : 'Недействительный номер микрочипа',
      };
    }

    const prefix = trimmed.substring(0, 3);
    const countryName = COUNTRY_CHIP_MAP[prefix] ?? `Эмитент кода ${prefix}`;
    const isRussianFederationStandard = prefix === '643';

    return {
      isValid: true,
      chipNumber: trimmed,
      countryCode: prefix,
      countryName,
      isRussianFederationStandard,
    };
  }
}

export const vetIsVerificationService = new VetISVerificationService();
