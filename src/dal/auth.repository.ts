import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { AuthUser, IAuthRepository, UserRole } from '@/shared/types/auth';
import { Result } from '@/shared/types/dal';

const ROLE_STORAGE_KEY = 'vettech_active_user_role';

export class FirebaseAuthRepository implements IAuthRepository {
  private currentUser: AuthUser | null = null;

  constructor() {
    // Sync current user on init if already signed in
    if (auth.currentUser) {
      this.currentUser = this.mapFirebaseUser(auth.currentUser, this.getStoredRole());
    }
  }

  private getStoredRole(): UserRole {
    try {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY);
      if (stored === 'veterinarian' || stored === 'pet_parent' || stored === 'admin') {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'pet_parent';
  }

  private setStoredRole(role: UserRole): void {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // Ignore storage access errors
    }
  }

  private mapFirebaseUser(user: FirebaseUser, role: UserRole): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      role,
      providerId: user.providerData[0]?.providerId ?? 'google.com',
      lastLoginAtIso: new Date().toISOString(),
    };
  }

  public getCurrentUser(): AuthUser | null {
    if (this.currentUser) return this.currentUser;
    if (auth.currentUser) {
      this.currentUser = this.mapFirebaseUser(auth.currentUser, this.getStoredRole());
      return this.currentUser;
    }
    return null;
  }

  public async signInWithGoogle(role: UserRole = 'pet_parent'): Promise<Result<AuthUser>> {
    try {
      this.setStoredRole(role);
      const credential = await signInWithPopup(auth, googleProvider);
      const mappedUser = this.mapFirebaseUser(credential.user, role);
      this.currentUser = mappedUser;
      return Result.ok(mappedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка аутентификации через Google';
      return Result.fail(new Error(`[Auth Error] ${message}`));
    }
  }

  public async signInWithPhoneSimulated(phone: string, role: UserRole): Promise<Result<AuthUser>> {
    try {
      this.setStoredRole(role);
      // Clean phone number
      const sanitizedPhone = phone.replace(/[^\d+]/g, '');
      const simulatedUser: AuthUser = {
        uid: `sim-user-${Date.now()}`,
        email: null,
        displayName:
          role === 'admin'
            ? 'Кузнецов И. В. • СПбГУВМ Вет-Координатор СПб'
            : role === 'veterinarian'
            ? 'Д-р Тестовый В. В.'
            : 'Владелец (Тестовый)',
        phoneNumber: sanitizedPhone || '+79219876543',
        photoURL: null,
        role,
        providerId: 'phone.sms',
        lastLoginAtIso: new Date().toISOString(),
      };
      this.currentUser = simulatedUser;
      return Result.ok(simulatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа по номеру телефона';
      return Result.fail(new Error(message));
    }
  }

  public async signOut(): Promise<Result<void>> {
    try {
      await firebaseSignOut(auth);
      this.currentUser = null;
      return Result.ok(undefined);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка выхода из учетной записи';
      return Result.fail(new Error(message));
    }
  }

  public onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUser(firebaseUser, this.getStoredRole());
        this.currentUser = user;
        callback(user);
      } else if (this.currentUser && this.currentUser.providerId === 'phone.sms') {
        // Keep simulated session active until explicit signOut
        callback(this.currentUser);
      } else {
        this.currentUser = null;
        callback(null);
      }
    });
  }
}

export const authRepository = new FirebaseAuthRepository();
