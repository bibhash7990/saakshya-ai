-- Saakshya AI Database Schema & RLS Setup

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  case_type text NOT NULL,
  status text NOT NULL DEFAULT 'collecting',
  strength_score integer DEFAULT 10,
  ai_summary text,
  evidence_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.evidence (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  evidence_type text NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  sha256_hash text NOT NULL,
  upload_timestamp timestamp with time zone NOT NULL,
  device_timestamp timestamp with time zone,
  device_info jsonb,
  gps_location jsonb,
  network_info jsonb,
  ai_tags text[] DEFAULT '{}',
  ai_category text,
  relevance_score integer DEFAULT 50,
  authenticity_score integer DEFAULT 100,
  ocr_text text,
  ai_analysis text, -- Store as encrypted string
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.custody_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id uuid REFERENCES public.evidence(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  ip_address text,
  user_agent text,
  device_info jsonb,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.timeline_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_date timestamp with time zone NOT NULL,
  title text NOT NULL,
  description text,
  linked_evidence_ids text[] DEFAULT '{}',
  is_auto_generated boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custody_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (Users can only see, insert, update, delete their own data)
-- Cases
CREATE POLICY "Users can view own cases" ON public.cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cases" ON public.cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cases" ON public.cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cases" ON public.cases FOR DELETE USING (auth.uid() = user_id);

-- Evidence
CREATE POLICY "Users can view own evidence" ON public.evidence FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evidence" ON public.evidence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own evidence" ON public.evidence FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own evidence" ON public.evidence FOR DELETE USING (auth.uid() = user_id);

-- Custody Logs
CREATE POLICY "Users can view own custody logs" ON public.custody_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own custody logs" ON public.custody_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Timeline Events
CREATE POLICY "Users can view own timeline events" ON public.timeline_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own timeline events" ON public.timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timeline events" ON public.timeline_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own timeline events" ON public.timeline_events FOR DELETE USING (auth.uid() = user_id);

-- 4. Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence-files', 'evidence-files', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS Policies
CREATE POLICY "Users can view own storage files"
ON storage.objects FOR SELECT
USING (auth.uid() = owner AND bucket_id = 'evidence-files');

CREATE POLICY "Users can upload own storage files"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid() = owner AND bucket_id = 'evidence-files');

CREATE POLICY "Users can update own storage files"
ON storage.objects FOR UPDATE
USING (auth.uid() = owner AND bucket_id = 'evidence-files');

CREATE POLICY "Users can delete own storage files"
ON storage.objects FOR DELETE
USING (auth.uid() = owner AND bucket_id = 'evidence-files');
