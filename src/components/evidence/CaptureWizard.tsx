import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { UploadZone } from './UploadZone';
import { CameraCapture } from './CameraCapture';
import { AudioRecorder } from './AudioRecorder';
import { computeSHA256, getClientMetadata } from '@/utils/hashUtils';
import { useEvidence } from '@/hooks/useEvidence';
import { useToast } from '@/hooks/useToast';
import { CaseType } from '@/types/case.types';
import { Check, Camera, Mic, Upload, FileText, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface CaptureWizardProps {
  caseId: string;
  caseType: CaseType;
  onComplete: () => void;
}

interface StepItem {
  title: string;
  desc: string;
  requiredType: 'screenshot' | 'document' | 'audio' | 'file';
}

export const CaptureWizard: React.FC<CaptureWizardProps> = ({ caseId, caseType, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'camera' | 'audio' | null>(null);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [computingHash, setComputingHash] = useState(false);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const { uploadEvidence, submitting } = useEvidence();
  const toast = useToast();

  // Load case-specific steps
  const getSteps = (): StepItem[] => {
    switch (caseType) {
      case 'online_fraud':
        return [
          { title: 'Transaction Screenshot', desc: 'Capture payment receipt, bank statement, or transaction ledger.', requiredType: 'screenshot' },
          { title: 'Seller Profile Screenshot', desc: 'Capture the scammer\'s profile, Instagram page, or contact ID.', requiredType: 'screenshot' },
          { title: 'Chat/Communication logs', desc: 'Export or screenshot messages showing the deal and promises.', requiredType: 'screenshot' },
          { title: 'Product Listing', desc: 'Capture the original advertisement, link, or product profile.', requiredType: 'screenshot' },
        ];
      case 'rental_dispute':
        return [
          { title: 'Rental Agreement', desc: 'Secure copy of signed rent agreement or lease parameters.', requiredType: 'document' },
          { title: 'Payment confirmations', desc: 'Bank statement or screenshots proving timely rent deposits.', requiredType: 'screenshot' },
          { title: 'Damage photos / notices', desc: 'Capture physical photos of property damage or text messages.', requiredType: 'screenshot' },
        ];
      default:
        return [
          { title: 'Core Supporting Evidence', desc: 'Upload main screenshot, log, or statement document.', requiredType: 'file' },
          { title: 'Secondary verification proof', desc: 'Capture additional document, message thread, or photo.', requiredType: 'file' },
        ];
    }
  };

  const steps = getSteps();
  const progress = (Object.keys(completedSteps).length / steps.length) * 100;
  const currentStepItem = steps[activeStep];

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFileSelected(file);
    setComputingHash(true);
    setComputedHash(null);

    try {
      // Calculate SHA-256 hash using HTML5 Web Crypto API
      const hash = await computeSHA256(file);
      setComputedHash(hash);
      toast.success('SHA-256 Checksum locked successfully!');
    } catch (err) {
      toast.danger('Hash calculation failed.');
    } finally {
      setComputingHash(false);
    }
  };

  const handleUpload = async () => {
    if (!fileSelected || !computedHash) return;

    try {
      const clientMeta = await getClientMetadata();
      const result = await uploadEvidence(
        caseId,
        fileSelected,
        currentStepItem.title,
        currentStepItem.desc,
        currentStepItem.requiredType,
        computedHash,
        clientMeta
      );

      if (result.data) {
        toast.success(`Step "${currentStepItem.title}" secured!`);
        setCompletedSteps({ ...completedSteps, [activeStep]: true });
        handleResetStep();
        if (activeStep < steps.length - 1) {
          setActiveStep(activeStep + 1);
        }
      }
    } catch (err) {
      toast.danger('Upload transaction failed.');
    }
  };

  const handleResetStep = () => {
    setFileSelected(null);
    setComputedHash(null);
    setCaptureMethod(null);
  };

  const handleSkip = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Card variant="solid" hoverEffect={false} className="p-6 flex flex-col gap-6 border border-border w-full">
      {/* Wizard Progress Header */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center select-none">
          <span className="text-[10px] font-bold tracking-wider text-text-secondary uppercase">
            Step {activeStep + 1} of {steps.length}: {currentStepItem.title}
          </span>
          <span className="text-xs font-bold text-primary-400 font-mono">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <ProgressBar value={progress} color="primary" showValue={false} />
      </div>

      {/* Step Info */}
      <div className="p-4 rounded-xl bg-bg-primary/30 border border-border/60">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          {completedSteps[activeStep] ? (
            <span className="w-5 h-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success">
              <Check className="w-3 h-3" />
            </span>
          ) : (
            <span className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center text-xs text-text-secondary font-mono border border-border">
              {activeStep + 1}
            </span>
          )}
          {currentStepItem.title}
        </h3>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed pl-7">
          {currentStepItem.desc}
        </p>
      </div>

      {/* Method selector or active workspace */}
      {!fileSelected && !captureMethod && (
        <div className="flex flex-col gap-3 items-center py-6 border border-dashed border-border rounded-xl bg-bg-primary/20">
          <p className="text-xs text-text-secondary mb-1">Select capture method:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" onClick={() => setCaptureMethod('upload')} leftIcon={<Upload className="w-4 h-4" />}>
              File Upload
            </Button>
            {currentStepItem.requiredType === 'screenshot' ? (
              <Button variant="secondary" onClick={() => setCaptureMethod('camera')} leftIcon={<Camera className="w-4 h-4" />}>
                Live Camera
              </Button>
            ) : null}
            {currentStepItem.requiredType === 'audio' || caseType === 'rental_dispute' ? (
              <Button variant="secondary" onClick={() => setCaptureMethod('audio')} leftIcon={<Mic className="w-4 h-4" />}>
                Voice Record
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Upload Feed */}
      {captureMethod === 'upload' && !fileSelected && (
        <UploadZone onUpload={handleFileSelect} accept={currentStepItem.requiredType === 'screenshot' ? 'image/*' : '*/*'} />
      )}

      {/* Camera Capture Feed */}
      {captureMethod === 'camera' && !fileSelected && (
        <CameraCapture onCapture={(file) => handleFileSelect([file])} onClose={handleResetStep} />
      )}

      {/* Audio Recorder Feed */}
      {captureMethod === 'audio' && !fileSelected && (
        <AudioRecorder onRecordComplete={(file) => handleFileSelect([file])} onClose={handleResetStep} />
      )}

      {/* File verification locking dashboard */}
      {fileSelected && (
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-bg-secondary/40">
          <div className="flex justify-between items-start gap-3 select-none">
            <div className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-text-primary truncate max-w-[200px]">{fileSelected.name}</span>
                <span className="text-[9px] text-text-muted font-mono">{fileSelected.type} | {fileSelected.size ? (fileSelected.size / 1024 / 1024).toFixed(2) : '0'} MB</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetStep} disabled={submitting} className="text-danger p-1">
              Reset File
            </Button>
          </div>

          {/* SHA-256 Locking state */}
          <div className="p-3 bg-bg-primary/50 border border-border/50 rounded-lg flex flex-col gap-1.5">
            <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider font-mono">
              Evidence Cryptographic Footprint
            </span>
            {computingHash ? (
              <div className="flex items-center gap-2 text-xs text-text-secondary select-none py-1">
                <RefreshCw className="w-4 h-4 animate-spin text-primary-500" />
                <span>Locking checksum hash...</span>
              </div>
            ) : computedHash ? (
              <div className="flex items-start gap-2 py-0.5">
                <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-xs font-bold font-mono text-text-primary break-all">
                  {computedHash}
                </span>
              </div>
            ) : null}
          </div>

          <Button variant="accent" onClick={handleUpload} loading={submitting} disabled={!computedHash} className="w-full mt-1">
            Secure Evidence
          </Button>
        </div>
      )}

      {/* Footer wizard navigation */}
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-border/50 select-none">
        <Button
          variant="ghost"
          onClick={() => setActiveStep((s) => Math.max(s - 1, 0))}
          disabled={activeStep === 0 || submitting}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip} disabled={submitting}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Skip Step'}
          </Button>
          {activeStep === steps.length - 1 && (
            <Button variant="primary" onClick={onComplete} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Return to Case
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
export default CaptureWizard;
