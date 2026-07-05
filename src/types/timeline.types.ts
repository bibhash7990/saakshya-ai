export interface TimelineEvent {
  id: string;
  case_id: string;
  user_id: string;
  event_date: string;
  title: string;
  description?: string;
  linked_evidence_ids: string[];
  is_auto_generated: boolean;
  created_at: string;
}
