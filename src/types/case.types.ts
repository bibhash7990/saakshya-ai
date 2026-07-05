export type CaseType =
  | 'rental_dispute'
  | 'online_fraud'
  | 'workplace_harassment'
  | 'consumer_complaint'
  | 'medical_negligence'
  | 'property_dispute'
  | 'non_payment'
  | 'cyber_crime'
  | 'domestic_issue'
  | 'other';

export type CaseStatus = 'collecting' | 'organized' | 'certified' | 'submitted' | 'resolved';

export interface Case {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  case_type: CaseType;
  status: CaseStatus;
  strength_score: number;
  ai_summary?: string;
  evidence_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}
