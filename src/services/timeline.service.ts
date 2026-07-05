import { supabase, isSupabaseConfigured } from './supabase';
import { TimelineEvent } from '@/types/timeline.types';
import { useAuthStore } from '@/store/authStore';

const MOCK_TIMELINE_KEY = 'saakshya_mock_timeline';

const getMockTimeline = (): TimelineEvent[] => {
  const data = localStorage.getItem(MOCK_TIMELINE_KEY);
  if (!data) {
    const seedEvents: TimelineEvent[] = [
      {
        id: 'mock-tle-1',
        case_id: 'mock-case-1',
        user_id: 'mock-uid-12345',
        event_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Rental Agreement Signed',
        description: 'Began official tenancy period. Paid security deposit amount of ₹40,000.',
        linked_evidence_ids: ['mock-ev-1'],
        is_auto_generated: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-tle-2',
        case_id: 'mock-case-1',
        user_id: 'mock-uid-12345',
        event_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Paid June Rent Deposit',
        description: 'Transferred ₹12,000 via IMPS transaction. Confirmation receipt captured.',
        linked_evidence_ids: ['mock-ev-2'],
        is_auto_generated: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(MOCK_TIMELINE_KEY, JSON.stringify(seedEvents));
    return seedEvents;
  }
  return JSON.parse(data);
};

const saveMockTimeline = (events: TimelineEvent[]) => {
  localStorage.setItem(MOCK_TIMELINE_KEY, JSON.stringify(events));
};

export const timelineService = {
  async fetchEvents(caseId: string): Promise<TimelineEvent[]> {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 450));
      return getMockTimeline()
        .filter((e) => e.case_id === caseId)
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    }

    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('case_id', caseId)
      .order('event_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createEvent(
    caseId: string,
    title: string,
    description: string,
    eventDate: string,
    linkedEvidenceIds: string[] = []
  ): Promise<TimelineEvent> {
    const profile = useAuthStore.getState().profile;
    if (!profile) throw new Error('Unauthenticated');

    const newEvent = {
      case_id: caseId,
      user_id: profile.id,
      title,
      description,
      event_date: eventDate,
      linked_evidence_ids: linkedEvidenceIds,
      is_auto_generated: false,
    };

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 400));
      const mockEvent: TimelineEvent = {
        ...newEvent,
        id: 'mock-tle-' + Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
      };
      const all = [...getMockTimeline(), mockEvent];
      saveMockTimeline(all);
      return mockEvent;
    }

    const { data, error } = await supabase
      .from('timeline_events')
      .insert(newEvent)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteEvent(eventId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const all = getMockTimeline();
      saveMockTimeline(all.filter((e) => e.id !== eventId));
      return;
    }

    const { error } = await supabase.from('timeline_events').delete().eq('id', eventId);
    if (error) throw new Error(error.message);
  },
};
export default timelineService;
