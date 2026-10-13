import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserRole } from '@/shared/types/auth';
import { authRepository } from '@/dal/auth.repository';

export interface AuthContextValue {
  user: AuthUser | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: (role?: UserRole) => Promise<boolean>;
  signInWithPhone: (phone: string, role?: UserRole) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authRepository.getCurrentUser());
  const [activeRole, setActiveRole] = useState<UserRole>('pet_parent');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setActiveRole(currentUser.role);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleSignInWithGoogle = useCallback(
    async (role?: UserRole): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      const targetRole = role ?? activeRole;
      const res = await authRepository.signInWithGoogle(targetRole);
      setIsLoading(false);

      if (res.success) {
        setUser(res.data);
        setActiveRole(res.data.role);
        return true;
      } else {
        setError(res.error.message);
        return false;
      }
    },
    [activeRole]
  );

  const handleSignInWithPhone = useCallback(
    async (phone: string, role?: UserRole): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      const targetRole = role ?? activeRole;
      const res = await authRepository.signInWithPhoneSimulated(phone, targetRole);
      setIsLoading(false);

      if (res.success) {
        setUser(res.data);
        setActiveRole(res.data.role);
        return true;
      } else {
        setError(res.error.message);
        return false;
      }
    },
    [activeRole]
  );

  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    await authRepository.signOut();
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        setActiveRole,
        isLoading,
        error,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithPhone: handleSignInWithPhone,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
