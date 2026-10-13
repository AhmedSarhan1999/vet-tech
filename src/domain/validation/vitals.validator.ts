import { SpeciesCategory } from '@/shared/types/species';
import { SPECIES_REGISTRY } from '@/domain/taxonomy/species.data';

export type VitalStatus =
  | 'NORMAL'
  | 'WARNING_LOW'
  | 'WARNING_HIGH'
  | 'CRITICAL_LOW'
  | 'CRITICAL_HIGH';

export interface VitalCheckResult {
  readonly status: VitalStatus;
  readonly value: number;
  readonly normMin: number;
  readonly normMax: number;
  readonly unit: string;
  readonly messageRu: string;
  readonly isCritical: boolean;
}

export interface VitalsValidationReport {
  readonly species: SpeciesCategory;
  readonly isOverallNormal: boolean;
  readonly hasCriticalAnomaly: boolean;
  readonly suggestedTriageLevel?: 'CODE_RED_CRITICAL' | 'CODE_ORANGE_URGENT' | 'CODE_YELLOW_PRIORITY' | 'CODE_GREEN_ROUTINE';
  readonly temperature?: VitalCheckResult;
  readonly heartRate?: VitalCheckResult;
  readonly respirationRate?: VitalCheckResult;
  readonly capillaryRefillTime?: VitalCheckResult;
}

/**
 * Validates clinical vitals against species-specific physiological ranges
 */
export function validateVeterinaryVitals(
  species: SpeciesCategory,
  vitals: {
    readonly rectalTemperatureCelsius?: number;
    readonly heartRateBpm?: number;
    readonly respiratoryRatePerMin?: number;
    readonly capillaryRefillTimeSeconds?: number;
  }
): VitalsValidationReport {
  const fallbackDef = SPECIES_REGISTRY[0]!;
  const speciesDef = SPECIES_REGISTRY.find((s) => s.category === species) ?? fallbackDef;
  const norms = speciesDef.physiologicalNorms;

  let hasCritical = false;
  let hasWarning = false;

  // 1. Rectal Temperature Check
  let tempResult: VitalCheckResult | undefined;
  if (vitals.rectalTemperatureCelsius !== undefined) {
    const val = vitals.rectalTemperatureCelsius;
    const range = norms.rectalTemperatureCelsius;
    const critLow = range.criticalLow ?? range.min - 1.0;
    const critHigh = range.criticalHigh ?? range.max + 1.0;

    let status: VitalStatus = 'NORMAL';
    let msg = `В пределах физиологической нормы (${range.min} - ${range.max} °C)`;

    if (val < critLow) {
      status = 'CRITICAL_LOW';
      msg = `Острая гипотермия (${val} °C). Риск сосудистого коллапса!`;
      hasCritical = true;
    } else if (val < range.min) {
      status = 'WARNING_LOW';
      msg = `Умеренная гипотермия (${val} °C)`;
      hasWarning = true;
    } else if (val > critHigh) {
      status = 'CRITICAL_HIGH';
      msg = `Острая гипертермия / тепловой удар (${val} °C). Риск отека мозга!`;
      hasCritical = true;
    } else if (val > range.max) {
      status = 'WARNING_HIGH';
      msg = `Лихорадка / гипертермия (${val} °C)`;
      hasWarning = true;
    }

    tempResult = {
      status,
      value: val,
      normMin: range.min,
      normMax: range.max,
      unit: '°C',
      messageRu: msg,
      isCritical: status === 'CRITICAL_LOW' || status === 'CRITICAL_HIGH',
    };
  }

  // 2. Heart Rate Check
  let hrResult: VitalCheckResult | undefined;
  if (vitals.heartRateBpm !== undefined) {
    const val = vitals.heartRateBpm;
    const range = norms.heartRateBpm;
    const critLow = range.criticalLow ?? range.min - 20;
    const critHigh = range.criticalHigh ?? range.max + 40;

    let status: VitalStatus = 'NORMAL';
    let msg = `Нормокардия (${range.min} - ${range.max} уд/мин)`;

    if (val < critLow) {
      status = 'CRITICAL_LOW';
      msg = `Тяжелая брадикардия (${val} уд/мин). Угроза остановки сердца!`;
      hasCritical = true;
    } else if (val < range.min) {
      status = 'WARNING_LOW';
      msg = `Брадикардия (${val} уд/мин)`;
      hasWarning = true;
    } else if (val > critHigh) {
      status = 'CRITICAL_HIGH';
      msg = `Пароксизмальная тахикардия (${val} уд/мин).`;
      hasCritical = true;
    } else if (val > range.max) {
      status = 'WARNING_HIGH';
      msg = `Тахикардия (${val} уд/мин)`;
      hasWarning = true;
    }

    hrResult = {
      status,
      value: val,
      normMin: range.min,
      normMax: range.max,
      unit: 'уд/мин',
      messageRu: msg,
      isCritical: status === 'CRITICAL_LOW' || status === 'CRITICAL_HIGH',
    };
  }

  // 3. Respiration Rate Check
  let rrResult: VitalCheckResult | undefined;
  if (vitals.respiratoryRatePerMin !== undefined) {
    const val = vitals.respiratoryRatePerMin;
    const range = norms.respiratoryRatePerMin;
    const critLow = range.criticalLow ?? range.min - 5;
    const critHigh = range.criticalHigh ?? range.max + 30;

    let status: VitalStatus = 'NORMAL';
    let msg = `Эупноэ (${range.min} - ${range.max} дых/мин)`;

    if (val < critLow) {
      status = 'CRITICAL_LOW';
      msg = `Тяжелое угнетение дыхания (${val} дых/мин)!`;
      hasCritical = true;
    } else if (val < range.min) {
      status = 'WARNING_LOW';
      msg = `Брадипноэ (${val} дых/мин)`;
      hasWarning = true;
    } else if (val > critHigh) {
      status = 'CRITICAL_HIGH';
      msg = `Острая дыхательная недостаточность / тахипноэ (${val} дых/мин)!`;
      hasCritical = true;
    } else if (val > range.max) {
      status = 'WARNING_HIGH';
      msg = `Тахипноэ (${val} дых/мин)`;
      hasWarning = true;
    }

    rrResult = {
      status,
      value: val,
      normMin: range.min,
      normMax: range.max,
      unit: 'дых/мин',
      messageRu: msg,
      isCritical: status === 'CRITICAL_LOW' || status === 'CRITICAL_HIGH',
    };
  }

  // 4. Capillary Refill Time (CRT / СНК)
  let crtResult: VitalCheckResult | undefined;
  if (vitals.capillaryRefillTimeSeconds !== undefined) {
    const val = vitals.capillaryRefillTimeSeconds;
    const range = norms.capillaryRefillTimeSeconds;
    const critHigh = range.criticalHigh ?? 3.0;

    let status: VitalStatus = 'NORMAL';
    let msg = `СНК в норме (< ${range.max} с)`;

    if (val > critHigh) {
      status = 'CRITICAL_HIGH';
      msg = `СНК замедлено (${val} с). Тяжелый гиповолемический / кардиогенный шок!`;
      hasCritical = true;
    } else if (val > range.max) {
      status = 'WARNING_HIGH';
      msg = `СНК умеренно замедлено (${val} с). Признак снижения перфузии.`;
      hasWarning = true;
    }

    crtResult = {
      status,
      value: val,
      normMin: range.min,
      normMax: range.max,
      unit: 'с',
      messageRu: msg,
      isCritical: status === 'CRITICAL_HIGH',
    };
  }

  const suggestedTriageLevel = hasCritical
    ? 'CODE_RED_CRITICAL'
    : hasWarning
    ? 'CODE_ORANGE_URGENT'
    : 'CODE_GREEN_ROUTINE';

  return {
    species,
    isOverallNormal: !hasCritical && !hasWarning,
    hasCriticalAnomaly: hasCritical,
    suggestedTriageLevel,
    temperature: tempResult,
    heartRate: hrResult,
    respirationRate: rrResult,
    capillaryRefillTime: crtResult,
  };
}
