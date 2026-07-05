import { create } from 'zustand';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  language: 'en' | 'hi';
  avatar_url?: string;
  created_at?: string;
}

interface AuthStore {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  setAuth: (user: any, profile: UserProfile | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (profileUpdates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  setAuth: (user, profile) =>
    set({
      user,
      profile,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),
  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  updateProfile: (profileUpdates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...profileUpdates } : null,
    })),
}));
