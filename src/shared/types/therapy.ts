/**
 * VetTech OS — Interactive Therapy & Medication Adherence Tracker
 * Compliant with:
 * - Russian Federal Law No. 4979-1 "On Veterinary Medicine"
 * - FGIS VetIS ("Horriot" & "Mercury")
 * - Good Veterinary Clinical Practice (GVCP)
 */

export type TherapyDoseStatus = 'completed' | 'pending' | 'missed' | 'postponed';

export interface TherapyDose {
  readonly id: string;
  readonly doseNumber: number; // 1 or 2
  readonly timeScheduled: string; // e.g. "08:30" or "20:30"
  readonly doseAmount: string; // e.g. "1.5 таблетки (375 мг)"
  readonly instruction: string; // e.g. "С влажным кормом / паштетом"
  readonly status: TherapyDoseStatus;
  readonly administeredAtText?: string; // e.g. "08:35"
  readonly administeredBy?: string; // e.g. "Владелец Александр"
  readonly missedReason?: string; // e.g. "Пропущено владельцем"
  readonly timeWindowText?: string; // e.g. "20:15 – 21:00"
}

export interface TherapyDay {
  readonly dayNumber: number; // 1 to 10
  readonly dateText: string; // e.g. "12 окт"
  readonly fullDateText: string; // e.g. "12 октября"
  readonly isToday: boolean;
  readonly doses: readonly TherapyDose[];
}

export interface TherapyVitalsLog {
  readonly rectalTempCelsius: number;
  readonly measuredAtText: string;
  readonly statusLabel: string; // "Нормотермия (37.5 – 39.0°C)"
}

export interface TherapyHydrationState {
  readonly currentMl: number;
  readonly targetMl: number;
}

export interface TherapyCourse {
  readonly id: string;
  readonly petId: string;
  readonly drugName: string;
  readonly activeSubstance: string;
  readonly formAndDosage: string;
  readonly diagnosis: string;
  readonly prescribedBy: string;
  readonly visitProtocolNumber: string;
  readonly totalDays: number;
  readonly currentDay: number;
  readonly frequencyText: string;
  readonly startDateText: string;
  readonly endDateText: string;
  readonly adherencePercent: number;
  readonly days: readonly TherapyDay[];
  readonly vitals: TherapyVitalsLog;
  readonly hydration: TherapyHydrationState;
  readonly symptomaticCare: {
    readonly syrupName: string;
    readonly dosageInstruction: string;
    readonly activityRegimen: string;
  };
}
