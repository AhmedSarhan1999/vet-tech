import {
  IRepository,
  IQueryableRepository,
  RepositoryFilterOptions,
  Result,
} from '@/shared/types/dal';

export type { IRepository, IQueryableRepository, RepositoryFilterOptions };

/**
 * InMemoryRepositoryBase
 * High-performance, zero-dependency in-memory implementation of IQueryableRepository.
 * Validates domain rules locally before future persistence to Postgres/Firebase.
 */
export abstract class InMemoryRepositoryBase<
  T extends { readonly id: string },
  TFilter = unknown
> implements IQueryableRepository<T, string, TFilter> {
  protected items: Map<string, T> = new Map();

  constructor(initialItems: readonly T[] = []) {
    initialItems.forEach((item) => this.items.set(item.id, item));
  }

  async findById(id: string): Promise<Result<T | null>> {
    const item = this.items.get(id);
    return Result.ok(item ?? null);
  }

  async findAll(options?: RepositoryFilterOptions): Promise<Result<readonly T[]>> {
    let result = Array.from(this.items.values());

    if (options?.offset) {
      result = result.slice(options.offset);
    }
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }

    return Result.ok(result);
  }

  async create(entity: T): Promise<Result<T>> {
    if (this.items.has(entity.id)) {
      return Result.fail(new Error(`[DAL Error] Entity with id "${entity.id}" already exists.`));
    }
    this.items.set(entity.id, entity);
    return Result.ok(entity);
  }

  async update(id: string, patch: Partial<T>): Promise<Result<T>> {
    const existing = this.items.get(id);
    if (!existing) {
      return Result.fail(new Error(`[DAL Error] Cannot update: Entity "${id}" not found.`));
    }
    const updated = { ...existing, ...patch };
    this.items.set(id, updated);
    return Result.ok(updated);
  }

  async delete(id: string): Promise<Result<boolean>> {
    const deleted = this.items.delete(id);
    return Result.ok(deleted);
  }

  /**
   * Subclasses override filterItem to implement custom filter predicates
   */
  protected abstract filterItem(item: T, filter: TFilter): boolean;

  async findWhere(filter: TFilter, options?: RepositoryFilterOptions): Promise<Result<readonly T[]>> {
    let matches = Array.from(this.items.values()).filter((item) => this.filterItem(item, filter));

    if (options?.offset) {
      matches = matches.slice(options.offset);
    }
    if (options?.limit) {
      matches = matches.slice(0, options.limit);
    }

    return Result.ok(matches);
  }

  async countWhere(filter?: TFilter): Promise<Result<number>> {
    if (!filter) {
      return Result.ok(this.items.size);
    }
    const count = Array.from(this.items.values()).filter((item) => this.filterItem(item, filter)).length;
    return Result.ok(count);
  }
}
