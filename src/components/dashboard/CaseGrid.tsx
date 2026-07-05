import React from 'react';
import { CaseCard } from './CaseCard';
import { Case } from '@/types/case.types';
import { Button } from '../ui/Button';
import { Briefcase, Plus } from 'lucide-react';

interface CaseGridProps {
  cases: Case[];
  onCreateClick: () => void;
}

export const CaseGrid: React.FC<CaseGridProps> = ({ cases, onCreateClick }) => {
  if (cases.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-bg-secondary/20 p-6">
        <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted mb-4 border border-border">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-sm text-text-primary">No cases created yet</h3>
        <p className="text-xs text-text-secondary mt-1 max-w-xs leading-relaxed">
          Create your first evidence vault folder to begin capturing and hash securing your legal proofs.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="mt-4"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create First Vault
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {cases.map((c) => (
        <CaseCard key={c.id} caseItem={c} />
      ))}
    </div>
  );
};
export default CaseGrid;
