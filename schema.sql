-- schema.sql
-- Galaxy Fusion: Multi-College Student-Student, Student-Faculty & Student-College Collaboration Hub
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 0. Colleges (Individual Specific College Instances)
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    city TEXT NOT NULL,
    domain TEXT NOT NULL,
    verified_students INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 1. Profiles (extends auth.users, scoped to a specific college)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id TEXT DEFAULT 'GLAU',
    college_name TEXT DEFAULT 'GLA University, Mathura',
    name TEXT NOT NULL,
    roll TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'college_admin')),
    mentor_type TEXT CHECK (mentor_type IN ('Faculty', 'Alumni', 'Expert')),
    expertise TEXT,
    branch TEXT DEFAULT 'CSE',
    year TEXT DEFAULT '3rd Year',
    cgpa TEXT DEFAULT '8.50',
    github_handle TEXT,
    linkedin_handle TEXT,
    looking_for_team BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    certs JSONB DEFAULT '[]'::jsonb,
    resume_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Teammate Requests (Student <-> Student Collaboration: Ask for Teammates)
CREATE TABLE IF NOT EXISTS public.teammate_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT NOT NULL DEFAULT 'GLAU',
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    creator_roll TEXT NOT NULL,
    creator_branch TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Hackathon' CHECK (category IN ('Hackathon', 'Project', 'Startup', 'Competition')),
    description TEXT NOT NULL,
    have_skills JSONB DEFAULT '[]'::jsonb,
    needed_skills JSONB DEFAULT '[]'::jsonb,
     needed_roles TEXT,
    team_size_current INTEGER DEFAULT 1,
    team_size_max INTEGER DEFAULT 4,
    github_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Faculty Research & Mentorship Slots (Student <-> Faculty Collaboration)
CREATE TABLE IF NOT EXISTS public.faculty_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT NOT NULL DEFAULT 'GLAU',
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    faculty_name TEXT NOT NULL,
    department TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Research Lab' CHECK (type IN ('Research Lab', 'Major Project', 'SIH Mentorship', 'Paper Co-Author')),
    description TEXT NOT NULL,
    required_skills JSONB DEFAULT '[]'::jsonb,
    slots INTEGER DEFAULT 2,
    stipend_or_credit TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Skill Groups
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    skill TEXT NOT NULL,
    branch TEXT NOT NULL,
    year TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Group Members (join table)
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- 6. Group Join Requests
CREATE TABLE IF NOT EXISTS public.group_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    roll TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approve', 'decline')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Group Messages (chat)
CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. College Townhall & Suggestions (Student <-> College Collaboration)
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    text TEXT NOT NULL,
    category TEXT DEFAULT 'Infrastructure',
    upvotes INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Approved by Dean', 'In Progress', 'Completed')),
    college_response TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. College Openings & Jobs (Student <-> College Collaboration: Placements, Grants, Internships)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    opening_type TEXT DEFAULT 'Placement Drive' CHECK (opening_type IN ('Placement Drive', 'Campus Internship', 'Incubation Grant', 'Hackathon Nomination')),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    salary TEXT NOT NULL,
    min_cgpa NUMERIC DEFAULT 6.5,
    eligibility TEXT,
    posted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Materials
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'link', 'video', 'image')),
    link TEXT,
    description TEXT,
    file_name TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Projects (GitHub Repositories)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    title TEXT NOT NULL,
    description TEXT,
    github_url TEXT,
    language TEXT DEFAULT 'TypeScript',
    looking_for_contributors BOOLEAN DEFAULT true,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id TEXT DEFAULT 'GLAU',
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Notifications
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
ALTER TABLE public.teammate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_projects ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Profiles: public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: self insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Teammate Requests: public read" ON public.teammate_requests FOR SELECT USING (true);
CREATE POLICY "Teammate Requests: auth insert" ON public.teammate_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Faculty Projects: public read" ON public.faculty_projects FOR SELECT USING (true);
CREATE POLICY "Faculty Projects: auth insert" ON public.faculty_projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Groups: public read" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Groups: auth insert" ON public.groups FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Members: public read" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Members: auth insert" ON public.group_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Requests: read all" ON public.group_join_requests FOR SELECT USING (true);
CREATE POLICY "Requests: auth insert" ON public.group_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Requests: creator update" ON public.group_join_requests FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Messages: read all" ON public.group_messages FOR SELECT USING (true);
CREATE POLICY "Messages: auth insert" ON public.group_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Suggestions: public read" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Suggestions: auth insert" ON public.suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Jobs: public read" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Jobs: auth insert" ON public.jobs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Materials: public read" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Materials: auth insert" ON public.materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Projects: public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Projects: auth insert" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Feedback: auth insert" ON public.feedback FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Notifs: read own" ON public.notifications FOR SELECT USING (auth.uid() = to_user_id);
CREATE POLICY "Notifs: auth insert" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
