import React, { useEffect } from 'react';
import { useEvidence } from '@/hooks/useEvidence';
import { Loader } from '../ui/Loader';
import { Eye, ShieldAlert, FileDigit, Download, ShieldCheck } from 'lucide-react';
import { formatDateLegible } from '@/utils/formatters';

interface ChainOfCustodyProps {
  evidenceId: string;
}

export const ChainOfCustody: React.FC<ChainOfCustodyProps> = ({ evidenceId }) => {
  const { custodyLogs, isLoading, fetchCustodyLogs } = useEvidence();

  useEffect(() => {
    fetchCustodyLogs(evidenceId);
  }, [evidenceId]);

  const icons = {
    uploaded: <UploadIcon />,
    viewed: <Eye className="w-4 h-4 text-text-secondary" />,
    downloaded: <Download className="w-4 h-4 text-warning" />,
    shared: <ShareIcon />,
    verified: <ShieldCheck className="w-4 h-4 text-success" />,
    exported: <FileDigit className="w-4 h-4 text-accent-500" />,
    certificate_generated: <ShieldCheck className="w-4 h-4 text-success" />,
  };

  const actionLabels = {
    uploaded: 'Evidence Captured',
    viewed: 'Evidence Viewed',
    downloaded: 'Evidence Downloaded',
    shared: 'Evidence Shared',
    verified: 'SHA-256 Checksum Verified',
    exported: 'Case Data Exported',
    certificate_generated: 'Section 65B Certificate generated',
  };

  if (isLoading && custodyLogs.length === 0) {
    return <Loader size="sm" text="Retrieving custody trail..." />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h4 className="text-xs font-bold text-text-primary select-none">Chain of Custody Audit Path</h4>
      <div className="relative flex flex-col gap-5 pl-5 border-l border-border/80 ml-2.5">
        {custodyLogs.map((log) => (
          <div key={log.id} className="relative flex flex-col gap-1">
            {/* Timeline node */}
            <span className="absolute -left-7.5 top-0.5 w-5 h-5 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
              {icons[log.action] || <Eye className="w-3.5 h-3.5 text-text-muted" />}
            </span>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-text-primary">
                {actionLabels[log.action] || log.action}
              </span>
              <span className="text-[10px] text-text-muted font-mono">
                {formatDateLegible(log.created_at)}
              </span>
            </div>

            <p className="text-[10px] text-text-secondary leading-relaxed">
              {log.notes || `Activity recorded by client terminal.`}
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-text-muted font-mono mt-0.5">
              {log.ip_address && <span>IP: {log.ip_address}</span>}
              {log.device_info?.os && <span>OS: {log.device_info.os}</span>}
              {log.device_info?.browser && <span>Browser: {log.device_info.browser}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline simple SVG icons to avoid importing missing icons
const UploadIcon = () => (
  <svg className="w-3 h-3 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-3 h-3 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
  </svg>
);
export default ChainOfCustody;
