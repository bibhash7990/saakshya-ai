import React, { useEffect, useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { TimelineEditor } from './TimelineEditor';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { Evidence } from '@/types/evidence.types';
import { Calendar, Plus, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { formatDateLegible } from '@/utils/formatters';

interface SmartTimelineProps {
  caseId: string;
  evidenceList: Evidence[];
}

export const SmartTimeline: React.FC<SmartTimelineProps> = ({ caseId, evidenceList }) => {
  const { events, loading, fetchEvents, createEvent, deleteEvent } = useTimeline();
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    fetchEvents(caseId);
  }, [caseId]);

  const handleAddEvent = async (
    title: string,
    description: string,
    date: string,
    linkedIds: string[]
  ) => {
    return await createEvent(caseId, title, description, date, linkedIds);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this event from the timeline?')) {
      await deleteEvent(id);
    }
  };

  if (loading && events.length === 0) {
    return <Loader text="Assembling event timeline..." />;
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex items-center justify-between w-full select-none flex-shrink-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-text-primary">Smart Incident Timeline</h3>
          <p className="text-xs text-text-secondary">Chronological event flow linking proof logs.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setEditorOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-bg-secondary/15 p-6">
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted mb-3 border border-border">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs text-text-primary select-none">Timeline is empty</h3>
          <p className="text-[10px] text-text-secondary mt-1 max-w-xs leading-relaxed">
            Record key dispute dates or threat milestones to build a visual, court-ready chronicle.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-8 pl-6 border-l border-border/80 ml-3 py-2">
          {events.map((evt) => {
            // Find linked evidence files
            const linkedFiles = evidenceList.filter((e) => evt.linked_evidence_ids.includes(e.id));
            return (
              <div key={evt.id} className="relative group flex flex-col gap-2">
                {/* Timeline vertical node */}
                <span className="absolute -left-8.5 top-0.5 w-5 h-5 rounded-full bg-bg-secondary border-2 border-primary-500 flex items-center justify-center shadow-glow">
                  {evt.is_auto_generated ? (
                    <Sparkles className="w-2.5 h-2.5 text-accent-500 animate-pulse" />
                  ) : (
                    <Calendar className="w-2.5 h-2.5 text-primary-400" />
                  )}
                </span>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-text-muted font-bold tracking-wider font-mono">
                      {formatDateLegible(evt.event_date)}
                    </span>
                    <h4 className="text-xs font-bold text-text-primary leading-tight mt-0.5">
                      {evt.title}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => handleDelete(evt.id, e)}
                    className="p-1 rounded text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {evt.description && (
                  <p className="text-xs text-text-secondary leading-relaxed bg-bg-secondary/30 p-3 rounded-lg border border-border/50 max-w-2xl">
                    {evt.description}
                  </p>
                )}

                {/* Linked evidence indicator stamps */}
                {linkedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {linkedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary-500/10 border border-primary-500/20 text-[9px] font-bold font-mono text-primary-400 select-none"
                      >
                        <LinkIcon className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{file.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <TimelineEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        evidenceList={evidenceList}
        onSubmit={handleAddEvent}
      />
    </div>
  );
};
export default SmartTimeline;
