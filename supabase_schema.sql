-- ==============================================================================
-- EduPulse Real-Time Database & Authorization Schema
-- ==============================================================================

-- 1. PROFILES TABLE (Synced with Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  student_id TEXT,
  major TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{
    "preferred_tracks": ["Web Development", "Computer Science"],
    "learning_goal_hours": 10,
    "study_mode": "Project-Based",
    "email_assignments": true,
    "email_exams": true,
    "email_announcements": true,
    "push_alerts": false,
    "theme": "light"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  progress INT DEFAULT 0,
  icon_name TEXT DEFAULT 'BookOpen',
  instructor TEXT,
  total_lessons INT DEFAULT 20,
  completed_lessons INT DEFAULT 0,
  color_gradient TEXT DEFAULT 'from-blue-600 to-indigo-600',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  course_code TEXT NOT NULL,
  course_name TEXT NOT NULL,
  due_date TEXT NOT NULL,
  due_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  weightage INT DEFAULT 10,
  max_score INT DEFAULT 100,
  earned_score INT,
  submission_date TEXT,
  file_format TEXT,
  description TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SCHEDULE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  course_code TEXT NOT NULL,
  type TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  day TEXT NOT NULL,
  location TEXT,
  instructor TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_url TEXT,
  color TEXT DEFAULT 'from-blue-600 to-indigo-600',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & anon users for demo/testing
CREATE POLICY "Public read access for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public write access for profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public write access for courses" ON public.courses FOR ALL USING (true);

CREATE POLICY "Public read access for assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public write access for assignments" ON public.assignments FOR ALL USING (true);

CREATE POLICY "Public read access for schedule_events" ON public.schedule_events FOR SELECT USING (true);
CREATE POLICY "Public write access for schedule_events" ON public.schedule_events FOR ALL USING (true);

CREATE POLICY "Public read access for activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Public write access for activity_logs" ON public.activity_logs FOR ALL USING (true);

-- ==============================================================================
-- ENABLE REALTIME WEBSOCKET REPLICATION FOR ALL TABLES
-- ==============================================================================
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE 
  public.profiles, 
  public.courses, 
  public.assignments, 
  public.schedule_events, 
  public.activity_logs;
