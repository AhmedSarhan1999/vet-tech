/**
 * VetTech OS — Saint Petersburg Geographic Clustering (SPb Dispatch Geo-Engine)
 * Operational Geofencing for Veterinary House-Call Fleet Management
 */

import { SpbDistrict } from './veterinary';

export type DispatchClusterCode = 'CLUSTER_A' | 'CLUSTER_B' | 'CLUSTER_C' | 'CLUSTER_D';

export interface DispatchClusterInfo {
  readonly code: DispatchClusterCode;
  readonly name: string;
  readonly description: string;
  readonly baseEtaMinutesRange: {
    readonly min: number;
    readonly max: number;
  };
  readonly trafficBufferMultiplier: number;
  readonly districts: readonly SpbDistrict[];
  readonly hasRapidAmbulanceCorridor: boolean;
  readonly houseCallSurchargeRubles: number;
}

export interface EtaCalculationResult {
  readonly district: SpbDistrict;
  readonly cluster: DispatchClusterInfo;
  readonly estimatedArrivalMinutes: number;
  readonly etaWindowFormatted: string; // e.g. "15-20 мин"
  readonly isRushHourBufferApplied: boolean;
  readonly priorityStatus: 'NORMAL' | 'HIGH_DEMAND' | 'EXPEDITED';
}
