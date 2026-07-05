import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useCases } from '@/hooks/useCases';
import { useEvidence } from '@/hooks/useEvidence';
import { EvidenceGallery } from '@/components/evidence/EvidenceGallery';
import { CaptureWizard } from '@/components/evidence/CaptureWizard';
import { EvidenceViewer } from '@/components/evidence/EvidenceViewer';
import { Section65BGenerator } from '@/components/documents/Section65BGenerator';
import { LegalNoticeBuilder } from '@/components/documents/LegalNoticeBuilder';
import { SmartTimeline } from '@/components/timeline/SmartTimeline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, Trash2, ShieldAlert, Sparkles, Scale, FileText, CalendarRange } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';

export const CaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { currentCase, setCurrentCase, fetchCases, deleteCase, updateCase } = useCases();
  const { evidenceList, fetchEvidence, deleteEvidence } = useEvidence();

  const [activeTab, setActiveTab] = useState<'evidence' | 'wizard' | 'timeline' | 'documents'>('evidence');
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaseAndEvidence = async () => {
      if (!caseId) return;
      setLoading(true);
      try {
        const cases = await fetchCases();
        const found = cases.find((c) => c.id === caseId);
        if (found) {
          setCurrentCase(found);
          await fetchEvidence(caseId);
        } else {
          toast.danger('Case not found');
          navigate('/dashboard');
        }
      } catch (err) {
        toast.danger('Failed to load case');
      } finally {
        setLoading(false);
      }
    };
    loadCaseAndEvidence();

    return () => {
      setCurrentCase(null);
    };
  }, [caseId]);

  const handleDeleteCase = async () => {
    if (!caseId) return;
    if (window.confirm('WARNING: Are you sure you want to permanently delete this case vault and ALL its evidence items? This action is irreversible.')) {
      const result = await deleteCase(caseId);
      if (!result.error) {
        toast.success('Case Vault permanently deleted.');
        navigate('/dashboard');
      } else {
        toast.danger(result.error);
      }
    }
  };

  const handleDeleteEvidenceItem = async (evidenceId: string) => {
    if (!caseId) return;
    const result = await deleteEvidence(evidenceId, caseId);
    if (!result.error) {
      toast.success('Evidence item deleted.');
      await fetchEvidence(caseId);
      // Re-fetch cases to sync stats
      await fetchCases();
    } else {
      toast.danger(result.error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-danger border-danger/20 bg-danger/5';
    if (score < 75) return 'text-warning border-warning/20 bg-warning/5';
    return 'text-success border-success/20 bg-success/5';
  };

  if (loading || !currentCase) {
    return (
      <AppLayout title="Case Vault">
        <Loader text="Opening encrypted case vault..." />
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'evidence', label: `Evidence Gallery (${evidenceList.length})`, icon: <FileText className="w-4 h-4" /> },
    { id: 'wizard', label: 'Capture Wizard', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'documents', label: 'Legal Docs', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <AppLayout title={currentCase.title}>
      <div className="flex flex-col gap-6 w-full pb-12">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between w-full select-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('wizard')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Add Evidence
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteCase}
              className="text-danger hover:bg-danger/5"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Case
            </Button>
          </div>
        </div>

        {/* Case Metadata Banner Card */}
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <Badge variant="primary" size="md" className="uppercase font-mono tracking-wider">
                  {currentCase.case_type.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-text-secondary select-none font-bold uppercase tracking-wider">
                  Vault Status: {currentCase.status}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-text-primary mt-1">{currentCase.title}</h1>
              {currentCase.description && (
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-2xl">
                  {currentCase.description}
                </p>
              )}
            </div>

            {/* Score Block */}
            <div className={`p-4 rounded-xl border flex flex-col gap-1 items-center justify-center font-mono ${getScoreColor(currentCase.strength_score)}`}>
              <span className="text-[10px] uppercase font-bold text-text-secondary">AI Vault Strength</span>
              <span className="text-2xl font-bold tracking-tight">{currentCase.strength_score}%</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-1">
            {currentCase.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-text-secondary bg-bg-primary/40 border border-border px-2 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex border-b border-border text-sm font-semibold select-none gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content view */}
        <div className="w-full">
          {activeTab === 'evidence' && (
            <div className="flex flex-col gap-4">
              <EvidenceGallery
                evidenceList={evidenceList}
                onView={setSelectedEvidence}
                onDelete={handleDeleteEvidenceItem}
                onAddEvidence={() => setActiveTab('wizard')}
              />
            </div>
          )}

          {activeTab === 'wizard' && (
            <div className="max-w-2xl mx-auto w-full">
              <CaptureWizard
                caseId={currentCase.id}
                caseType={currentCase.case_type}
                onComplete={async () => {
                  setActiveTab('evidence');
                  await fetchEvidence(currentCase.id);
                  // Update strength score to mock progress
                  const newScore = Math.min(currentCase.strength_score + 15, 100);
                  await updateCase(currentCase.id, { strength_score: newScore });
                  await fetchCases();
                }}
              />
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <Section65BGenerator caseTitle={currentCase.title} evidenceList={evidenceList} />
              <LegalNoticeBuilder caseTitle={currentCase.title} caseDescription={currentCase.description || ''} />
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-3xl mx-auto w-full">
              <SmartTimeline caseId={currentCase.id} evidenceList={evidenceList} />
            </div>
          )}
        </div>

        {/* Full Details popup modal for evidence item */}
        <EvidenceViewer
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      </div>
    </AppLayout>
  );
};
export default CaseDetailPage;
