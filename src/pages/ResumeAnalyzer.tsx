import { useEffect, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Target,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  calculateResumeScore,
  parseJobDescriptionSkills,
  parseResume,
  recommendMissingSkills,
  type ParsedResume,
} from '../lib/resumeParser';
import {
  getUserProfile,
  mergeUniqueSkills,
  upsertUserProfile,
  getSavedResumes,
  saveResumeRecord,
  deleteResumeRecord,
  type ResumeRecord
} from '../lib/database';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Data Analyst',
];

export default function ResumeAnalyzer() {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const [analyses, setAnalyses] = useState<ResumeRecord[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<{
    score: number;
    parsed: ParsedResume;
    missingSkills: string[];
    title: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const [profile, saved] = await Promise.all([
          getUserProfile(user.id),
          getSavedResumes(user.id),
        ]);

        if (isMounted) {
          if (profile?.resume_text) {
            setResumeText(profile.resume_text);
          }
          if (profile?.target_role) {
            setTargetRole(profile.target_role);
          }
          setAnalyses(saved);

          if (saved.length > 0) {
            const first = saved[0];
            const parsed = parseResume(first.content, first.target_role || 'Full Stack Developer');
            setActiveAnalysis({
              score: first.ats_score,
              parsed,
              missingSkills: first.missing_skills || [],
              title: first.title,
            });
          }
        }
      } catch (err) {
        console.error('Error loading resume history:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some((ext) => selected.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT resume.');
      return;
    }

    setError(null);
    setFile(selected);
  };

  const extractTextFromFile = async (f: File): Promise<string> => {
    if (token && (f.type === 'application/pdf' || f.name.endsWith('.docx'))) {
      const formData = new FormData();
      formData.append('file', f);

      try {
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          const payload = (await response.json()) as { text?: string };
          if (payload.text) return payload.text;
        }
      } catch {
        // Fall back to plain text read
      }
    }

    return await f.text();
  };

  const handleAnalyze = async () => {
    if (!user) return;

    setAnalyzing(true);
    setError(null);

    try {
      let content = '';
      let title = `Resume - ${new Date().toLocaleDateString()}`;

      if (activeTab === 'paste') {
        content = resumeText.trim();
      } else if (file) {
        title = file.name;
        content = (await extractTextFromFile(file)).trim();
      }

      if (!content || content.length < 50) {
        throw new Error('Please provide at least 50 characters of resume text or upload a valid file.');
      }

      const parsed = parseResume(content, targetRole);
      const atsScore = calculateResumeScore(parsed, targetRole);
      const jdSkills = jobDescription.trim() ? parseJobDescriptionSkills(jobDescription) : [];
      const missingSkills = jdSkills.length ? recommendMissingSkills(parsed.skills, jdSkills) : [];

      const record: Omit<ResumeRecord, 'user_id'> = {
        id: crypto.randomUUID(),
        title,
        content,
        target_role: targetRole,
        ats_score: atsScore,
        missing_skills: missingSkills,
        strengths: parsed.strengths,
        suggestions: parsed.suggestions,
        created_at: new Date().toISOString(),
      };

      const saved = await saveResumeRecord(user.id, record);
      setAnalyses((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);

      setActiveAnalysis({
        score: atsScore,
        parsed,
        missingSkills,
        title,
      });

      // Sync user profile
      const profile = await getUserProfile(user.id);
      await upsertUserProfile({
        user_id: user.id,
        resume_text: content,
        target_role: targetRole,
        skills: mergeUniqueSkills(profile?.skills ?? [], parsed.skills),
      });

      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during resume analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteResumeRecord(user.id, id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (activeAnalysis?.title && analyses.length <= 1) {
      setActiveAnalysis(null);
    }
  };

  const handleCopyBullet = (bullet: string, idx: number) => {
    void navigator.clipboard.writeText(bullet);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Resume Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scan your resume against modern ATS filters, identify missing skills, and generate quantifiable bullet points.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="surface-card rounded-2xl p-6 border border-border space-y-5">
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Target Job Profile
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
              >
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Input Mode Tabs */}
            <div className="flex rounded-xl bg-muted/60 p-1 border border-border text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'paste' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'upload' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Upload File (PDF / DOCX)
              </button>
            </div>

            {activeTab === 'paste' ? (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Resume Content
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={8}
                  placeholder="Paste your complete resume text here (Summary, Skills, Work Experience, Education)..."
                  className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelection}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-muted/20"
                >
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold text-foreground">
                    {file ? file.name : 'Click to upload PDF, DOCX, or TXT'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Maximum file size: 5 MB</p>
                </div>
              </div>
            )}

            {/* Optional Job Description */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                Target Job Description (Optional for gap analysis)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="Paste the job posting description here to calculate precise keyword matching..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="button"
              disabled={analyzing}
              onClick={handleAnalyze}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? 'Evaluating Resume Content...' : 'Run ATS Evaluation'}
            </button>
          </div>

          {/* Past Analyses History */}
          {analyses.length > 0 && (
            <div className="surface-card rounded-2xl p-5 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Past Analyses ({analyses.length})</h3>
                <span className="text-[11px] text-muted-foreground font-mono">Saved</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {analyses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      const parsed = parseResume(a.content, a.target_role || 'Full Stack Developer');
                      setActiveAnalysis({
                        score: a.ats_score,
                        parsed,
                        missingSkills: a.missing_skills || [],
                        title: a.title,
                      });
                    }}
                    className="p-3 rounded-lg bg-muted/40 hover:bg-muted cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground truncate block">{a.title}</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {new Date(a.created_at || '').toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-500 font-mono">{a.ats_score}%</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDelete(a.id);
                        }}
                        className="p-1 hover:text-destructive text-muted-foreground transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Results View */}
        <div className="lg:col-span-7 space-y-6">
          {activeAnalysis ? (
            <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border space-y-8">
              {/* ATS Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">ATS Evaluation</span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{activeAnalysis.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Calibrated for {targetRole}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                        activeAnalysis.score >= 80
                          ? 'text-emerald-500'
                          : activeAnalysis.score >= 60
                          ? 'text-amber-500'
                          : 'text-destructive'
                      }`}
                    >
                      {activeAnalysis.score}%
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">ATS Compatibility</span>
                  </div>
                </div>
              </div>

              {/* Section Health Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Skills Detected</span>
                  <span className="text-lg font-bold font-display text-primary">{activeAnalysis.parsed.skills.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Action Verbs</span>
                  <span className="text-lg font-bold font-display text-emerald-500">{activeAnalysis.parsed.experience.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Quantified Metrics</span>
                  <span className="text-lg font-bold font-display text-purple-500">{activeAnalysis.parsed.metricsFound.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Education Status</span>
                  <span className="text-lg font-bold font-display text-amber-500">
                    {activeAnalysis.parsed.education.length ? 'Verified' : 'Missing'}
                  </span>
                </div>
              </div>

              {/* Detected Skills Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold font-display text-foreground">Identified Technical Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeAnalysis.parsed.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills against JD if provided */}
              {activeAnalysis.missingSkills.length > 0 && (
                <div className="space-y-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-xs font-bold text-rose-500">Keywords in Job Description Missing from Resume</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeAnalysis.missingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Actionable Suggestions */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Detected Strengths
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground pl-5 list-disc">
                    {activeAnalysis.parsed.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                  <span className="font-bold text-blue-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Recommendations for ATS Rank
                  </span>
                  <ul className="space-y-1.5 text-muted-foreground pl-5 list-disc">
                    {activeAnalysis.parsed.suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improved Bullet-Point Drafts */}
              {activeAnalysis.parsed.improvedBullets.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Suggested High-Impact Bullet Points (Ready to Copy)
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {activeAnalysis.parsed.improvedBullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-muted/40 border border-border/70 flex items-start justify-between gap-3 text-xs leading-relaxed group"
                      >
                        <p className="text-foreground">{bullet}</p>
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet, idx)}
                          className="shrink-0 p-1.5 rounded-lg border border-border hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedBulletIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="surface-card rounded-2xl p-12 text-center text-muted-foreground space-y-4 border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-semibold text-foreground">No Resume Analyzed Yet</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Paste your resume text or upload a PDF/DOCX file on the left to view your ATS compatibility score and bullet suggestions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
