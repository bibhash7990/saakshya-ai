import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CaseStatusBadge } from '../cases/CaseStatusBadge';
import { FileText, ArrowUpRight, Scale } from 'lucide-react';
import { Case } from '@/types/case.types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

interface CaseCardProps {
  caseItem: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem }) => {
  const navigate = useNavigate();

  const caseTypeIcons = {
    rental_dispute: '🏘️',
    online_fraud: '📱',
    workplace_harassment: '💼',
    consumer_complaint: '🛒',
    medical_negligence: '🏥',
    property_dispute: '🏚️',
    non_payment: '🏦',
    cyber_crime: '🚨',
    domestic_issue: '🏡',
    other: '⚖️',
  };

  const scoreColor = (score: number) => {
    if (score < 40) return 'text-danger border-danger/30 bg-danger/5';
    if (score < 75) return 'text-warning border-warning/30 bg-warning/5';
    return 'text-success border-success/30 bg-success/5';
  };

  return (
    <Card
      onClick={() => navigate(`/cases/${caseItem.id}`)}
      className="p-6 flex flex-col gap-4 relative border border-border group"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="text-2xl w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center select-none border border-border">
            {caseTypeIcons[caseItem.case_type] || '⚖️'}
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-sm text-text-primary group-hover:text-primary-400 transition-colors line-clamp-1">
              {caseItem.title}
            </h3>
            <span className="text-[10px] text-text-muted font-bold tracking-wide uppercase">
              {caseItem.case_type.replace('_', ' ')}
            </span>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-all duration-200" />
      </div>

      {/* Description */}
      {caseItem.description && (
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed h-8">
          {caseItem.description}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {caseItem.tags.map((tag) => (
          <Badge key={tag} variant="neutral" size="sm" className="bg-bg-primary/20 text-[10px] py-0 px-2 font-mono">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Stats footer panel */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <CaseStatusBadge status={caseItem.status} />
          <div className="flex items-center gap-1 text-xs text-text-secondary select-none">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-bold">{caseItem.evidence_count} files</span>
          </div>
        </div>

        {/* Case Strength Indicator */}
        <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-bold font-mono', scoreColor(caseItem.strength_score))}>
          <Scale className="w-3.5 h-3.5" />
          <span>{caseItem.strength_score}%</span>
        </div>
      </div>
    </Card>
  );
};
export default CaseCard;
