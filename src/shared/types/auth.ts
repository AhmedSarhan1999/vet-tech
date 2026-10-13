import { Result } from './dal';

export type UserRole = 'pet_parent' | 'veterinarian' | 'admin';

export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly phoneNumber: string | null;
  readonly photoURL: string | null;
  readonly role: UserRole;
  readonly providerId: string;
  readonly lastLoginAtIso: string;
}

export interface IAuthRepository {
  signInWithGoogle(role?: UserRole): Promise<Result<AuthUser>>;
  signInWithPhoneSimulated(phone: string, role: UserRole): Promise<Result<AuthUser>>;
  signOut(): Promise<Result<void>>;
  getCurrentUser(): AuthUser | null;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
