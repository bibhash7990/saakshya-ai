import { supabase, isSupabaseConfigured } from './supabase';
import { useCaseStore } from '@/store/caseStore';
import { Case, CaseType, CaseStatus } from '@/types/case.types';
import { useAuthStore } from '@/store/authStore';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const MOCK_CASES_KEY = 'saakshya_mock_cases';

const getMockCases = (): Case[] => {
  const data = localStorage.getItem(MOCK_CASES_KEY);
  if (!data) {
    // Seed some initial cases for first-time demo users to explore!
    const seedCases: Case[] = [
      {
        id: 'mock-case-1',
        user_id: 'mock-uid-12345',
        title: 'Security Deposit Refund Dispute',
        description: 'Landlord refusing to refund security deposit after lease completed. Accusing of damage to walls that was present before move-in.',
        case_type: 'rental_dispute',
        status: 'collecting',
        strength_score: 45,
        evidence_count: 3,
        tags: ['landlord', 'rent', 'deposit'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-case-2',
        user_id: 'mock-uid-12345',
        title: 'E-Commerce Marketplace Fraud',
        description: 'Purchased phone from Instagram vendor, received packaging containing stones. Seller account deleted immediately after payment.',
        case_type: 'online_fraud',
        status: 'certified',
        strength_score: 82,
        evidence_count: 5,
        tags: ['online', 'scam', 'payment'],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(MOCK_CASES_KEY, JSON.stringify(seedCases));
    return seedCases;
  }
  return JSON.parse(data);
};

const saveMockCases = (cases: Case[]) => {
  localStorage.setItem(MOCK_CASES_KEY, JSON.stringify(cases));
};

export const casesService = {
  async fetchCases() {
    const { setCases, setLoading, setError } = useCaseStore.getState();
    const profile = useAuthStore.getState().profile;

    if (!profile) return [];

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 600));
      const allCases = getMockCases().filter((c) => c.user_id === profile.id);
      setCases(allCases);
      return allCases;
    }

    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return [];
    }

    // Decrypt sensitive fields
    const decryptedCases = await Promise.all(
      (data || []).map(async (c: Case) => {
        if (c.description) {
          c.description = await decryptData(c.description, profile.id);
        }
        return c;
      })
    );

    setCases(decryptedCases);
    return decryptedCases;
  },

  async createCase(title: string, description: string, caseType: CaseType, tags: string[] = []) {
    const { addCase, setLoading, setError } = useCaseStore.getState();
    const profile = useAuthStore.getState().profile;

    if (!profile) throw new Error('Unauthenticated');

    setLoading(true);
    setError(null);

    const encryptedDescription = await encryptData(description, profile.id);

    const newCaseData = {
      title,
      description: encryptedDescription,
      case_type: caseType,
      tags,
      status: 'collecting' as CaseStatus,
      strength_score: 10, // Initial score
      evidence_count: 0,
      user_id: profile.id,
    };

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 500));
      const mockCase: Case = {
        ...newCaseData,
        id: 'mock-case-' + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const allCases = [mockCase, ...getMockCases()];
      saveMockCases(allCases);
      addCase(mockCase);
      setLoading(false);
      return mockCase;
    }

    const { data, error } = await supabase
      .from('cases')
      .insert(newCaseData)
      .select('*')
      .single();

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    const createdCase = { ...data, description }; // Use plaintext in store
    addCase(createdCase);
    return createdCase;
  },

  async updateCase(caseId: string, updates: Partial<Case>) {
    const { updateCase, setError } = useCaseStore.getState();
    const profile = useAuthStore.getState().profile;

    let payloadToSave = { ...updates, updated_at: new Date().toISOString() };
    if (updates.description && profile) {
      payloadToSave.description = await encryptData(updates.description, profile.id);
    }

    if (!isSupabaseConfigured()) {
      const allCases = getMockCases();
      const updatedCases = allCases.map((c) =>
        c.id === caseId ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
      );
      saveMockCases(updatedCases);
      updateCase(caseId, updates);
      return;
    }

    const { error } = await supabase
      .from('cases')
      .update(payloadToSave)
      .eq('id', caseId);

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    updateCase(caseId, updates);
  },

  async deleteCase(caseId: string) {
    const { deleteCase, setError } = useCaseStore.getState();

    if (!isSupabaseConfigured()) {
      const allCases = getMockCases();
      const filtered = allCases.filter((c) => c.id !== caseId);
      saveMockCases(filtered);
      deleteCase(caseId);
      return;
    }

    const { error } = await supabase.from('cases').delete().eq('id', caseId);

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    deleteCase(caseId);
  },
};
