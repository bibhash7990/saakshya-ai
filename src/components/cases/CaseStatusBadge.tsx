import React from 'react';
import { Badge } from '../ui/Badge';
import { CaseStatus } from '@/types/case.types';

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

export const CaseStatusBadge: React.FC<CaseStatusBadgeProps> = ({ status }) => {
  const configs = {
    collecting: { label: 'Collecting Proofs', variant: 'warning' as const },
    organized: { label: 'Organized', variant: 'primary' as const },
    certified: { label: 'Certified Locked', variant: 'success' as const },
    submitted: { label: 'Submitted', variant: 'info' as const },
    resolved: { label: 'Resolved Case', variant: 'neutral' as const },
  };

  const config = configs[status] || configs.collecting;

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};
export default CaseStatusBadge;
