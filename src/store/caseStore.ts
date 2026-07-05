import { create } from 'zustand';
import { Case } from '@/types/case.types';

interface CaseStore {
  cases: Case[];
  currentCase: Case | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setCases: (cases: Case[]) => void;
  setCurrentCase: (currentCase: Case | null) => void;
  addCase: (newCase: Case) => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  currentCase: null,
  isLoading: false,
  error: null,
  setCases: (cases) => set({ cases, isLoading: false, error: null }),
  setCurrentCase: (currentCase) => set({ currentCase }),
  addCase: (newCase) => set((state) => ({ cases: [newCase, ...state.cases] })),
  updateCase: (caseId, updates) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseId ? { ...c, ...updates } : c)),
      currentCase:
        state.currentCase?.id === caseId
          ? { ...state.currentCase, ...updates }
          : state.currentCase,
    })),
  deleteCase: (caseId) =>
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== caseId),
      currentCase: state.currentCase?.id === caseId ? null : state.currentCase,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
