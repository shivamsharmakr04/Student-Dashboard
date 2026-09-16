-- EduPulse Student Profiles Real-time Authorization & Preferences Schema

-- 1. Create Profiles Table synced with Supabase Auth Users
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies: Allow users to view and update their own profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Enable Supabase Realtime Replication on Profiles Table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
