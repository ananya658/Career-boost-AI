import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLES = [
  {
    role: 'Backend / Systems Engineer',
    before: {
      bullet: 'Worked on database performance and helped the backend team fix API slowness for users.',
      score: 42,
      critiques: ['Passive action verb ("helped")', 'Zero quantified metrics or impact numbers', 'Missing technical stack keywords']
    },
    after: {
      bullet: 'Architected Redis distributed cache layer and optimized PostgreSQL query plans, reducing p99 API response latency by 42% across 1.2M daily requests.',
      score: 96,
      strengths: ['High-impact action verb ("Architected")', 'Quantified metrics ("42%", "1.2M requests")', 'Explicit keyword matches: Redis, PostgreSQL, p99 latency']
    }
  },
  {
    role: 'Frontend / UI Architect',
    before: {
      bullet: 'Responsible for building new features in React and making the dashboard load faster.',
      score: 48,
      critiques: ['Passive phrasing ("Responsible for")', 'Vague outcome ("load faster")', 'No technical architecture details']
    },
    after: {
      bullet: 'Engineered dynamic code-splitting and virtualized table rendering in React 19, improving Largest Contentful Paint (LCP) by 1.8s and cutting initial bundle size by 35%.',
      score: 94,
      strengths: ['Decisive verb ("Engineered")', 'Specific Core Web Vitals metric ("LCP 1.8s", "35% bundle")', 'Modern ecosystem terms: React 19, code-splitting']
    }
  }
];

export default function InteractiveAtsTransformer() {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [mode, setMode] = useState<'after' | 'before'>('after');
  const [copied, setCopied] = useState(false);

  const sample = SAMPLES[sampleIndex];

  const handleCopy = () => {
    void navigator.clipboard.writeText(sample.after.bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
      {/* Header and Sample Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              ATS PARSER BENCHMARK // LIVE DEMONSTRATION
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Quantified STAR Transformation
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            See how passive resume text is refactored into high-scoring technical bullets.
          </p>
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-2">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.role}
              type="button"
              onClick={() => {
                setSampleIndex(idx);
                setMode('after');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sampleIndex === idx
                  ? 'bg-muted text-foreground font-semibold border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.role.split('/')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle: Before vs. After */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg bg-muted/60 p-1 border border-border/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('before')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === 'before'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Original Draft (Unscored)
          </button>
          <button
            type="button"
            onClick={() => setMode('after')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'after'
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Optimized (ATS Calibrated)
          </button>
        </div>

        <div className="flex items-center gap-2 text-right">
          <span className="text-xs text-muted-foreground font-mono">Simulated ATS Score:</span>
          <span
            className={`font-mono text-lg font-bold ${
              mode === 'after' ? 'text-emerald-500' : 'text-amber-500'
            }`}
          >
            {mode === 'after' ? `${sample.after.score}%` : `${sample.before.score}%`}
          </span>
        </div>
      </div>

      {/* Content Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sampleIndex}-${mode}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
            mode === 'after'
              ? 'bg-primary/[0.03] border-primary/30'
              : 'bg-muted/20 border-border'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
              "{mode === 'after' ? sample.after.bullet : sample.before.bullet}"
            </p>
            {mode === 'after' && (
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Copy transformed bullet"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Diagnostic breakdown tags */}
          <div className="pt-3 border-t border-border/50 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              {mode === 'after' ? 'ATS Evaluation Criteria Passed:' : 'ATS Filter Flags Detected:'}
            </span>
            <div className="grid sm:grid-cols-3 gap-2">
              {(mode === 'after' ? sample.after.strengths : sample.before.critiques).map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    mode === 'after'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                      : 'bg-amber-500/5 border-amber-500/20 text-foreground'
                  }`}
                >
                  {mode === 'after' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
        <span className="text-muted-foreground font-mono">
          Accepts .pdf, .docx, and raw text with instant keyword extraction.
        </span>
        <Link
          to="/resume"
          className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
        >
          Scan Your Full Resume Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
