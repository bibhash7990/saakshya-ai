import { useState } from 'react';
import { timelineService } from '@/services/timeline.service';
import { TimelineEvent } from '@/types/timeline.types';
import { useToast } from '@/hooks/useToast';

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchEvents = async (caseId: string) => {
    setLoading(true);
    try {
      const data = await timelineService.fetchEvents(caseId);
      setEvents(data);
      return data;
    } catch (err: any) {
      toast.danger(err.message || 'Failed to load timeline events');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (
    caseId: string,
    title: string,
    description: string,
    eventDate: string,
    linkedEvidenceIds: string[] = []
  ) => {
    setLoading(true);
    try {
      const newEvent = await timelineService.createEvent(
        caseId,
        title,
        description,
        eventDate,
        linkedEvidenceIds
      );
      setEvents((prev) =>
        [...prev, newEvent].sort(
          (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        )
      );
      toast.success('Timeline event added successfully!');
      return { data: newEvent, error: null };
    } catch (err: any) {
      toast.danger(err.message || 'Failed to create timeline event');
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await timelineService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success('Timeline event deleted.');
      return { error: null };
    } catch (err: any) {
      toast.danger(err.message || 'Failed to delete timeline event');
      return { error: err.message };
    }
  };

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    deleteEvent,
  };
};
export default useTimeline;
