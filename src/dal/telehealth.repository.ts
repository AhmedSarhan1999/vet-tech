import { InMemoryRepositoryBase, RepositoryFilterOptions } from './in-memory-repository.base';
import { Result } from '@/shared/types/dal';
import {
  VideoConsultationOrder,
  VideoCallFormat,
  VideoCallStatus,
} from '@/shared/types/telehealth';

export interface TelehealthFilter {
  readonly userId?: string;
  readonly petId?: string;
  readonly doctorId?: string;
  readonly callFormat?: VideoCallFormat;
  readonly status?: VideoCallStatus;
}

const INITIAL_TELEHEALTH_SEEDS: readonly VideoConsultationOrder[] = [
  // 1. ACTIVE / WAITING ROOM CONSULTATION (TAB 1)
  {
    id: 'tele-nord-active-1',
    userId: 'user-spb-nord',
    callFormat: 'scheduled',
    status: 'waiting_room',
    pet: {
      id: 'pet-nord-01',
      name: 'Норд',
      breed: 'Сибирский хаски',
      weightKg: 28.4,
      chipNumber: '643098100234567',
    },
    doctor: {
      id: 'doc-romanov-01',
      name: 'Д-р Романов Дмитрий С.',
      specialization: 'Ветврач-терапевт, хирург',
      accreditation: 'СПбГУВМ • Россельхознадзор',
      licenseNumber: 'ФГИС «ВетИС» #RU-78/VET-4190',
      experienceYears: 11,
      rating: 4.98,
    },
    chiefComplaint: 'Контроль динамики гастроэнтерита, оценка аппетита и осмотр слизистых десен',
    priceRubles: 1500,
    escrowPaymentId: 'escrow-tele-9041',
    createdAt: '2026-10-13T10:15:00Z',
    appointmentDateText: 'Сегодня, 13 октября',
    timeSlot: '16:30 - 17:00',
    cancellationDeadlineText: 'Бесплатная отмена до 14:30 (за 2 часа)',
    canFreeCancel: true,
  },
  // 2. COMPLETED CALL WITH PROTOCOL & PRESCRIPTION (TAB 2)
  {
    id: 'tele-nord-comp-1',
    userId: 'user-spb-nord',
    callFormat: 'urgent',
    isImmediate: true,
    standbyCountdownSeconds: 0,
    emergencySymptoms: ['Утренняя рвота', 'Вялость'],
    status: 'completed',
    pet: {
      id: 'pet-nord-01',
      name: 'Норд',
      breed: 'Сибирский хаски',
      weightKg: 28.4,
      chipNumber: '643098100234567',
    },
    doctor: {
      id: 'doc-romanov-01',
      name: 'Д-р Романов Дмитрий С.',
      specialization: 'Ветврач-терапевт, хирург',
      accreditation: 'СПбГУВМ • Россельхознадзор',
      licenseNumber: 'ФГИС «ВетИС» #RU-78/VET-4190',
      experienceYears: 11,
      rating: 4.98,
    },
    chiefComplaint: 'Экстренный триаж: подозрение на токсикоинфекцию или инородное тело',
    priceRubles: 1200,
    escrowPaymentId: 'escrow-tele-8812',
    createdAt: '2026-10-12T14:40:00Z',
    diagnosticSummary: {
      primaryDiagnosis: 'Острый алиментарный гастроэнтерит легкой степени',
      objectiveVitals: 'Слизистые бледно-розовые, СНК 1.5 сек, дыхание ровное, болевой синдром купирован',
      recommendations: [
        'Назначен очный выезд бригады для проведения экспресс-теста CPV/CCV Ag',
        'Временная голодная диета на 6 часов с доступом к воде',
      ],
      prescribedMedications: [
        {
          drugName: 'Энтеросгель ветеринарный',
          dosage: '15 г на 30 мл воды',
          frequency: '3 раза в день',
          durationDays: 3,
        },
      ],
      doctorUkepSignature: 'УКЭП #78-VET-4190-ROMANOV • ГОСТ Р 34.12',
      vetIsHorriotRecordNumber: 'ВЕТИС #78-9042',
      completedAtText: '12 окт 2026, 15:10',
    },
  },
  // 3. CANCELLED CONSULTATION WITH ESCROW REFUND (TAB 3)
  {
    id: 'tele-nord-canc-1',
    userId: 'user-spb-nord',
    callFormat: 'scheduled',
    status: 'cancelled',
    pet: {
      id: 'pet-nord-01',
      name: 'Норд',
      breed: 'Сибирский хаски',
      weightKg: 28.4,
      chipNumber: '643098100234567',
    },
    doctor: {
      id: 'doc-smirnova-02',
      name: 'Д-р Смирнова Екатерина В.',
      specialization: 'Ветврач-инфекционист / Гастроэнтеролог',
      accreditation: 'СПбГУВМ • Россельхознадзор',
      licenseNumber: 'ФГИС «ВетИС» #RU-78/VET-5418',
      experienceYears: 8,
      rating: 4.95,
    },
    chiefComplaint: 'Консультация по подбору элиминационной диеты Gastrointestinal',
    priceRubles: 1500,
    escrowPaymentId: 'escrow-tele-7741',
    createdAt: '2026-10-10T09:00:00Z',
    appointmentDateText: '10 октября 2026',
    timeSlot: '18:00 - 18:30',
    cancellationDeadlineText: 'Бесплатная отмена до 16:00',
    canFreeCancel: true,
    cancellationRecord: {
      cancelledAtText: '10 октября в 12:40 (за 5.3 ч до начала)',
      reason: 'Отменено владельцем: симптомы полностью купированы текущей терапией',
      escrowRefundStatus: 'REFUNDED_100%',
      refundAmountRubles: 1500,
      refundCardMasked: 'МИР •••• 4412 (Сбербанк)',
    },
  },
];

/**
 * TelehealthRepository
 * Dedicated DAL implementation for Veterinary Video Consultations.
 * Prepared for offline simulation, in-memory testing, and remote API sync.
 */
export class TelehealthRepository extends InMemoryRepositoryBase<
  VideoConsultationOrder,
  TelehealthFilter
> {
  constructor() {
    super();
    // Pre-populate with initial consultation seeds
    for (const seed of INITIAL_TELEHEALTH_SEEDS) {
      this.items.set(seed.id, seed);
    }
  }

  protected filterItem(
    call: VideoConsultationOrder,
    filter: TelehealthFilter
  ): boolean {
    if (filter.userId && call.userId !== filter.userId) {
      return false;
    }
    if (filter.petId && call.pet.id !== filter.petId) {
      return false;
    }
    if (filter.doctorId && call.doctor.id !== filter.doctorId) {
      return false;
    }
    if (filter.callFormat && call.callFormat !== filter.callFormat) {
      return false;
    }
    if (filter.status && call.status !== filter.status) {
      return false;
    }
    return true;
  }

  async findWhere(
    filter: TelehealthFilter,
    options?: RepositoryFilterOptions
  ): Promise<Result<readonly VideoConsultationOrder[]>> {
    let matches = Array.from(this.items.values()).filter((item) =>
      this.filterItem(item, filter)
    );

    if (options?.offset) {
      matches = matches.slice(options.offset);
    }
    if (options?.limit) {
      matches = matches.slice(0, options.limit);
    }

    return Result.ok(matches);
  }

  async countWhere(filter?: TelehealthFilter): Promise<Result<number>> {
    if (!filter) {
      return Result.ok(this.items.size);
    }
    const count = Array.from(this.items.values()).filter((item) =>
      this.filterItem(item, filter)
    ).length;
    return Result.ok(count);
  }

  async createConsultation(
    consultation: VideoConsultationOrder
  ): Promise<Result<VideoConsultationOrder>> {
    return this.create(consultation);
  }

  async getConsultationsByUserId(
    userId: string
  ): Promise<Result<readonly VideoConsultationOrder[]>> {
    return this.findWhere({ userId });
  }

  async getActiveConsultations(
    userId?: string
  ): Promise<Result<readonly VideoConsultationOrder[]>> {
    const all = Array.from(this.items.values());
    const filtered = all.filter((item) => {
      if (userId && item.userId !== userId) return false;
      return (
        item.status === 'scheduled' ||
        item.status === 'waiting_room' ||
        item.status === 'connected'
      );
    });
    return Result.ok(filtered);
  }

  async getCompletedConsultations(
    userId?: string
  ): Promise<Result<readonly VideoConsultationOrder[]>> {
    const all = Array.from(this.items.values());
    const filtered = all.filter((item) => {
      if (userId && item.userId !== userId) return false;
      return item.status === 'completed';
    });
    return Result.ok(filtered);
  }

  async getCancelledConsultations(
    userId?: string
  ): Promise<Result<readonly VideoConsultationOrder[]>> {
    const all = Array.from(this.items.values());
    const filtered = all.filter((item) => {
      if (userId && item.userId !== userId) return false;
      return item.status === 'cancelled';
    });
    return Result.ok(filtered);
  }

  async cancelConsultation(
    orderId: string,
    reason: string = 'Отмена владельцем до дедлайна'
  ): Promise<Result<VideoConsultationOrder>> {
    const existing = await this.findById(orderId);
    if (!existing.success || !existing.data) {
      return Result.fail(new Error(`Консультация ${orderId} не найдена`));
    }

    const order = existing.data;
    if (order.status === 'completed') {
      return Result.fail(
        new Error('Невозможно отменить уже завершенную видеоконсультацию')
      );
    }

    const cancelledOrder: VideoConsultationOrder = {
      ...order,
      status: 'cancelled',
      cancellationRecord: {
        cancelledAtText: 'Сегодня в 14:10',
        reason,
        escrowRefundStatus: 'REFUNDED_100%',
        refundAmountRubles: order.priceRubles,
        refundCardMasked: 'МИР •••• 4412 (Сбербанк)',
      },
    };

    return this.update(orderId, cancelledOrder);
  }
}
