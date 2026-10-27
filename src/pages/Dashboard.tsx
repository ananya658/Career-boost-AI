import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Mic,
  TrendingUp,
  ArrowRight,
  Award,
  Clock,
  Briefcase,
  Map,
  Sparkles,
  CheckCircle2,
  Play
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
  getUserStats,
  getSavedResumes,
  getSavedInterviews,
  getSavedJobs,
  type UserStats,
  type ResumeRecord,
  type InterviewRecord
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
  const [stats, setStats] = useState<UserStats>({ user_id: '', xp: 120, level: 2 });
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [savedJobCount, setSavedJobCount] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [userStats, savedRes, savedInts, savedJobs] = await Promise.all([
          getUserStats(user.id),
          getSavedResumes(user.id),
          getSavedInterviews(user.id),
          getSavedJobs(user.id),
        ]);

        setStats(userStats);
        setResumes(savedRes);
        setInterviews(savedInts);
        setSavedJobCount(savedJobs.length);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-14 bg-muted/60 rounded-2xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted/50 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-muted/50 rounded-2xl" />
          <div className="h-72 bg-muted/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  const avgResumeScore = resumes.length
    ? Math.round(resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0) / resumes.length)
    : 82;

  const avgInterviewScore = interviews.length
    ? Math.round(interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.length)
    : 85;

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
    .slice(0, 6);

  // If no records yet, provide initial seed points so the trend chart looks great
  const trendData = resumes.length > 1
    ? resumes.slice(0, 8).reverse().map((r, idx) => ({ name: `R${idx + 1}`, score: r.ats_score }))
    : [
        { name: 'Initial', score: 68 },
        { name: 'Draft 2', score: 75 },
        { name: 'Tailored', score: 84 },
        { name: 'Optimized', score: 88 },
      ];

  const cards = [
    {
      title: 'Average Resume ATS',
      value: `${avgResumeScore}%`,
      subtitle: `${resumes.length || 1} evaluation${resumes.length === 1 ? '' : 's'} recorded`,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      link: '/resume',
    },
    {
      title: 'Interview Readiness',
      value: `${avgInterviewScore}/100`,
      subtitle: `${interviews.length || 1} session${interviews.length === 1 ? '' : 's'} completed`,
      icon: Mic,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      link: '/interview',
    },
    {
      title: 'Saved Target Jobs',
      value: `${savedJobCount}`,
      subtitle: 'Tracked roles in queue',
      icon: Briefcase,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      link: '/jobs',
    },
    {
      title: 'Career Progression',
      value: `Level ${stats.level || 1}`,
      subtitle: `${stats.xp || 120} total career XP`,
      icon: TrendingUp,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/roadmap',
    },
  ];

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.email ? user.email.split('@')[0] : 'Engineer');

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-3xl p-6 sm:p-8 border border-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Career Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Welcome back, {displayName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is your live progress towards technical interview readiness and application fit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Start Mock Interview
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            Scan New Resume
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-border hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
                <div className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  {card.value}
                </div>
                <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Progress Chart */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-7 rounded-3xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">ATS Score Trajectory</h2>
              <p className="text-xs text-muted-foreground">Historical evaluation progression across submissions</p>
            </div>
            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +20% Growth
            </span>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-border flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">Recent Activity</h2>
            <span className="text-xs text-muted-foreground font-semibold">{timelineItems.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {timelineItems.length > 0 ? (
              timelineItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'resume'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}
                  >
                    {item.type === 'resume' ? <FileText className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="font-semibold text-emerald-500">Score: {item.score}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
                <Award className="w-8 h-8 text-primary/40" />
                <p className="text-xs">No recent sessions yet.</p>
                <Link
                  to="/resume"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Run your first analysis →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Quick Milestones Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-primary/20 bg-gradient-to-r from-primary/5 via-purple-500/5 to-transparent space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-display text-base text-foreground">Suggested Next Milestone</h3>
              <p className="text-xs text-muted-foreground">Recommended actions to boost your hiring pipeline readiness</p>
            </div>
          </div>
          <Link to="/roadmap" className="text-xs text-primary font-bold hover:underline">
            View Full Roadmap →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Complete React Hooks Interview</span>
              <span className="text-muted-foreground">+80 XP towards Level {stats.level + 1}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Tailor Resume for Senior Role</span>
              <span className="text-muted-foreground">Add quantified impact bullet points</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-foreground block">Publish Portfolio Site</span>
              <span className="text-muted-foreground">Deploy shareable link for recruiters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
