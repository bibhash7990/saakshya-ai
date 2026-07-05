import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Evidence, EvidenceType } from '@/types/evidence.types';
import { FileText, Eye, ShieldCheck, Trash2, ShieldAlert } from 'lucide-react';
import { formatBytes } from '@/utils/formatters';

interface EvidenceCardProps {
  evidence: Evidence;
  onView: (ev: Evidence) => void;
  onDelete?: (id: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onView, onDelete }) => {
  const fileTypeEmojis: Record<EvidenceType, string> = {
    screenshot: '📸',
    document: '📄',
    photo: '🖼️',
    video: '🎥',
    audio: '🎵',
    chat_export: '💬',
    email: '✉️',
    file: '📁',
  };

  const handleContainerClick = () => {
    onView(evidence);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to permanently delete this evidence item?')) {
      onDelete(evidence.id);
    }
  };

  return (
    <Card
      onClick={handleContainerClick}
      className="p-5 flex flex-col gap-3 relative border border-border group"
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">
            {fileTypeEmojis[evidence.evidence_type] || '📄'}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h4 className="text-xs font-bold text-text-primary group-hover:text-primary-400 transition truncate pr-4">
              {evidence.title}
            </h4>
            <span className="text-[9px] text-text-muted font-mono truncate">
              {evidence.file_name} ({evidence.file_size ? formatBytes(evidence.file_size) : '0 B'})
            </span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="p-1 text-text-muted hover:text-danger rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {evidence.description && (
        <p className="text-[11px] text-text-secondary line-clamp-2 h-7 leading-relaxed">
          {evidence.description}
        </p>
      )}

      {/* File Hashing Indicator */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/40 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-success">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-bold">SHA-256 Locked</span>
        </div>
        <span className="text-text-muted truncate max-w-[120px]" title={evidence.sha256_hash}>
          {evidence.sha256_hash.substring(0, 12)}...
        </span>
      </div>
    </Card>
  );
};
export default EvidenceCard;
