import { supabase, isSupabaseConfigured } from './supabase';
import { useAuthStore } from '@/store/authStore';

// In-memory mock storage if Supabase is offline
const MOCK_USER_KEY = 'saakshya_mock_user';
const MOCK_PROFILE_KEY = 'saakshya_mock_profile';

const getMockUser = () => {
  const data = localStorage.getItem(MOCK_USER_KEY);
  return data ? JSON.parse(data) : null;
};

const getMockProfile = () => {
  const data = localStorage.getItem(MOCK_PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const authService = {
  // Listen for auth changes and sync with store
  initAuthListener() {
    const { setAuth, clearAuth } = useAuthStore.getState();

    if (!isSupabaseConfigured()) {
      // Mock auth syncing
      const user = getMockUser();
      const profile = getMockProfile();
      if (user) {
        setAuth(user, profile);
      } else {
        clearAuth();
      }
      return () => {};
    }

    // Real Supabase listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuth(session.user, profile);
        } else {
          clearAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  },

  async signUpWithEmail(email: string, fullName: string) {
    if (!isSupabaseConfigured()) {
      // Simulate API lag
      await new Promise((r) => setTimeout(r, 800));
      const mockUser = { id: 'mock-uid-12345', email };
      const mockProfile = {
        id: 'mock-uid-12345',
        full_name: fullName,
        language: 'en' as const,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mockProfile));

      useAuthStore.getState().setAuth(mockUser, mockProfile);
      return { user: mockUser, profile: mockProfile, error: null };
    }

    // Real Supabase Signup
    // In production, we require signup flow with email verification or auto login
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'TemporaryPassword123!', // Simple fallback for passless OTP flow if needed, or email auth
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) return { user: null, profile: null, error: error.message };

    const profile = {
      id: data.user?.id || '',
      full_name: fullName,
      language: 'en' as const,
    };

    return { user: data.user, profile, error: null };
  },

  async signInWithEmail(email: string) {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 800));
      // Auto register or login with mock
      const mockUser = { id: 'mock-uid-12345', email };
      const mockProfile = getMockProfile() || {
        id: 'mock-uid-12345',
        full_name: email.split('@')[0],
        language: 'en' as const,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mockProfile));

      useAuthStore.getState().setAuth(mockUser, mockProfile);
      return { user: mockUser, error: null };
    }

    // Standard email login using Magic Link for passwordless authentication
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) return { user: null, error: error.message };
    return { user: null, error: null, info: 'Check your email for login link' };
  },

  async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 500));
      const mockUser = { id: 'mock-uid-google', email: 'google.user@example.com' };
      const mockProfile = {
        id: 'mock-uid-google',
        full_name: 'Google Test User',
        language: 'en' as const,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mockProfile));

      useAuthStore.getState().setAuth(mockUser, mockProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    return { error: error?.message || null };
  },

  async signOut() {
    if (!isSupabaseConfigured()) {
      localStorage.removeItem(MOCK_USER_KEY);
      localStorage.removeItem(MOCK_PROFILE_KEY);
      useAuthStore.getState().clearAuth();
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    if (!error) {
      useAuthStore.getState().clearAuth();
    }
    return { error: error?.message || null };
  },
};
