import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Evidence } from '@/types/evidence.types';
import { useToast } from '@/hooks/useToast';

interface TimelineEditorProps {
  open: boolean;
  onClose: () => void;
  evidenceList: Evidence[];
  onSubmit: (title: string, description: string, date: string, linkedIds: string[]) => Promise<any>;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  open,
  onClose,
  evidenceList,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedEvIds, setSelectedEvIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  const handleToggleSelect = (id: string) => {
    setSelectedEvIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !eventDate) {
      setError('Please enter a title and select a date.');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(title, description, eventDate, selectedEvIds);
    setSubmitting(false);

    if (!result.error) {
      // Reset form
      setTitle('');
      setDescription('');
      setEventDate('');
      setSelectedEvIds([]);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Incident Timeline Event"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Add Event
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
        <Input
          type="text"
          label="Event Summary"
          placeholder="e.g. Landlord verbally threatened lockout"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          disabled={submitting}
          required
        />

        <Input
          type="datetime-local"
          label="Event Date & Time"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          disabled={submitting}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-text-secondary select-none font-medium">
            Details / Explanations
          </label>
          <textarea
            placeholder="Provide context on what happened..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            className="w-full bg-bg-secondary text-text-primary border border-border focus:border-primary-500 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none transition-all"
          />
        </div>

        {evidenceList.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-secondary select-none">
              Link Supporting Evidence (Optional):
            </span>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto scrollbar-thin">
              {evidenceList.map((e) => {
                const isSelected = selectedEvIds.includes(e.id);
                return (
                  <div
                    key={e.id}
                    onClick={() => handleToggleSelect(e.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-border bg-bg-primary/20 hover:border-border-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded border-border text-primary-500 focus:ring-primary-500"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary truncate max-w-[200px]">{e.title}</span>
                      <span className="text-[9px] text-text-muted font-mono">{e.file_name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
export default TimelineEditor;
