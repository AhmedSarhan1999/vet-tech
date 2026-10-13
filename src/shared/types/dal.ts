/**
 * VetTech OS — Decoupled Data Access Layer (DAL) Architecture
 * Decouples Domain & UI from concrete infrastructure (Firebase vs Yandex Cloud PostgreSQL / 152-FZ).
 */

export type DataBackendProvider = 'in-memory' | 'firebase' | 'postgres';

export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ success: true, data }),
  fail: <E = Error>(error: E): Result<never, E> => ({ success: false, error }),
};

export interface RepositoryFilterOptions {
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Generic Clean Repository Interface
 */
export interface IRepository<T, ID = string> {
  findById(id: ID): Promise<Result<T | null>>;
  findAll(options?: RepositoryFilterOptions): Promise<Result<readonly T[]>>;
  create(entity: T): Promise<Result<T>>;
  update(id: ID, patch: Partial<T>): Promise<Result<T>>;
  delete(id: ID): Promise<Result<boolean>>;
}

/**
 * Queryable Repository Interface with Filter Predicates
 */
export interface IQueryableRepository<T, ID = string, TFilter = unknown>
  extends IRepository<T, ID> {
  findWhere(filter: TFilter, options?: RepositoryFilterOptions): Promise<Result<readonly T[]>>;
  countWhere(filter?: TFilter): Promise<Result<number>>;
}

/**
 * Metadata for Russian Federal Law 152-FZ & Security Compliance
 */
export interface InfrastructureMetadata {
  readonly provider: DataBackendProvider;
  readonly dataCenterLocation: 'SPB_LOCAL_DC' | 'MOSCOW_YANDEX_CLOUD' | 'SANDBOX_DEV';
  readonly is152FzCompliant: boolean;
  readonly encryptionStandard: 'GOST_28147_89' | 'AES_256_GCM';
}
