-- schema.sql
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    roll TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor')),
    mentor_type TEXT CHECK (mentor_type IN ('Faculty', 'Alumni', 'Expert')),
    expertise TEXT,
    profile_image_url TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    certs JSONB DEFAULT '[]'::jsonb,
    resume_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Skill Groups
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Group Members (join table)
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- 4. Group Join Requests
CREATE TABLE IF NOT EXISTS public.group_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    roll TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approve', 'decline')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Group Messages (chat)
CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Suggestions
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Jobs
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    salary TEXT NOT NULL,
    eligibility TEXT,
    posted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Materials
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'link', 'video', 'image')),
    link TEXT,
    description TEXT,
    file_name TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    github_url TEXT,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_user_id UUID NOT NULL REFERENCES public.profiles(id),
    from_user_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'mentor_msg',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: read all, insert/update own
CREATE POLICY "Profiles: public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: self insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Groups: read all, create if authenticated
CREATE POLICY "Groups: public read" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Groups: auth insert" ON public.groups FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Group Members: read all, insert if authenticated
CREATE POLICY "Members: public read" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Members: auth insert" ON public.group_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Join Requests: read own groups, insert if authenticated
CREATE POLICY "Requests: read all" ON public.group_join_requests FOR SELECT USING (true);
CREATE POLICY "Requests: auth insert" ON public.group_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Requests: creator update" ON public.group_join_requests FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Group Messages: read if member, insert if member
CREATE POLICY "Messages: read all" ON public.group_messages FOR SELECT USING (true);
CREATE POLICY "Messages: auth insert" ON public.group_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Suggestions: read all, insert if auth
CREATE POLICY "Suggestions: public read" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Suggestions: auth insert" ON public.suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Jobs: read all, insert if auth
CREATE POLICY "Jobs: public read" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Jobs: auth insert" ON public.jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Materials: read all, insert if auth
CREATE POLICY "Materials: public read" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Materials: auth insert" ON public.materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Projects: read all, insert own
CREATE POLICY "Projects: public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Projects: auth insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback: insert only
CREATE POLICY "Feedback: auth insert" ON public.feedback FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: read own, insert if auth
CREATE POLICY "Notifs: read own" ON public.notifications FOR SELECT USING (auth.uid() = to_user_id);
CREATE POLICY "Notifs: auth insert" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ==================== REALTIME ====================
-- Enable realtime for group_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- ==================== AUTO-CREATE PROFILE TRIGGER ====================
-- This trigger auto-creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, roll, role, mentor_type, expertise)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'roll', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        NULLIF(NEW.raw_user_meta_data->>'mentor_type', ''),
        NULLIF(NEW.raw_user_meta_data->>'expertise', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
