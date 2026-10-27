import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Mic,
  Crosshair,
  Compass,
  Globe,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  TrendingUp,
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfile,
  getUserStats,
  getSavedResumes,
  getSavedInterviews,
  getSavedJobs,
  getUserProgress,
  type UserStats,
  type ResumeRecord,
  type InterviewRecord,
  type UserProfile,
  type Progress
} from '../lib/database';

interface TimelineItem {
  id: string;
  type: 'resume' | 'interview';
  title: string;
  score: number;
  date: string;
  link: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ user_id: '', xp: 0, level: 1 });
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const [userProfile, userStats, savedRes, savedInts, savedJobList, userProg] =
          await Promise.all([
            getUserProfile(user.id),
            getUserStats(user.id),
            getSavedResumes(user.id),
            getSavedInterviews(user.id),
            getSavedJobs(user.id),
            getUserProgress(user.id),
          ]);

        if (isMounted) {
          setProfile(userProfile);
          setStats(userStats);
          setResumes(savedRes);
          setInterviews(savedInts);
          setSavedJobs(savedJobList);
          setProgress(userProg);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-16 surface-card rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 surface-card rounded-xl" />
          ))}
        </div>
        <div className="h-64 surface-card rounded-xl" />
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Engineer');

  const targetRole = profile?.target_role || 'Full Stack Developer';

  // Determine the next recommended action based on actual user progression
  const getNextRecommendedAction = () => {
    if (resumes.length === 0) {
      return {
        title: 'Run your initial Resume ATS Benchmark',
        description: 'Upload your resume to extract your tech stack and uncover high-frequency skill gaps.',
        cta: 'Scan Resume',
        link: '/resume',
        icon: FileText,
      };
    }
    if (interviews.length === 0) {
      return {
        title: 'Complete your first timed Mock Interview',
        description: `Practice 3 realistic questions for ${targetRole} with instant STAR feedback.`,
        cta: 'Start Mock Interview',
        link: '/interview',
        icon: Mic,
      };
    }
    if (savedJobs.length === 0) {
      return {
        title: 'Explore matching market positions',
        description: `See how closely your ${profile?.skills?.length || 0} skills align with curated open positions.`,
        cta: 'View Job Matches',
        link: '/jobs',
        icon: Crosshair,
      };
    }
    return {
      title: 'Review and publish your live portfolio',
      description: 'Deploy your verified experience and projects to a recruiter-ready shareable link.',
      cta: 'Open Portfolio Builder',
      link: '/portfolio',
      icon: Globe,
    };
  };

  const nextAction = getNextRecommendedAction();
  const NextActionIcon = nextAction.icon;

  // Real timeline aggregation
  const timelineItems: TimelineItem[] = [
    ...resumes.map((r) => ({
      id: r.id,
      type: 'resume' as const,
      title: r.title,
      score: r.ats_score,
      date: r.created_at || new Date().toISOString(),
      link: '/resume',
    })),
    ...interviews.map((i) => ({
      id: i.id,
      type: 'interview' as const,
      title: `${i.role} (${i.difficulty})`,
      score: i.score,
      date: i.created_at || new Date().toISOString(),
      link: '/interview',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Real trend data (only populated when actual resumes exist)
  const hasRealTrend = resumes.length >= 2;
  const realTrendData = resumes
    .slice(0, 8)
    .reverse()
    .map((r, idx) => ({
      name: `R${idx + 1}`,
      score: r.ats_score,
    }));

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* 1. Header & Primary Recommended Action */}
      <div className="surface-card rounded-2xl border border-border p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="space-y-1">
            <span className="accent-badge text-primary font-bold">
              Engineering Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
              Welcome back, {displayName}.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Target Track: <span className="font-semibold text-foreground">{targetRole}</span> • Level {stats.level} ({stats.xp} XP)
            </p>
          </div>

          <Link
            to="/settings"
            className="text-xs font-mono text-muted-foreground hover:text-foreground self-start sm:self-auto py-1 px-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            Edit Preferences →
          </Link>
        </div>

        {/* Highlighted Next Action Banner */}
        <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <NextActionIcon className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-primary">
                Next Recommended Step
              </span>
              <h2 className="text-base font-bold font-display text-foreground">
                {nextAction.title}
              </h2>
              <p className="text-xs text-muted-foreground max-w-xl">
                {nextAction.description}
              </p>
            </div>
          </div>

          <Link
            to={nextAction.link}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            {nextAction.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Quick Access to Core Tools */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Core Instruments
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            5 Modules Integrated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Tool 1 */}
          <Link
            to="/resume"
            className="surface-card surface-interactive rounded-xl p-4 border border-border flex flex-col justify-between space-y-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Resume Analyzer
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {resumes.length === 0 ? 'Not yet scanned' : `${resumes.length} recorded`}
              </p>
            </div>
          </Link>

          {/* Tool 2 */}
          <Link
            to="/interview"
            className="surface-card surface-interactive rounded-xl p-4 border border-border flex flex-col justify-between space-y-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <Mic className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Interview Simulator
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {interviews.length === 0 ? '0 completed' : `${interviews.length} completed`}
              </p>
            </div>
          </Link>

          {/* Tool 3 */}
          <Link
            to="/jobs"
            className="surface-card surface-interactive rounded-xl p-4 border border-border flex flex-col justify-between space-y-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Job Matcher
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {savedJobs.length === 0 ? 'Browse positions' : `${savedJobs.length} saved`}
              </p>
            </div>
          </Link>

          {/* Tool 4 */}
          <Link
            to="/roadmap"
            className="surface-card surface-interactive rounded-xl p-4 border border-border flex flex-col justify-between space-y-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Career Roadmap
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {progress?.completed_skills?.length || 0} skills verified
              </p>
            </div>
          </Link>

          {/* Tool 5 */}
          <Link
            to="/portfolio"
            className="surface-card surface-interactive rounded-xl p-4 border border-border flex flex-col justify-between space-y-3 group col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center">
              <Globe className="w-4 h-4 text-pink-500" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                Portfolio Builder
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                Ready to deploy
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Analytics & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real Progress or Clean Setup Guide */}
        <div className="lg:col-span-7 surface-card rounded-2xl border border-border p-6 space-y-4">
          {hasRealTrend ? (
            <>
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    ATS Score Trajectory
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Progression across your {resumes.length} uploaded revisions
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-primary">
                  Latest: {resumes[0]?.ats_score}%
                </span>
              </div>

              <div className="h-[220px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                    <XAxis
                      dataKey="name"
                      stroke="currentColor"
                      className="text-xs text-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-xs text-muted-foreground"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-display font-bold text-base text-foreground">
                  Getting Started Checklist
                </h3>
                <p className="text-xs text-muted-foreground">
                  Follow the structured sequence to build your verified application profile
                </p>
              </div>

              <div className="space-y-2.5">
                <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  resumes.length > 0 ? 'bg-card border-border/70 text-muted-foreground' : 'bg-primary/[0.04] border-primary/30 text-foreground'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${resumes.length > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className="font-medium">1. Scan & Benchmark Resume</span>
                  </div>
                  <Link to="/resume" className="text-xs font-semibold text-primary hover:underline">
                    {resumes.length > 0 ? 'View' : 'Start →'}
                  </Link>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  interviews.length > 0 ? 'bg-card border-border/70 text-muted-foreground' : 'bg-card border-border text-foreground'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${interviews.length > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                    <span className="font-medium">2. Complete 1 Mock Interview Session</span>
                  </div>
                  <Link to="/interview" className="text-xs font-semibold text-primary hover:underline">
                    {interviews.length > 0 ? 'View' : 'Start →'}
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs text-foreground">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">3. Publish Verified Recruiter Portfolio</span>
                  </div>
                  <Link to="/portfolio" className="text-xs font-semibold text-primary hover:underline">
                    Build →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Genuine Activity Feed */}
        <div className="lg:col-span-5 surface-card rounded-2xl border border-border p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-display font-bold text-base text-foreground">
              Recent Activity
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              {timelineItems.length} records
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {timelineItems.length > 0 ? (
              timelineItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-card border border-border flex items-center justify-center shrink-0 mt-0.5">
                      {item.type === 'resume' ? (
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-foreground shrink-0">
                    {item.score}%
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
                <Clock className="w-6 h-6 text-muted-foreground/60" />
                <p className="text-xs">No activity logged yet.</p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Your resume evaluations and completed mock interviews will be recorded here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
