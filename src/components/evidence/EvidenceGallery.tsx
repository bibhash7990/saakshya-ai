import React from 'react';
import { Evidence } from '@/types/evidence.types';
import { EvidenceCard } from './EvidenceCard';
import { FileText } from 'lucide-react';

interface EvidenceGalleryProps {
  evidenceList: Evidence[];
  onView: (ev: Evidence) => void;
  onDelete?: (id: string) => void;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  evidenceList,
  onView,
  onDelete,
}) => {
  if (evidenceList.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-bg-secondary/10 p-6">
        <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted mb-3 border border-border">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-xs text-text-primary select-none">No evidence secured yet</h3>
        <p className="text-[10px] text-text-secondary mt-1 max-w-xs leading-relaxed">
          Upload screenshots, photos, or record voice notes using the wizard tools to lock down your proofs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
      {evidenceList.map((ev) => (
        <EvidenceCard key={ev.id} evidence={ev} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  );
};
export default EvidenceGallery;
