import { create } from 'zustand';
import { Evidence, CustodyLog } from '@/types/evidence.types';

interface EvidenceStore {
  evidenceList: Evidence[];
  custodyLogs: CustodyLog[];
  isLoading: boolean;
  error: string | null;
  // Actions
  setEvidenceList: (list: Evidence[]) => void;
  addEvidence: (evidence: Evidence) => void;
  removeEvidence: (evidenceId: string) => void;
  updateEvidence: (evidenceId: string, updates: Partial<Evidence>) => void;
  setCustodyLogs: (logs: CustodyLog[]) => void;
  addCustodyLog: (log: CustodyLog) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEvidenceStore = create<EvidenceStore>((set) => ({
  evidenceList: [],
  custodyLogs: [],
  isLoading: false,
  error: null,
  setEvidenceList: (evidenceList) => set({ evidenceList, isLoading: false, error: null }),
  addEvidence: (evidence) => set((state) => ({ evidenceList: [evidence, ...state.evidenceList] })),
  removeEvidence: (evidenceId) =>
    set((state) => ({
      evidenceList: state.evidenceList.filter((e) => e.id !== evidenceId),
    })),
  updateEvidence: (evidenceId, updates) =>
    set((state) => ({
      evidenceList: state.evidenceList.map((e) => (e.id === evidenceId ? { ...e, ...updates } : e)),
    })),
  setCustodyLogs: (custodyLogs) => set({ custodyLogs }),
  addCustodyLog: (log) => set((state) => ({ custodyLogs: [log, ...state.custodyLogs] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}));
