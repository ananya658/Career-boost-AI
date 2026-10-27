import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Building,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  X,
  Bookmark,
  BookmarkCheck,
  FileText,
  Upload,
  Sparkles,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  matchJobs,
  calculateMatch,
  type MatchResult
} from '../lib/jobMatcher';
import { sampleJobs } from '../lib/jobsData';
import {
  getUserProfile,
  mergeUniqueSkills,
  upsertUserProfile,
  getSavedJobs,
  toggleSaveJob,
  awardXp
} from '../lib/database';
import { extractSkillsFromText } from '../lib/skills';

const ROLES = [
  'All Roles',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Analyst',
  'AI Product Engineer',
  'Mobile Developer'
];

export default function JobMatcher() {
  const { user, token } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'curated' | 'custom' | 'saved'>('curated');

  // Profile & resume inputs
  const [resumeText, setResumeText] = useState('');
  const [manualSkillInput, setManualSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [yearsExperience, setYearsExperience] = useState('1-3 Years');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Custom Job Description Mode
  const [customJobTitle, setCustomJobTitle] = useState('Target Senior Engineer');
  const [customJobCompany, setCustomJobCompany] = useState('Prospective Company');
  const [customJobDescription, setCustomJobDescription] = useState('');
  const [customMatchResult, setCustomMatchResult] = useState<MatchResult | null>(null);

  // Results & Saved state
  const [results, setResults] = useState<MatchResult[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const [profile, saved] = await Promise.all([
          getUserProfile(user.id),
          getSavedJobs(user.id),
        ]);

        if (profile?.skills?.length) {
          setSkills(profile.skills);
        } else {
          setSkills(['React', 'TypeScript', 'Node.js', 'SQL']);
        }

        if (profile?.resume_text) {
          setResumeText(profile.resume_text);
        }

        setSavedJobIds(saved);

        // Run initial match with initial skills
        const initialMatches = matchJobs(
          profile?.skills?.length ? profile.skills : ['React', 'TypeScript', 'Node.js'],
          sampleJobs,
          12
        );
        setResults(initialMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadInitialData();
  }, [user]);

  const visibleJobs = useMemo(() => {
    let list = sampleJobs;
    if (selectedRole && selectedRole !== 'All Roles') {
      const roleLower = selectedRole.toLowerCase();
      list = list.filter((job) => job.title.toLowerCase().includes(roleLower));
    }
    if (locationFilter && locationFilter !== 'All Locations') {
      list = list.filter((job) =>
        job.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    return list;
  }, [selectedRole, locationFilter]);

  const addSkill = () => {
    const next = manualSkillInput.trim();
    if (!next) return;
    setSkills((prev) => mergeUniqueSkills(prev, [next]));
    setManualSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setError(null);

    try {
      let extractedText = '';

      if (token && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          const payload = (await res.json()) as { text?: string };
          extractedText = payload.text || '';
        }
      }

      if (!extractedText) {
        extractedText = await file.text();
      }

      setResumeText(extractedText);
      const parsedSkills = extractSkillsFromText(extractedText);
      const merged = mergeUniqueSkills(skills, parsedSkills);
      setSkills(merged);

      if (user) {
        await upsertUserProfile({
          user_id: user.id,
          skills: merged,
          resume_text: extractedText,
        });
      }
    } catch {
      setError('Could not extract text from file. You can paste resume text directly.');
    } finally {
      setUploadingFile(false);
    }
  };

  const runMatching = async () => {
    if (!user) return;

    setMatching(true);
    setError(null);

    try {
      const extracted = extractSkillsFromText(resumeText);
      const mergedSkills = mergeUniqueSkills(skills, extracted);

      if (mergedSkills.length === 0) {
        throw new Error('Please add at least one technical skill or provide resume text to run matching.');
      }

      if (activeTab === 'custom') {
        if (!customJobDescription.trim()) {
          throw new Error('Please paste a job description to analyze fit.');
        }
        const customSkills = extractSkillsFromText(customJobDescription);
        const match = calculateMatch(mergedSkills, customSkills.length ? customSkills : ['Software Engineering'], customJobTitle);
        setCustomMatchResult({
          job: {
            id: 'custom-job',
            title: customJobTitle,
            company: customJobCompany,
            required_skills: customSkills,
            description: customJobDescription,
            location: 'Specified in JD',
            type: 'Custom Listing',
          },
          ...match,
        });
      } else {
        const matches = matchJobs(mergedSkills, visibleJobs, 15);
        setResults(matches);
      }

      await upsertUserProfile({
        user_id: user.id,
        skills: mergedSkills,
        resume_text: resumeText.trim(),
      });

      await awardXp(user.id, 25);
    } catch (matchError) {
      setError(matchError instanceof Error ? matchError.message : 'Failed to match jobs.');
    } finally {
      setMatching(false);
    }
  };

  const handleToggleSave = async (jobId: string, score: number) => {
    if (!user) return;
    const { saved } = await toggleSaveJob(user.id, jobId, score);
    setSavedJobIds((prev) => (saved ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
  };

  const savedJobsList = useMemo(() => {
    return sampleJobs.filter((j) => savedJobIds.includes(j.id));
  }, [savedJobIds]);

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-foreground">Intelligent Job Matcher</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze your resume and verified skills against real employer requirements with transparent gap explanations.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60 text-xs font-bold w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'curated' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Curated Database ({sampleJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'custom' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom Job Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'saved' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Saved Roles ({savedJobIds.length})
          </button>
        </div>
      </div>

      {/* Input Configuration Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-border">
        {/* Resume Input & File Upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Resume Text or Upload Document
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingFile}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
            >
              {uploadingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Import PDF / DOCX
            </button>
          </div>

          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-border bg-background p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary resize-y"
            placeholder="Paste resume content here or upload document to auto-extract skills..."
          />
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Your Active Skills ({skills.length})
          </label>
          <div className="flex gap-2">
            <input
              value={manualSkillInput}
              onChange={(event) => setManualSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter (e.g. Next.js, Redis, Tailwind CSS)"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={addSkill}
              className="rounded-xl bg-secondary px-5 py-2 text-xs font-bold hover:bg-secondary/80 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-border/50">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Target Role Category
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="0-1 Years">0-1 Years (Junior / Intern)</option>
              <option value="1-3 Years">1-3 Years (Associate / Mid)</option>
              <option value="3-5 Years">3-5 Years (Mid-Senior)</option>
              <option value="5+ Years">5+ Years (Senior / Lead)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Work Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All Locations">All Locations</option>
              <option value="Remote">Remote Only</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="New York">New York, NY</option>
              <option value="Seattle">Seattle, WA</option>
            </select>
          </div>
        </div>

        {/* Custom Job Description fields if active */}
        {activeTab === 'custom' && (
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4">
            <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Paste Real External Job Posting
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="Job Title (e.g. Staff Full Stack Engineer)"
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none"
              />
              <input
                type="text"
                value={customJobCompany}
                onChange={(e) => setCustomJobCompany(e.target.value)}
                placeholder="Company Name (e.g. Stripe)"
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none"
              />
            </div>
            <textarea
              value={customJobDescription}
              onChange={(e) => setCustomJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste complete job requirements and responsibilities text here..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none resize-none"
            />
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={runMatching}
          disabled={matching}
          className="w-full rounded-xl bg-primary py-3 font-bold text-sm text-white shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {matching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {activeTab === 'custom' ? 'Analyze Custom Fit' : `Match Against ${visibleJobs.length} Roles`}
        </button>
      </div>

      {/* Custom Match Result View */}
      {activeTab === 'custom' && customMatchResult && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-primary/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Custom Analysis</span>
              <h2 className="text-2xl font-bold font-display">{customMatchResult.job.title}</h2>
              <p className="text-xs text-muted-foreground">{customMatchResult.job.company}</p>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-4xl font-extrabold font-display text-emerald-500">
                {customMatchResult.score}%
              </span>
              <p className="text-[11px] text-muted-foreground font-semibold">Overall Fit Score</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 text-xs space-y-2">
            <span className="font-bold text-foreground">Why this is your match fit:</span>
            <p className="text-muted-foreground leading-relaxed">{customMatchResult.matchExplanation}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-500">Matched Competencies ({customMatchResult.matchedSkills.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {customMatchResult.matchedSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <span className="text-xs font-bold text-rose-500">Missing / Desired Skills ({customMatchResult.missingSkills.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {customMatchResult.missingSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Jobs View */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-display">Bookmarked Target Positions ({savedJobsList.length})</h2>
          {savedJobsList.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center text-muted-foreground space-y-2">
              <Bookmark className="w-8 h-8 text-primary/40 mx-auto" />
              <p className="text-sm">You haven't bookmarked any jobs yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab('curated')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Browse Curated Database →
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedJobsList.map((job) => {
                const match = calculateMatch(skills, job.required_skills, job.title);
                return (
                  <div key={job.id} className="glass-panel rounded-2xl p-6 border border-border space-y-4 relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{job.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Building className="h-3.5 w-3.5" /> {job.company} • {job.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleSave(job.id, match.score)}
                        className="text-primary hover:opacity-80"
                        title="Remove bookmark"
                      >
                        <BookmarkCheck className="w-5 h-5 fill-primary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        {match.score}% Match
                      </span>
                      <span className="text-xs text-muted-foreground">{job.type}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>

                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                      >
                        Visit Job Posting <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Curated Matches Results Grid */}
      {activeTab === 'curated' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">
              Ranked Position Fits ({results.length})
            </h2>
            <span className="text-xs text-muted-foreground">Sorted by compatibility index</span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {results.map((result) => {
              const isSaved = savedJobIds.includes(result.job.id);
              return (
                <div
                  key={result.job.id}
                  className="glass-panel rounded-3xl p-6 space-y-4 border border-border hover:border-primary/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground">{result.job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />{result.job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{result.job.location || 'Remote'}</span>
                          {result.job.salary_range && (
                            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                              <DollarSign className="h-3.5 w-3.5" />{result.job.salary_range}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleSave(result.job.id, result.score)}
                          className={`p-2 rounded-xl transition-colors ${
                            isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                          title={isSaved ? 'Remove bookmark' : 'Save job match'}
                        >
                          {isSaved ? <BookmarkCheck className="w-5 h-5 fill-primary" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-extrabold ${
                            result.score >= 80
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : result.score >= 50
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {result.score}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {result.job.description}
                    </p>

                    {/* Transparent fit explanation */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
                      <span className="font-bold text-foreground block">Fit Assessment:</span>
                      <p className="text-muted-foreground leading-relaxed">{result.matchExplanation}</p>
                    </div>

                    {/* Skills breakdown */}
                    <div className="space-y-2 pt-1">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Matched Skills ({result.matchedSkills.length})
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {result.matchedSkills.length ? (
                            result.matchedSkills.map((skill) => (
                              <span key={skill} className="rounded-md bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">None currently matched</span>
                          )}
                        </div>
                      </div>

                      {result.missingSkills.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            Missing Requirements ({result.missingSkills.length})
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {result.missingSkills.map((skill) => (
                              <span key={skill} className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-400">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-3">
                    <span className="text-[11px] text-muted-foreground">
                      {result.job.type || 'Full-time'}
                    </span>
                    {result.job.url && (
                      <a
                        href={result.job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                      >
                        View Official Role <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
