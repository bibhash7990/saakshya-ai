import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { useState } from 'react';

export const useAuth = () => {
  const { user, profile, isAuthenticated, isLoading, error } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const login = async (email: string, password?: string) => {
    setSubmitting(true);
    try {
      const result = await authService.signInWithEmail(email, password || 'TemporaryPassword123!');
      setSubmitting(false);
      return result;
    } catch (err: any) {
      setSubmitting(false);
      return { user: null, error: err.message || 'Login failed' };
    }
  };

  const register = async (email: string, fullName: string, password?: string) => {
    setSubmitting(true);
    try {
      const result = await authService.signUpWithEmail(email, password || 'TemporaryPassword123!', fullName);
      setSubmitting(false);
      return result;
    } catch (err: any) {
      setSubmitting(false);
      return { user: null, profile: null, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setSubmitting(true);
    const result = await authService.signOut();
    setSubmitting(false);
    return result;
  };

  const loginWithGoogle = async () => {
    setSubmitting(true);
    const result = await authService.signInWithGoogle();
    setSubmitting(false);
    return result;
  };

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    submitting,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
  };
};
