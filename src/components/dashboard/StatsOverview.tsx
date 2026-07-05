import React from 'react';
import { Card } from '../ui/Card';
import { Briefcase, ShieldAlert, BadgeCheck, FileText } from 'lucide-react';
import { Case } from '@/types/case.types';

interface StatsOverviewProps {
  cases: Case[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ cases }) => {
  const totalCases = cases.length;
  const activeCases = cases.filter((c) => c.status !== 'resolved').length;
  const totalEvidence = cases.reduce((acc, c) => acc + c.evidence_count, 0);

  // Calculate average case strength score
  const avgScore =
    totalCases > 0
      ? Math.round(cases.reduce((acc, c) => acc + c.strength_score, 0) / totalCases)
      : 0;

  const stats = [
    {
      title: 'Total Active Cases',
      value: activeCases,
      subtitle: `${totalCases} total created`,
      icon: <Briefcase className="w-5 h-5 text-primary-400" />,
      color: 'bg-primary-500/10 border-primary-500/20',
    },
    {
      title: 'Secured Evidence',
      value: totalEvidence,
      subtitle: 'SHA-256 verified logs',
      icon: <FileText className="w-5 h-5 text-accent-500" />,
      color: 'bg-accent-500/10 border-accent-500/20',
    },
    {
      title: 'Average Vault Strength',
      value: `${avgScore}%`,
      subtitle: avgScore > 75 ? 'Excellent integrity' : 'Needs more evidence',
      icon: <BadgeCheck className="w-5 h-5 text-success" />,
      color: 'bg-success/10 border-success/20',
    },
    {
      title: 'Evidence Gaps flagged',
      value: cases.filter((c) => c.strength_score < 50).length,
      subtitle: 'Needs attention soon',
      icon: <ShieldAlert className="w-5 h-5 text-danger" />,
      color: 'bg-danger/10 border-danger/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((s, idx) => (
        <Card variant="solid" hoverEffect={false} key={idx} className="p-5 flex items-center justify-between border border-border">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-text-secondary select-none">
              {s.title}
            </span>
            <span className="text-2xl font-bold text-text-primary tracking-tight leading-none">
              {s.value}
            </span>
            <span className="text-[10px] text-text-muted font-bold tracking-wide mt-0.5">
              {s.subtitle}
            </span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-center ${s.color}`}>
            {s.icon}
          </div>
        </Card>
      ))}
    </div>
  );
};
export default StatsOverview;
