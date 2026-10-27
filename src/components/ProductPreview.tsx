import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mic,
  Crosshair,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

type PreviewTab = 'resume' | 'interview' | 'matcher';

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>('resume');

  return (
    <div className="w-full surface-card rounded-2xl border border-border overflow-hidden">
      {/* Chrome Window Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            app.careerboost.ai / workspace / {activeTab}
          </span>
        </div>

        {/* Feature Preview Tabs */}
        <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-3 h-3" /> Resume Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="w-3 h-3" /> Interview Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matcher')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'matcher'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Crosshair className="w-3 h-3" /> Role Matcher
          </button>
        </div>
      </div>

      {/* Preview Viewport */}
      <div className="p-6 sm:p-8 bg-card">
        <AnimatePresence mode="wait">
          {activeTab === 'resume' && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-12 gap-6"
            >
              {/* Left Score Summary */}
              <div className="md:col-span-5 p-5 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="accent-badge text-[10px] text-muted-foreground">Document Benchmark</span>
                    <h4 className="font-display font-bold text-lg text-foreground mt-0.5">
                      Senior Frontend Engineer
                    </h4>
                    <p className="text-xs text-muted-foreground">Target Role Profile</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-mono text-primary">88</span>
                    <span className="text-xs text-muted-foreground font-mono">/100</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">ATS Readability Index</span>
                    <span className="font-bold text-foreground">Top 12%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[88%]" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Action Verbs Detected</span>
                    <span className="font-mono font-semibold text-foreground">7 high-impact</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Quantified Metrics</span>
                    <span className="font-mono font-semibold text-foreground">4 identified</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Skill Term Density</span>
                    <span className="font-mono font-semibold text-emerald-500">Optimum (14 skills)</span>
                  </div>
                </div>

                <Link
                  to="/resume"
                  className="w-full py-2.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Open Live Resume Analyzer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Right Findings & Suggested Bullets */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> Strong Competencies Verified
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strong foundational and production coverage across React 19, TypeScript, State Management, and Vite bundler pipelines.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs font-mono uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" /> High-Impact Recommended Upgrade
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border/60 text-xs text-foreground font-mono leading-relaxed">
                    "Architected state synchronization engine using TypeScript and Redis, reducing p95 client latency by 34%."
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground font-mono self-center mr-1">Extracted Stack:</span>
                  {['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'PostgreSQL', 'Docker'].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-muted/60 text-[11px] font-mono text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">Question 02 of 05</span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-xs font-mono text-muted-foreground">Full Stack Developer track</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" /> 01:42 remaining
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-sm sm:text-base font-display font-semibold text-foreground">
                  "Explain how React's reconciliation algorithm works under the hood and how key props minimize DOM updates during list rendering."
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Clarity Rating</span>
                  <div className="text-xl font-bold font-mono text-foreground mt-1">92%</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">STAR method adherence</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Technical Depth</span>
                  <div className="text-xl font-bold font-mono text-primary mt-1">88%</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Fiber & diffing terminology</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">Actionable Feedback</span>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    "Solid trade-off discussion. Next time mention reconciliation edge cases."
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  to="/interview"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  Launch Full Mock Simulator <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === 'matcher' && (
            <motion.div
              key="matcher"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-base text-foreground">
                      Frontend Software Engineer
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-500">
                      94% Alignment
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    CloudData Systems • Remote • $120,000 - $150,000
                  </p>
                </div>
                <Link
                  to="/jobs"
                  className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-card text-xs font-semibold text-foreground text-center"
                >
                  View Matches
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    Matching Stack Requirements (5/5)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST APIs'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    Recommended Additions for Senior Title
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['GraphQL', 'End-to-End Testing (Playwright)'].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded text-xs font-mono bg-muted text-muted-foreground">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
