import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Award,
  Briefcase,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  KeyRound,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, upsertUserProfile, getUserStats, mergeUniqueSkills, type UserStats } from '../lib/database';
import { isSupabaseConfigured } from '../lib/supabase';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Analyst',
  'AI/ML Engineer',
  'UI/UX Design Engineer',
  'Cloud Architect'
];

const EXPERIENCE_LEVELS = ['Junior / Entry Level', 'Mid-Level', 'Senior Level', 'Lead / Staff Engineer'];

export default function ProfileSettings() {
  const { user, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [skills, setSkills] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [profile, userStats] = await Promise.all([
          getUserProfile(user.id),
          getUserStats(user.id),
        ]);

        if (profile) {
          setFullName(profile.full_name || (user.user_metadata?.full_name as string) || (user.email ? user.email.split('@')[0] : ''));
          setHeadline(profile.headline || 'Software Engineer');
          setBio(profile.bio || '');
          setTargetRole(profile.target_role || 'Full Stack Developer');
          setExperienceLevel(profile.experience_level || 'Mid-Level');
          setSkills(profile.skills || ['React', 'TypeScript', 'Node.js']);
          setResumeText(profile.resume_text || '');
        } else {
          setFullName((user.user_metadata?.full_name as string) || (user.email ? user.email.split('@')[0] : ''));
          setHeadline('Software Engineer');
        }

        setStats(userStats);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    void loadProfileData();
  }, [user]);

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    setSkills((prev) => mergeUniqueSkills(prev, [trimmed]));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatusMessage(null);

    try {
      await upsertUserProfile({
        user_id: user.id,
        full_name: fullName.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        target_role: targetRole,
        experience_level: experienceLevel,
        skills,
        resume_text: resumeText.trim(),
      });

      setStatusMessage({ text: 'Profile & preferences saved successfully!', type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Account & Career Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal credentials, target roles, and baseline career preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Level {stats?.level || 1} • {stats?.xp || 0} XP
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            isSupabaseConfigured
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
            <Database className="w-3.5 h-3.5" />
            {isSupabaseConfigured ? 'Supabase Connected' : 'Local Sandbox Mode'}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {statusMessage.text}
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Developer"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed outline-none"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute right-3.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Full Stack Engineer | React & Node.js"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Career Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Brief professional summary about your background and technical passions..."
              className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Role & Seniority Preferences */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" />
            Target Role & Seniority
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Primary Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Core Technical Skills ({skills.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            These skills are used to match jobs, calibrate mock interview questions, and populate your portfolio.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill (e.g. Next.js, Docker, PostgreSQL)"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Master Resume Text */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-500" />
            Master Resume Content (Plain Text)
          </h2>
          <p className="text-xs text-muted-foreground">
            Save your baseline resume text here so Job Matcher and Interview Simulator can pull from it automatically.
          </p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={5}
            placeholder="Paste your raw resume text here to use across tools..."
            className="w-full rounded-xl border border-border bg-background p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile Settings
          </button>

          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 text-sm font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
