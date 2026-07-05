import { supabase, isSupabaseConfigured } from './supabase';
import { useEvidenceStore } from '@/store/evidenceStore';
import { useCaseStore } from '@/store/caseStore';
import { Evidence, CustodyLog } from '@/types/evidence.types';
import { storageService } from './storage.service';
import { useAuthStore } from '@/store/authStore';
import { encryptData, decryptData } from '@/utils/cryptoUtils';

const MOCK_EVIDENCE_KEY = 'saakshya_mock_evidence';
const MOCK_CUSTODY_KEY = 'saakshya_mock_custody';

const getMockEvidence = (): Evidence[] => {
  const data = localStorage.getItem(MOCK_EVIDENCE_KEY);
  if (!data) {
    // Seed evidence items for the demo cases!
    const seedEvidence: Evidence[] = [
      {
        id: 'mock-ev-1',
        case_id: 'mock-case-1',
        user_id: 'mock-uid-12345',
        title: 'Original Rental Agreement',
        description: 'Signed digital agreement showing security deposit amount and return conditions.',
        evidence_type: 'document',
        file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
        file_name: 'RentalAgreement_Signed.pdf',
        file_size: 1450000,
        mime_type: 'application/pdf',
        sha256_hash: '8f43ea9c12b4890d2e85a6a3b2b48d2e85a6a3b2b48d2e85a6a3b2b48d2e85a6',
        upload_timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        device_info: { browser: 'Chrome', os: 'Windows 11' },
        ai_tags: ['agreement', 'rental', 'deposit'],
        relevance_score: 95,
        authenticity_score: 100,
        is_verified: true,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-ev-2',
        case_id: 'mock-case-1',
        user_id: 'mock-uid-12345',
        title: 'Rent payment confirmation receipt',
        description: 'Bank receipt showing prompt transfers for security deposit.',
        evidence_type: 'screenshot',
        file_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
        file_name: 'Deposit_Transfer_Receipt.png',
        file_size: 560000,
        mime_type: 'image/png',
        sha256_hash: '2e85a6a3b2b48d2e85a6a3b2b48d2e85a6a3b2b48d2e85a6a3b2b48d2e85a6a3',
        upload_timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        device_info: { browser: 'Chrome', os: 'Windows 11' },
        ai_tags: ['payment', 'receipt', 'bank'],
        relevance_score: 90,
        authenticity_score: 100,
        is_verified: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(MOCK_EVIDENCE_KEY, JSON.stringify(seedEvidence));
    return seedEvidence;
  }
  return JSON.parse(data);
};

const saveMockEvidence = (list: Evidence[]) => {
  localStorage.setItem(MOCK_EVIDENCE_KEY, JSON.stringify(list));
};

const getMockCustody = (): CustodyLog[] => {
  const data = localStorage.getItem(MOCK_CUSTODY_KEY);
  if (!data) {
    const seedCustody: CustodyLog[] = [
      {
        id: 'mock-cl-1',
        evidence_id: 'mock-ev-1',
        user_id: 'mock-uid-12345',
        action: 'uploaded',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 Chrome/120.0',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(MOCK_CUSTODY_KEY, JSON.stringify(seedCustody));
    return seedCustody;
  }
  return JSON.parse(data);
};

const saveMockCustody = (logs: CustodyLog[]) => {
  localStorage.setItem(MOCK_CUSTODY_KEY, JSON.stringify(logs));
};

export const evidenceService = {
  async fetchEvidence(caseId: string) {
    const { setEvidenceList, setLoading, setError } = useEvidenceStore.getState();

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 400));
      const list = getMockEvidence().filter((e) => e.case_id === caseId);
      setEvidenceList(list);
      return list;
    }

    const { data, error } = await supabase
      .from('evidence')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return [];
    }
    
    const profile = useAuthStore.getState().profile;
    const decryptedData = await Promise.all(
      (data || []).map(async (e: Evidence) => {
        if (profile) {
          if (e.description) e.description = await decryptData(e.description, profile.id);
          if (e.ocr_text) e.ocr_text = await decryptData(e.ocr_text, profile.id);
          if (e.ai_analysis && typeof e.ai_analysis === 'string') {
            try {
              const decryptedAnalysis = await decryptData(e.ai_analysis, profile.id);
              e.ai_analysis = JSON.parse(decryptedAnalysis);
            } catch {
              // fallback if it wasn't encrypted
            }
          }
        }
        return e;
      })
    );

    setEvidenceList(decryptedData);
    return decryptedData;
  },

  async addEvidenceRecord(evidenceData: Omit<Evidence, 'id' | 'created_at' | 'is_verified'>) {
    const { addEvidence, setLoading, setError } = useEvidenceStore.getState();
    const { updateCase } = useCaseStore.getState();

    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      const mockRecord: Evidence = {
        ...evidenceData,
        id: 'mock-ev-' + Math.random().toString(36).substring(2, 9),
        is_verified: true,
        created_at: new Date().toISOString(),
      };

      const all = [mockRecord, ...getMockEvidence()];
      saveMockEvidence(all);
      addEvidence(mockRecord);

      // Increment evidence count in case store
      const cases = useCaseStore.getState().cases;
      const targetCase = cases.find((c) => c.id === evidenceData.case_id);
      if (targetCase) {
        updateCase(evidenceData.case_id, {
          evidence_count: (targetCase.evidence_count || 0) + 1,
        });
      }

      // Add custody log
      await this.logCustodyAction(mockRecord.id, 'uploaded', 'Evidence file successfully uploaded.');
      setLoading(false);
      return mockRecord;
    }

    const profile = useAuthStore.getState().profile;
    
    // Create a copy for the DB
    const payloadToSave: any = { ...evidenceData };
    if (profile) {
      if (payloadToSave.description) {
        payloadToSave.description = await encryptData(payloadToSave.description, profile.id);
      }
      if (payloadToSave.ocr_text) {
        payloadToSave.ocr_text = await encryptData(payloadToSave.ocr_text, profile.id);
      }
      if (payloadToSave.ai_analysis) {
        payloadToSave.ai_analysis = await encryptData(JSON.stringify(payloadToSave.ai_analysis), profile.id);
      }
    }

    const { data, error } = await supabase
      .from('evidence')
      .insert(payloadToSave)
      .select('*')
      .single();

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    const createdEvidence = { ...data, ...evidenceData }; // Return plaintext to store
    addEvidence(createdEvidence);

    // Fetch case and update count
    const { data: caseData } = await supabase
      .from('cases')
      .select('evidence_count')
      .eq('id', evidenceData.case_id)
      .single();

    if (caseData) {
      updateCase(evidenceData.case_id, {
        evidence_count: caseData.evidence_count,
      });
    }

    await this.logCustodyAction(data.id, 'uploaded', 'Evidence file successfully uploaded.');
    return data;
  },

  async logCustodyAction(evidenceId: string, action: CustodyLog['action'], notes?: string) {
    const { addCustodyLog } = useEvidenceStore.getState();
    const profile = useAuthStore.getState().profile;

    if (!profile) return;

    const logData = {
      evidence_id: evidenceId,
      user_id: profile.id,
      action,
      notes,
      ip_address: '192.168.1.1', // Simplified placeholder
      user_agent: navigator.userAgent,
    };

    if (!isSupabaseConfigured()) {
      const mockLog: CustodyLog = {
        ...logData,
        id: 'mock-cl-' + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
      };
      const logs = [mockLog, ...getMockCustody()];
      saveMockCustody(logs);
      addCustodyLog(mockLog);
      return;
    }

    const { data, error } = await supabase
      .from('custody_logs')
      .insert(logData)
      .select('*')
      .single();

    if (!error && data) {
      addCustodyLog(data);
    }
  },

  async fetchCustodyLogs(evidenceId: string) {
    const { setCustodyLogs } = useEvidenceStore.getState();

    if (!isSupabaseConfigured()) {
      const logs = getMockCustody().filter((l) => l.evidence_id === evidenceId);
      setCustodyLogs(logs);
      return logs;
    }

    const { data, error } = await supabase
      .from('custody_logs')
      .select('*')
      .eq('evidence_id', evidenceId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCustodyLogs(data);
    }
    return data || [];
  },

  async deleteEvidence(evidenceId: string, caseId: string) {
    const { removeEvidence, setError } = useEvidenceStore.getState();
    const { updateCase } = useCaseStore.getState();

    if (!isSupabaseConfigured()) {
      const list = getMockEvidence();
      const filtered = list.filter((e) => e.id !== evidenceId);
      saveMockEvidence(filtered);
      removeEvidence(evidenceId);

      const cases = useCaseStore.getState().cases;
      const targetCase = cases.find((c) => c.id === caseId);
      if (targetCase) {
        updateCase(caseId, {
          evidence_count: Math.max((targetCase.evidence_count || 0) - 1, 0),
        });
      }
      return;
    }

    const { error } = await supabase.from('evidence').delete().eq('id', evidenceId);

    if (error) {
      setError(error.message);
      throw new Error(error.message);
    }

    removeEvidence(evidenceId);

    const { data: caseData } = await supabase
      .from('cases')
      .select('evidence_count')
      .eq('id', caseId)
      .single();

    if (caseData) {
      updateCase(caseId, {
        evidence_count: caseData.evidence_count,
      });
    }
  },
};
export default evidenceService;
