export type EvidenceType =
  | 'screenshot'
  | 'document'
  | 'photo'
  | 'video'
  | 'audio'
  | 'chat_export'
  | 'email'
  | 'file';

export interface Evidence {
  id: string;
  case_id: string;
  user_id: string;
  title: string;
  description?: string;
  evidence_type: EvidenceType;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  sha256_hash: string;
  upload_timestamp: string;
  device_timestamp?: string;
  device_info: {
    browser?: string;
    os?: string;
    userAgent?: string;
  };
  gps_location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  network_info?: {
    ip?: string;
    type?: string;
  };
  ai_tags: string[];
  ai_category?: string;
  relevance_score: number;
  authenticity_score: number;
  ocr_text?: string;
  ai_analysis?: any;
  is_verified: boolean;
  created_at: string;
}

export type CustodyAction =
  | 'uploaded'
  | 'viewed'
  | 'downloaded'
  | 'shared'
  | 'verified'
  | 'exported'
  | 'certificate_generated';

export interface CustodyLog {
  id: string;
  evidence_id: string;
  user_id: string;
  action: CustodyAction;
  ip_address?: string;
  user_agent?: string;
  device_info?: any;
  notes?: string;
  created_at: string;
}
