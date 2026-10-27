-- ==============================================================================
-- CareerBoost AI — Supabase Database Schema
-- Version: 2.0.0
-- Complete production schema with Row Level Security (RLS) policies,
-- indexed foreign keys, and stored procedure for gamification XP.
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT DEFAULT '',
  headline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  target_role TEXT DEFAULT 'Full Stack Developer',
  experience_level TEXT DEFAULT 'Mid-Level',
  skills TEXT[] DEFAULT '{}',
  resume_text TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Stats & Gamification Table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  resumes_analyzed INTEGER DEFAULT 0,
  interviews_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Resumes & ATS Analyses Table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT,
  ats_score INTEGER NOT NULL DEFAULT 70,
  missing_skills TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Interview Simulations Table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  difficulty TEXT DEFAULT 'intermediate',
  category TEXT DEFAULT 'Full Stack',
  score INTEGER,
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '[]',
  feedbacks JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Jobs Dataset Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Full-time',
  salary_range TEXT DEFAULT '$90,000 - $140,000',
  experience_level TEXT DEFAULT 'Mid-Level',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Saved Job Matches Table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  match_score INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- 7. Career Roadmaps Table
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  skill_level TEXT DEFAULT 'Intermediate',
  current_skills TEXT[] DEFAULT '{}',
  match_percentage INTEGER DEFAULT 50,
  missing_skills TEXT[] DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  theme TEXT DEFAULT 'modern',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Progress Tracking Table
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  completed_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Own user only
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Stats: Own user only
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resumes: Own user only
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Interviews: Own user only
CREATE POLICY "Users can view own interviews" ON interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON interviews FOR DELETE USING (auth.uid() = user_id);

-- Jobs: Public read access
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);

-- Saved Jobs: Own user only
CREATE POLICY "Users can view own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Roadmaps: Own user only
CREATE POLICY "Users can view own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmaps" ON roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roadmaps" ON roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Portfolios: Own user CRUD + Public view of published portfolios
CREATE POLICY "Users can view own portfolio" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolio" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio" ON portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolio" ON portfolios FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view published portfolios" ON portfolios FOR SELECT USING (published = true);

-- Progress: Own user only
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Stored Procedures & Gamification Trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION increment_xp(user_id UUID, amount INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_stats (user_id, xp, level)
  VALUES (user_id, amount, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET xp = user_stats.xp + amount,
                level = FLOOR((user_stats.xp + amount) / 100) + 1,
                updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Indexes for High Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_required_skills ON jobs USING GIN(required_skills);

-- ==============================================================================
-- Curated Initial Jobs Data
-- ==============================================================================
INSERT INTO jobs (title, company, required_skills, preferred_skills, description, location, type, salary_range, experience_level, url)
VALUES
('Frontend Engineer (React / Next.js)', 'Vercel Ecosystem', '{"React", "TypeScript", "Tailwind CSS", "Next.js", "HTML", "CSS"}', '{"GraphQL", "Jest", "Web Vitals"}', 'Develop high-performance, accessible, and responsive user interfaces using React and modern CSS. Collaborate with designers and backend architects to deliver state-of-the-art web applications.', 'Remote', 'Full-time', '$110,000 - $145,000', 'Mid-Level', 'https://example.com/jobs/frontend-engineer'),
('Full Stack Software Engineer', 'ScaleUp SaaS', '{"React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs"}', '{"Docker", "Redis", "Supabase", "AWS"}', 'Design and implement scalable full-stack features from front-of-the-glass React state to relational database schema design and microservices.', 'San Francisco, CA (Hybrid)', 'Full-time', '$130,000 - $165,000', 'Senior', 'https://example.com/jobs/fullstack-engineer'),
('Backend API Engineer', 'CloudData Systems', '{"Node.js", "Express", "PostgreSQL", "Redis", "Docker"}', '{"Kubernetes", "GraphQL", "CI/CD", "Kafka"}', 'Architect and scale backend REST and streaming services. Ensure low latency, high throughput, and reliable database indexing.', 'Remote', 'Full-time', '$120,000 - $150,000', 'Mid-Level', 'https://example.com/jobs/backend-engineer'),
('DevOps & Cloud Engineer', 'InfraCore Technologies', '{"AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux"}', '{"Prometheus", "Grafana", "Bash", "Python"}', 'Manage production cloud infrastructure, automate deployment pipelines, and maintain 99.99% uptime with robust monitoring and security standards.', 'Remote', 'Full-time', '$135,000 - $175,000', 'Senior', 'https://example.com/jobs/devops-engineer'),
('Data Analyst & BI Specialist', 'MetricPulse Analytics', '{"SQL", "Python", "Tableau", "Pandas", "Excel"}', '{"Power BI", "Snowflake", "dbt", "Statistics"}', 'Transform complex product and user telemetry datasets into actionable dashboards, KPIs, and statistical models for executive leadership.', 'New York, NY', 'Full-time', '$95,000 - $125,000', 'Mid-Level', 'https://example.com/jobs/data-analyst'),
('AI/ML Engineer', 'NeuroAI Labs', '{"Python", "PyTorch", "NLP", "FastAPI", "Docker"}', '{"LangChain", "Vector DBs", "RAG", "Transformers"}', 'Integrate state-of-the-art LLMs, fine-tune models, and deploy production inference pipelines for enterprise productivity tools.', 'Seattle, WA (Hybrid)', 'Full-time', '$145,000 - $190,000', 'Senior', 'https://example.com/jobs/ai-engineer'),
('UI/UX Design Engineer', 'StudioCraft Design', '{"Figma", "React", "Tailwind CSS", "CSS Animations", "Accessibility"}', '{"Storybook", "TypeScript", "Design Systems"}', 'Bridge the gap between product design and engineering. Build fluid design systems, micro-interactions, and accessible component libraries.', 'Austin, TX (Hybrid)', 'Full-time', '$105,000 - $135,000', 'Mid-Level', 'https://example.com/jobs/ui-ux-engineer'),
('Cybersecurity Analyst', 'Aegis Defense Systems', '{"Network Security", "Linux", "Python", "Incident Response", "SIEM"}', '{"Penetration Testing", "AWS Security", "SOC2"}', 'Conduct vulnerability assessments, monitor intrusion detection systems, and implement robust access controls across enterprise infrastructure.', 'Remote', 'Full-time', '$115,000 - $150,000', 'Mid-Level', 'https://example.com/jobs/security-analyst')
ON CONFLICT DO NOTHING;