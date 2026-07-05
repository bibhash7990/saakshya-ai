import React from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck, Upload, FileText, BadgeAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Activity {
  id: string;
  type: 'upload' | 'verify' | 'cert' | 'alert';
  title: string;
  subtitle: string;
  timestamp: string;
}

export const RecentActivity: React.FC = () => {
  // Mock activity logs
  const activities: Activity[] = [
    {
      id: 'act-1',
      type: 'verify',
      title: 'SHA-256 Verified Locked',
      subtitle: 'RentReceipt_June.pdf - Integrity matching 100%',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    },
    {
      id: 'act-2',
      type: 'upload',
      title: 'Evidence File Uploaded',
      subtitle: 'WhatsApp_Threat_Screenshot.png in Online Scam Case',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'act-3',
      type: 'cert',
      title: 'Section 65B Certificate generated',
      subtitle: 'Aman K. generated for Non-Payment case',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const icons = {
    upload: <Upload className="w-4.5 h-4.5 text-primary-400" />,
    verify: <ShieldCheck className="w-4.5 h-4.5 text-success" />,
    cert: <FileText className="w-4.5 h-4.5 text-accent-500" />,
    alert: <BadgeAlert className="w-4.5 h-4.5 text-danger" />,
  };

  const colors = {
    upload: 'bg-primary-500/10 border-primary-500/20',
    verify: 'bg-success/10 border-success/20',
    cert: 'bg-accent-500/10 border-accent-500/20',
    alert: 'bg-danger/10 border-danger/20',
  };

  return (
    <Card variant="solid" hoverEffect={false} className="p-6 flex flex-col gap-4 border border-border h-full">
      <h3 className="font-bold text-sm text-text-primary select-none">Recent Activity Log</h3>
      <div className="flex flex-col gap-4">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 mt-0.5 ${colors[act.type]}`}>
              {icons[act.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-text-primary truncate">{act.title}</h4>
              <p className="text-[10px] text-text-secondary truncate mt-0.5">{act.subtitle}</p>
            </div>
            <span className="text-[9px] text-text-muted font-mono whitespace-nowrap mt-1">
              {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default RecentActivity;
