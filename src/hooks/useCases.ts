import { useCaseStore } from '@/store/caseStore';
import { casesService } from '@/services/cases.service';
import { useState } from 'react';
import { CaseType } from '@/types/case.types';

export const useCases = () => {
  const { cases, currentCase, isLoading, error, setCurrentCase } = useCaseStore();
  const [submitting, setSubmitting] = useState(false);

  const fetchCases = async () => {
    return await casesService.fetchCases();
  };

  const createCase = async (title: string, description: string, caseType: CaseType, tags: string[] = []) => {
    setSubmitting(true);
    try {
      const newCase = await casesService.createCase(title, description, caseType, tags);
      setSubmitting(false);
      return { data: newCase, error: null };
    } catch (err: any) {
      setSubmitting(false);
      return { data: null, error: err.message || 'Failed to create case' };
    }
  };

  const updateCase = async (caseId: string, updates: any) => {
    setSubmitting(true);
    try {
      await casesService.updateCase(caseId, updates);
      setSubmitting(false);
      return { error: null };
    } catch (err: any) {
      setSubmitting(false);
      return { error: err.message || 'Failed to update case' };
    }
  };

  const deleteCase = async (caseId: string) => {
    setSubmitting(true);
    try {
      await casesService.deleteCase(caseId);
      setSubmitting(false);
      return { error: null };
    } catch (err: any) {
      setSubmitting(false);
      return { error: err.message || 'Failed to delete case' };
    }
  };

  return {
    cases,
    currentCase,
    isLoading,
    submitting,
    error,
    setCurrentCase,
    fetchCases,
    createCase,
    updateCase,
    deleteCase,
  };
};
