import { useState } from 'react';
import { useEvidenceStore } from '@/store/evidenceStore';
import { evidenceService } from '@/services/evidence.service';
import { storageService } from '@/services/storage.service';
import { useToast } from '@/hooks/useToast';
import type { EvidenceType } from '@/types/evidence.types';
import { useAuthStore } from '@/store/authStore';

export const useEvidence = () => {
  const { evidenceList, custodyLogs, isLoading, error } = useEvidenceStore();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const fetchEvidence = async (caseId: string) => {
    return await evidenceService.fetchEvidence(caseId);
  };

  const uploadEvidence = async (
    caseId: string,
    file: File,
    title: string,
    description: string,
    evidenceType: EvidenceType,
    hash: string,
    metadata: any
  ) => {
    setSubmitting(true);
    try {
      const profile = useAuthStore.getState().profile;
      if (!profile) throw new Error('User not logged in');

      // 1. Upload to storage
      const storagePath = `${profile.id}/${caseId}/${Date.now()}_${file.name}`;
      const uploadRes = await storageService.uploadFile('evidence-files', storagePath, file);

      if (uploadRes.error) {
        throw new Error(uploadRes.error);
      }

      // 2. Create database record
      const evidenceRecord = {
        case_id: caseId,
        user_id: profile.id,
        title,
        description,
        evidence_type: evidenceType,
        file_url: uploadRes.url || '',
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        sha256_hash: hash,
        device_timestamp: new Date().toISOString(),
        device_info: {
          browser: metadata.browser || 'Browser',
          os: metadata.os || 'OS',
          userAgent: navigator.userAgent,
        },
        gps_location: metadata.gps || undefined,
        ai_tags: [],
        relevance_score: 50, // default placeholder
        authenticity_score: 100, // default placeholder
        upload_timestamp: new Date().toISOString(),
      };

      const record = await evidenceService.addEvidenceRecord(evidenceRecord);
      setSubmitting(false);
      return { data: record, error: null };
    } catch (err: any) {
      setSubmitting(false);
      toast.danger(err.message || 'Upload failed');
      return { data: null, error: err.message || 'Upload failed' };
    }
  };

  const deleteEvidence = async (evidenceId: string, caseId: string) => {
    setSubmitting(true);
    try {
      await evidenceService.deleteEvidence(evidenceId, caseId);
      setSubmitting(false);
      return { error: null };
    } catch (err: any) {
      setSubmitting(false);
      return { error: err.message || 'Delete failed' };
    }
  };

  const fetchCustodyLogs = async (evidenceId: string) => {
    return await evidenceService.fetchCustodyLogs(evidenceId);
  };

  const logCustodyAction = async (evidenceId: string, action: any, notes?: string) => {
    await evidenceService.logCustodyAction(evidenceId, action, notes);
  };

  return {
    evidenceList,
    custodyLogs,
    isLoading,
    submitting,
    error,
    fetchEvidence,
    uploadEvidence,
    deleteEvidence,
    fetchCustodyLogs,
    logCustodyAction,
  };
};
export default useEvidence;
