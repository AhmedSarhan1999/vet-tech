import { z } from 'zod';
import { SpbDistrict } from '@/shared/types/veterinary';

/**
 * Regular Expression for FGIS "VetIS" Subsystem "Horriot" National Identification Code
 * Format: RU<2-digit region>-<7-digit serial>-<4-digit suffix>
 * Example: "RU78-1029384-0012"
 */
export const HORRIOT_ID_REGEX = /^RU([0-9]{2})-([0-9]{7})-([0-9]{4})$/;

/**
 * Regular Expression for ISO 11784 / ISO 11785 15-digit Microchip
 * Exact 15 numeric digits.
 * Country code prefix 643 is Russia (РФ).
 */
export const ISO_MICROCHIP_REGEX = /^[0-9]{15}$/;

/**
 * Zod Schema for FGIS "VetIS" Subsystem "Horriot" Identifier
 */
export const horriotIdSchema = z
  .string()
  .trim()
  .regex(
    HORRIOT_ID_REGEX,
    'Неверный формат Хорриот ID. Ожидается: RUXX-XXXXXXX-XXXX (например, RU78-1029384-0012)'
  )
  .refine(
    (val) => {
      // Validate that region prefix is valid (01-99)
      const match = val.match(HORRIOT_ID_REGEX);
      if (!match || !match[1]) return false;
      const regionCode = parseInt(match[1], 10);
      return regionCode >= 1 && regionCode <= 99;
    },
    { message: 'Недопустимый код субъекта РФ в номере Хорриот (должен быть от 01 до 99).' }
  );

/**
 * Zod Schema for ISO 11784/11785 Microchip
 */
export const isoMicrochipSchema = z
  .string()
  .trim()
  .regex(
    ISO_MICROCHIP_REGEX,
    'Микрочип должен содержать ровно 15 арабских цифр по стандарту ISO 11784/11785.'
  )
  .refine(
    (val) => {
      // Basic manufacturer check: first 3 digits cannot be '000'
      const prefix = val.substring(0, 3);
      return prefix !== '000';
    },
    { message: 'Префикс страны/производителя микрочипа не может быть 000.' }
  );

/**
 * Zod Schema for Saint Petersburg District
 */
export const spbDistrictSchema = z.enum([
  'Адмиралтейский',
  'Василеостровский',
  'Выборгский',
  'Калининский',
  'Кировский',
  'Колпинский',
  'Красногвардейский',
  'Красносельский',
  'Кронштадтский',
  'Курортный',
  'Московский',
  'Невский',
  'Петроградский',
  'Петродворцовый',
  'Приморский',
  'Пушкинский',
  'Фрунзенский',
  'Центральный',
] as const satisfies readonly SpbDistrict[]);

/**
 * Validation function for Rabies vaccination biosecurity status
 * Under Law 4979-1 Art. 2.1
 */
export function validateRabiesVaccinationStatus(administeredDateIso: string, now: Date = new Date()): {
  readonly isValid: boolean;
  readonly daysRemaining: number;
  readonly status: 'VERIFIED_ACTIVE' | 'EXPIRING_CRITICAL' | 'EXPIRED_RESTRICTED' | 'INVALID_DATE';
  readonly messageRu: string;
} {
  const adminDate = new Date(administeredDateIso);
  if (isNaN(adminDate.getTime())) {
    return {
      isValid: false,
      daysRemaining: 0,
      status: 'INVALID_DATE',
      messageRu: 'Некорректная дата вакцинации против бешенства.',
    };
  }

  // Rabies validity is 365 days from administration
  const expiryDate = new Date(adminDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const diffMs = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      isValid: false,
      daysRemaining,
      status: 'EXPIRED_RESTRICTED',
      messageRu: `Вакцинация против бешенства просрочена на ${Math.abs(daysRemaining)} дн. Наложены карантинные ограничения по ст. 2.1 Закона 4979-1.`,
    };
  }

  if (daysRemaining <= 14) {
    return {
      isValid: true,
      daysRemaining,
      status: 'EXPIRING_CRITICAL',
      messageRu: `Внимание: Вакцинация истекает через ${daysRemaining} дн. Требуется ревакцинация.`,
    };
  }

  return {
    isValid: true,
    daysRemaining,
    status: 'VERIFIED_ACTIVE',
    messageRu: `Иммунитет активен (${daysRemaining} дн. до очередной ревакцинации). Соответствует требованиям ВетИС.`,
  };
}
