/**
 * VetTech OS — Pure Veterinary Domain Contracts
 * Booking Domain Entity Specification & Discriminated Union Architecture
 * Compliance: Russian Federal Law No. 4979-1, FGIS VetIS (Horriot/Mercury), 152-FZ
 */

export type BookingDispatchType = 'urgent' | 'scheduled';

export type BookingLifecycleStatus =
  | 'DRAFT'
  | 'HOLD_AUTHORIZED'
  | 'IN_TRANSIT'
  | 'ACTIVE_EXAM'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingPetProfile {
  readonly id: string;
  readonly name: string;
  readonly breed: string;
  readonly weightKg: number;
  readonly ageText?: string;
  readonly microchipNumber?: string;
  readonly passportSeriesNumber?: string;
}

export interface BookingDoctorProfile {
  readonly id: string;
  readonly name: string;
  readonly licenseNumber: string;
  readonly vehicle: string;
  readonly specialization: string;
  readonly rating: number;
  readonly callsCount?: number;
}

export interface BookingAddressDetails {
  readonly district: string;
  readonly street: string;
  readonly house: string;
  readonly entrance?: string;
  readonly floor?: string;
  readonly apartment?: string;
  readonly intercomCode?: string;
  readonly barrierNotes?: string;
  readonly fullAddressText: string;
}

export interface BookingRestraintProtocol {
  readonly temperamentNotes: string;
  readonly softMuzzleRequired: boolean;
  readonly leashRequired: boolean;
  readonly otherAnimalsIsolated: boolean;
  readonly isVetPassportPrepared: boolean;
}

export interface BookingAnamnesis {
  readonly chiefComplaint: string;
  readonly clinicalPurpose: string;
  readonly symptomsNotes?: string;
  readonly highPriorityTemperature?: string;
}

export interface BookingPricing {
  readonly basePriceRubles: number;
  readonly discountRubles: number;
  readonly finalHoldRubles: number;
  readonly tariffLabel: string;
}

export interface BookingPaymentDetails {
  readonly cardMask: string;
  readonly bankName: string;
  readonly yooKassaHoldId: string;
  readonly status: 'HOLD_AUTHORIZED' | 'CAPTURED' | 'REFUNDED';
}

/**
 * Common attributes shared across all booking orders.
 */
export interface BaseBookingOrder {
  readonly id: string;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
  readonly userId: string;
  readonly pet: BookingPetProfile;
  readonly doctor: BookingDoctorProfile;
  readonly address: BookingAddressDetails;
  readonly restraintProtocol: BookingRestraintProtocol;
  readonly anamnesis: BookingAnamnesis;
  readonly pricing: BookingPricing;
  readonly payment: BookingPaymentDetails;
  readonly status: BookingLifecycleStatus;
  readonly cancellationReason?: string;
}

/**
 * Urgent Booking Order Variant
 */
export interface UrgentBookingOrder extends BaseBookingOrder {
  readonly dispatchType: 'urgent';
  readonly etaMinutes: number; // e.g., 15-20 min
  readonly urgentFlags: {
    readonly feverTemperature?: string; // e.g. "T 39.4°C"
    readonly criticalSymptomAlert?: string;
  };
}

/**
 * Scheduled Booking Order Variant
 */
export interface ScheduledBookingOrder extends BaseBookingOrder {
  readonly dispatchType: 'scheduled';
  readonly scheduledDateText: string; // e.g., "Вторник, 12 октября"
  readonly timeWindow: {
    readonly startTime: string; // e.g., "14:00"
    readonly endTime: string;   // e.g., "15:30"
    readonly label: string;     // e.g., "Оптимальное время • Дневной"
  };
  readonly cancellationDeadlineText: string; // e.g., "до 12:00 (за 2 часа до визита)"
  readonly reminderAdvanceHours: number;     // e.g., 2
}

/**
 * Discriminated Union for Domain Purity
 */
export type BookingOrder = UrgentBookingOrder | ScheduledBookingOrder;

/**
 * Query Filter for Booking Repository
 */
export interface BookingFilter {
  readonly userId?: string;
  readonly petId?: string;
  readonly doctorId?: string;
  readonly dispatchType?: BookingDispatchType;
  readonly status?: BookingLifecycleStatus;
}
