import { InMemoryRepositoryBase, RepositoryFilterOptions } from './in-memory-repository.base';
import { Result } from '@/shared/types/dal';
import { BookingOrder, BookingFilter } from '@/shared/types/booking';

/**
 * BookingRepository
 * Decoupled Data Access Layer implementation for VetTech OS Bookings.
 * Prepared for zero-downtime migration between in-memory mock-free testing,
 * Firebase Firestore, and Russian PostgreSQL / Yandex Cloud per 152-FZ.
 */
export class BookingRepository extends InMemoryRepositoryBase<BookingOrder, BookingFilter> {
  protected filterItem(booking: BookingOrder, filter: BookingFilter): boolean {
    if (filter.userId && booking.userId !== filter.userId) {
      return false;
    }
    if (filter.petId && booking.pet.id !== filter.petId) {
      return false;
    }
    if (filter.doctorId && booking.doctor.id !== filter.doctorId) {
      return false;
    }
    if (filter.dispatchType && booking.dispatchType !== filter.dispatchType) {
      return false;
    }
    if (filter.status && booking.status !== filter.status) {
      return false;
    }
    return true;
  }

  async findWhere(
    filter: BookingFilter,
    options?: RepositoryFilterOptions
  ): Promise<Result<readonly BookingOrder[]>> {
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

  async countWhere(filter?: BookingFilter): Promise<Result<number>> {
    if (!filter) {
      return Result.ok(this.items.size);
    }
    const count = Array.from(this.items.values()).filter((item) =>
      this.filterItem(item, filter)
    ).length;
    return Result.ok(count);
  }

  /**
   * Create a new booking order with initial hold authorization status
   */
  async createBooking(booking: BookingOrder): Promise<Result<BookingOrder>> {
    return this.create(booking);
  }

  /**
   * Retrieve all bookings linked to a specific authenticated pet parent
   */
  async getBookingsByUserId(userId: string): Promise<Result<readonly BookingOrder[]>> {
    return this.findWhere({ userId });
  }

  /**
   * Cancel an active booking order with optional reason
   */
  async cancelBooking(
    bookingId: string,
    reason: string = 'Отмена владельцем в приложении'
  ): Promise<Result<BookingOrder>> {
    const existing = await this.findById(bookingId);
    if (!existing.success || !existing.data) {
      return Result.fail(new Error(`Заказ с ID ${bookingId} не найден.`));
    }

    const order = existing.data;
    if (order.status === 'COMPLETED') {
      return Result.fail(new Error('Невозможно отменить уже завершенный выезд ветврача.'));
    }

    const updated = await this.update(bookingId, {
      status: 'CANCELLED',
      cancellationReason: reason,
      updatedAtIso: new Date().toISOString(),
    });

    return updated;
  }

  /**
   * Direct fetch by booking ID
   */
  async getBookingById(id: string): Promise<Result<BookingOrder | null>> {
    return this.findById(id);
  }
}
