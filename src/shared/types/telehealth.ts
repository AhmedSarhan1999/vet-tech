export type VideoCallFormat = 'urgent' | 'scheduled';

export type VideoCallStatus =
  | 'scheduled'
  | 'waiting_room'
  | 'connected'
  | 'completed'
  | 'cancelled';

export interface TelehealthPetProfile {
  readonly id: string;
  readonly name: string;
  readonly breed: string;
  readonly weightKg: number;
  readonly chipNumber?: string;
  readonly avatarUrl?: string;
}

export interface TelehealthDoctorProfile {
  readonly id: string;
  readonly name: string;
  readonly specialization: string;
  readonly accreditation: string; // e.g. "СПбГУВМ • Россельхознадзор"
  readonly licenseNumber: string;
  readonly experienceYears: number;
  readonly rating: number;
  readonly avatarUrl?: string;
}

export interface TelehealthPrescriptionItem {
  readonly drugName: string;
  readonly dosage: string;
  readonly frequency: string;
  readonly durationDays: number;
}

export interface TelehealthDiagnosticSummary {
  readonly primaryDiagnosis: string;
  readonly objectiveVitals?: string;
  readonly recommendations: readonly string[];
  readonly prescribedMedications: readonly TelehealthPrescriptionItem[];
  readonly doctorUkepSignature: string;
  readonly vetIsHorriotRecordNumber: string;
  readonly completedAtText: string;
}

export interface TelehealthCancellationRecord {
  readonly cancelledAtText: string;
  readonly reason: string;
  readonly escrowRefundStatus: 'REFUNDED_100%' | 'PENALTY_APPLIED';
  readonly refundAmountRubles: number;
  readonly refundCardMasked: string;
}

export interface BaseVideoConsultationOrder {
  readonly id: string;
  readonly userId: string;
  readonly callFormat: VideoCallFormat;
  readonly status: VideoCallStatus;
  readonly pet: TelehealthPetProfile;
  readonly doctor: TelehealthDoctorProfile;
  readonly chiefComplaint: string;
  readonly priceRubles: number;
  readonly escrowPaymentId: string;
  readonly createdAt: string;
  readonly diagnosticSummary?: TelehealthDiagnosticSummary;
  readonly cancellationRecord?: TelehealthCancellationRecord;
}

export interface UrgentVideoConsultationOrder extends BaseVideoConsultationOrder {
  readonly callFormat: 'urgent';
  readonly isImmediate: true;
  readonly standbyCountdownSeconds: number;
  readonly emergencySymptoms: readonly string[];
}

export interface ScheduledVideoConsultationOrder extends BaseVideoConsultationOrder {
  readonly callFormat: 'scheduled';
  readonly appointmentDateText: string;
  readonly timeSlot: string; // e.g. "14:00 - 14:30"
  readonly cancellationDeadlineText: string;
  readonly canFreeCancel: boolean;
}

export type VideoConsultationOrder =
  | UrgentVideoConsultationOrder
  | ScheduledVideoConsultationOrder;

export interface CreateVideoConsultationInput {
  readonly callFormat: VideoCallFormat;
  readonly pet: TelehealthPetProfile;
  readonly chiefComplaint: string;
  readonly emergencySymptoms?: readonly string[];
  readonly appointmentDateText?: string;
  readonly timeSlot?: string;
}
