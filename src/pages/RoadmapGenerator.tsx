import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  Target,
  Sparkles,
  ExternalLink,
  BookOpen,
  Code2,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateRoadmap, roadmaps, type RoadmapStep } from '../lib/roadmapData';
import {
  getUserProfile,
  getUserProgress,
  mergeUniqueSkills,
  upsertUserProgress,
  awardXp
} from '../lib/database';

interface GeneratedRoadmap {
  id: string;
  goal: string;
  level: string;
  matchPercentage: number;
  missingSkills: string[];
  steps: RoadmapStep[];
  createdAt: string;
}

export default function RoadmapGenerator() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [careerGoal, setCareerGoal] = useState('Land a High-Growth Mid/Senior Engineering Offer');
  const [skillInput, setSkillInput] = useState('');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<GeneratedRoadmap | null>(null);

  const roleOptions = useMemo(() => Object.keys(roadmaps), []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const [profile, progress] = await Promise.all([
          getUserProfile(user.id),
          getUserProgress(user.id),
        ]);

        if (isMounted) {
          const loadedSkills = profile?.skills?.length
            ? profile.skills
            : ['React', 'TypeScript', 'JavaScript'];
          const completed = progress?.completed_skills ?? [];

          setUserSkills(loadedSkills);
          setCompletedSkills(completed);

          // Generate initial roadmap
          const generated = generateRoadmap(targetRole, loadedSkills, completed);
          setActiveRoadmap({
            id: crypto.randomUUID(),
            goal: targetRole,
            level: skillLevel,
            matchPercentage: generated.matchPercentage,
            missingSkills: generated.missingSkills,
            steps: generated.steps,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (loadError) {
        console.error(loadError);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [user, targetRole, skillLevel]);

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    setUserSkills((prev) => mergeUniqueSkills(prev, [value]));
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setUserSkills((prev) => prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const generate = async () => {
    if (!user) return;

    setGenerating(true);
    setError(null);

    try {
      const roadmap = generateRoadmap(targetRole, userSkills, completedSkills);
      const entry: GeneratedRoadmap = {
        id: crypto.randomUUID(),
        goal: targetRole,
        level: skillLevel,
        matchPercentage: roadmap.matchPercentage,
        missingSkills: roadmap.missingSkills,
        steps: roadmap.steps,
        createdAt: new Date().toISOString(),
      };

      setActiveRoadmap(entry);
      localStorage.setItem(`roadmap_${user.id}`, JSON.stringify(entry));
      await awardXp(user.id, 30);
    } catch {
      setError('Could not generate roadmap.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleStep = async (stepId: string) => {
    if (!user || !activeRoadmap) return;

    let toggledSkill: string | undefined;

    const updatedSteps = activeRoadmap.steps.map((step) => {
      if (step.id === stepId) {
        const nextCompleted = !step.completed;
        if (nextCompleted && step.relatedSkill) {
          toggledSkill = step.relatedSkill;
        }
        return { ...step, completed: nextCompleted };
      }
      return step;
    });

    const updatedRoadmap = { ...activeRoadmap, steps: updatedSteps };
    setActiveRoadmap(updatedRoadmap);
    localStorage.setItem(`roadmap_${user.id}`, JSON.stringify(updatedRoadmap));

    if (toggledSkill) {
      const merged = mergeUniqueSkills(completedSkills, [toggledSkill]);
      setCompletedSkills(merged);
      await upsertUserProgress({ user_id: user.id, completed_skills: merged });
      await awardXp(user.id, 50);
    }
  };

  const completedCount = activeRoadmap?.steps.filter((s) => s.completed).length || 0;
  const totalCount = activeRoadmap?.steps.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Group steps by Phase
  const stepsByPhase = useMemo(() => {
    if (!activeRoadmap) return {};
    const grouped: Record<string, RoadmapStep[]> = {};
    for (const step of activeRoadmap.steps) {
      if (!grouped[step.phase]) grouped[step.phase] = [];
      grouped[step.phase].push(step);
    }
    return grouped;
  }, [activeRoadmap]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Career Roadmap</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Structured phase-by-phase learning curriculum, practice projects, and verified engineering docs to reach your target role.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-border space-y-5">
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Target Role & Objectives
            </h2>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Target Engineering Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Starting Skill Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSkillLevel(lvl)}
                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                      skillLevel === lvl
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-card border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Primary Career Goal
              </label>
              <input
                type="text"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                placeholder="e.g. Land a Senior Frontend Role at a Series-B Startup"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Skills Pool */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Your Existing Skills ({userSkills.length})
              </label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Next.js)"
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-xl bg-secondary text-xs font-bold hover:bg-secondary/80"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                {userSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X className="w-3 h-3 hover:text-destructive" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <button
              type="button"
              disabled={generating}
              onClick={generate}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Regenerate Roadmap
            </button>
          </div>

          {/* Skill Gap Summary Card */}
          {activeRoadmap && (
            <div className="surface-card rounded-2xl p-5 border border-border space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority Skill Gap Analysis
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Stack Coverage</span>
                  <span className="font-bold text-primary font-mono">{activeRoadmap.matchPercentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${activeRoadmap.matchPercentage}%` }}
                  />
                </div>
              </div>

              {activeRoadmap.missingSkills.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] text-muted-foreground block mb-1 font-semibold">
                    Recommended Technologies to Acquire:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRoadmap.missingSkills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Roadmap Progression & Phases */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Overview Header */}
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Curriculum Path</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{targetRole} Pathway</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{careerGoal}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <span className="text-2xl font-extrabold font-mono text-emerald-500">
                  {completedCount} / {totalCount}
                </span>
                <p className="text-[11px] text-muted-foreground font-medium">Milestones Complete ({progressPercent}%)</p>
              </div>
            </div>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="space-y-8">
            {Object.entries(stepsByPhase).map(([phaseName, phaseSteps], phaseIdx) => (
              <div key={phaseName} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-mono">
                    0{phaseIdx + 1}
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-foreground">{phaseName}</h3>
                </div>

                <div className="space-y-4 pl-3.5 border-l-2 border-border/70 ml-3.5">
                  {phaseSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`p-5 rounded-xl border transition-all space-y-3 ${
                        step.completed
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'surface-card border-border/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            className="mt-0.5 text-primary hover:opacity-80 transition-opacity shrink-0"
                            title={step.completed ? 'Mark incomplete' : 'Mark milestone complete (+50 XP)'}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>

                          <div>
                            <h4 className={`text-sm font-bold ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {step.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold capitalize px-2 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0">
                          {step.level}
                        </span>
                      </div>

                      {/* Practice Project Recommendation */}
                      {step.projectIdea && (
                        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs flex items-start gap-2">
                          <Code2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-foreground">Recommended Proof Project: </span>
                            <span className="text-muted-foreground">{step.projectIdea}</span>
                          </div>
                        </div>
                      )}

                      {/* Verified Resources Links */}
                      {step.resources && step.resources.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                          <span className="text-muted-foreground font-semibold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-primary" /> Verified Docs:
                          </span>
                          {step.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                            >
                              {res.name}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
