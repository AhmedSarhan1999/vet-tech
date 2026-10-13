import { SpbDistrict } from '@/shared/types/veterinary';
import {
  DispatchClusterCode,
  DispatchClusterInfo,
  EtaCalculationResult,
} from '@/shared/types/geo';

export const SPB_CLUSTERS: Record<DispatchClusterCode, DispatchClusterInfo> = {
  CLUSTER_A: {
    code: 'CLUSTER_A',
    name: 'Кластер А (Центр / Петроградская сторона)',
    description: 'Высокая плотность, исторический центр, выделенные коридоры для вет-службы.',
    baseEtaMinutesRange: { min: 15, max: 20 },
    trafficBufferMultiplier: 1.15,
    districts: ['Центральный', 'Адмиралтейский', 'Петроградский', 'Василеостровский'],
    hasRapidAmbulanceCorridor: true,
    houseCallSurchargeRubles: 0,
  },
  CLUSTER_B: {
    code: 'CLUSTER_B',
    name: 'Кластер B (Север / Приморский хаб)',
    description: 'Северные спальные районы высокой плотности, КАД / ЗСД доступ.',
    baseEtaMinutesRange: { min: 25, max: 35 },
    trafficBufferMultiplier: 1.3,
    districts: ['Приморский', 'Выборгский', 'Калининский', 'Красногвардейский'],
    hasRapidAmbulanceCorridor: true,
    houseCallSurchargeRubles: 300,
  },
  CLUSTER_C: {
    code: 'CLUSTER_C',
    name: 'Кластер C (Юг / Московский коридор)',
    description: 'Южные районы, скоростные магистрали Московского и Пулковского шоссе.',
    baseEtaMinutesRange: { min: 25, max: 35 },
    trafficBufferMultiplier: 1.25,
    districts: ['Московский', 'Кировский', 'Фрунзенский', 'Невский', 'Красносельский'],
    hasRapidAmbulanceCorridor: true,
    houseCallSurchargeRubles: 300,
  },
  CLUSTER_D: {
    code: 'CLUSTER_D',
    name: 'Кластер D (Пригородная зона / Заливы)',
    description: 'Удаленные районы СПб и выездные зоны Карельского перешейка / Южного берега.',
    baseEtaMinutesRange: { min: 45, max: 60 },
    trafficBufferMultiplier: 1.4,
    districts: ['Курортный', 'Кронштадтский', 'Петродворцовый', 'Пушкинский', 'Колпинский'],
    hasRapidAmbulanceCorridor: false,
    houseCallSurchargeRubles: 800,
  },
};

/**
 * Returns the operational cluster for a given Saint Petersburg district
 */
export function getClusterByDistrict(district: SpbDistrict): DispatchClusterInfo {
  for (const cluster of Object.values(SPB_CLUSTERS)) {
    if ((cluster.districts as readonly string[]).includes(district)) {
      return cluster;
    }
  }
  // Fallback to Cluster A if unknown
  return SPB_CLUSTERS.CLUSTER_A;
}

/**
 * Checks whether the current time in Saint Petersburg constitutes rush hour
 * (08:30 - 10:30 MSK or 17:30 - 20:00 MSK)
 */
export function isSpbRushHour(date: Date = new Date()): boolean {
  // Use Moscow Time (+3 UTC)
  const hours = date.getUTCHours() + 3;
  const minutes = date.getUTCMinutes();
  const timeDecimal = hours + minutes / 60;

  const isMorningPeak = timeDecimal >= 8.5 && timeDecimal <= 10.5;
  const isEveningPeak = timeDecimal >= 17.5 && timeDecimal <= 20.0;

  return isMorningPeak || isEveningPeak;
}

/**
 * Calculates real-time estimated arrival for veterinary ambulance house-call
 */
export function calculateDistrictEta(
  district: SpbDistrict,
  options?: {
    forceRushHour?: boolean;
    isEmergencyTriage?: boolean;
  }
): EtaCalculationResult {
  const cluster = getClusterByDistrict(district);
  const isRushHour = options?.forceRushHour ?? isSpbRushHour();

  const multiplier = isRushHour ? cluster.trafficBufferMultiplier : 1.0;
  const emergencyReduction = options?.isEmergencyTriage ? 0.75 : 1.0;

  const calculatedMin = Math.round(cluster.baseEtaMinutesRange.min * multiplier * emergencyReduction);
  const calculatedMax = Math.round(cluster.baseEtaMinutesRange.max * multiplier * emergencyReduction);

  const estimatedArrivalMinutes = Math.round((calculatedMin + calculatedMax) / 2);

  return {
    district,
    cluster,
    estimatedArrivalMinutes,
    etaWindowFormatted: `${calculatedMin}-${calculatedMax} мин`,
    isRushHourBufferApplied: isRushHour,
    priorityStatus: options?.isEmergencyTriage
      ? 'EXPEDITED'
      : isRushHour
      ? 'HIGH_DEMAND'
      : 'NORMAL',
  };
}
