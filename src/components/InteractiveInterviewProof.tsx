import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Award,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InteractiveInterviewProof() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'rubric' | 'evaluation'>('evaluation');

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              MOCK SIMULATOR // EVALUATION ENGINE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Real-Time STAR Evaluation
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pressure-test technical and behavioral answers against strict engineering rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-primary/10 text-primary font-mono text-xs font-semibold border border-primary/20">
            Senior Frontend / Full Stack
          </span>
          <span className="px-2.5 py-1 rounded bg-muted text-muted-foreground font-mono text-xs font-medium border border-border">
            180s Time Limit
          </span>
        </div>
      </div>

      {/* Simulated Question Card */}
      <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5 font-bold text-primary">
            <Mic className="w-3.5 h-3.5" /> QUESTION 02 OF 05
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Target response: 120s – 180s
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-foreground">
          "How do you architect an offline-first state synchronization engine for a collaborative web application?"
        </h4>

        {/* Audio waveform simulation */}
        <div className="p-3 rounded-lg bg-background/80 border border-border/60 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            title={isPlaying ? 'Pause sample' : 'Play sample response audio'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <div className="flex items-center gap-1 flex-1 h-6">
            {[40, 65, 30, 80, 50, 95, 70, 45, 85, 60, 90, 75, 40, 70, 55, 85, 90, 60, 45, 75, 50, 30].map(
              (h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
                  }`}
                  style={{ height: `${h}%` }}
                />
              )
            )}
          </div>

          <span className="font-mono text-[11px] text-muted-foreground shrink-0">
            {isPlaying ? '01:42 / 02:30' : 'Sample: 02:30'}
          </span>
        </div>
      </div>

      {/* Evaluation Feedback Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-lg bg-muted/60 p-1 border border-border/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'evaluation'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Evaluator Feedback (Score: 88%)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'rubric'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              STAR Framework Breakdown
            </button>
          </div>

          <div className="flex items-center gap-1 text-emerald-500 font-mono text-xs font-bold">
            <Award className="w-4 h-4" /> Ready for Staff Screen
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'evaluation' ? (
            <motion.div
              key="eval"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-4 rounded-xl border border-primary/20 bg-primary/[0.02] space-y-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-foreground block">
                    Evaluator Diagnosis:
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    "Candidate immediately classified conflict resolution algorithms (CRDTs vs OT), explained local IndexedDB caching with optimistic UI state, and described a background WebSocket synchronization pipeline with exponential backoff. Strong engineering maturity."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center font-mono">
                <div className="p-2 rounded bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase">Technical Depth</span>
                  <span className="text-sm font-bold text-emerald-500">92%</span>
                </div>
                <div className="p-2 rounded bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase">STAR Structure</span>
                  <span className="text-sm font-bold text-emerald-500">88%</span>
                </div>
                <div className="p-2 rounded bg-card border border-border/60">
                  <span className="text-[10px] text-muted-foreground block uppercase">Conciseness</span>
                  <span className="text-sm font-bold text-primary">85%</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rubric"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="grid sm:grid-cols-4 gap-2 text-xs"
            >
              {[
                { phase: 'SITUATION', text: 'Multi-user collaborative editor required seamless work during flight disconnects.' },
                { phase: 'TASK', text: 'Architect local state persistence without data divergence or silent overwrite.' },
                { phase: 'ACTION', text: 'Used Yjs CRDTs with IndexedDB provider and queue-based delta reconciliation.' },
                { phase: 'RESULT', text: '0 data loss recorded across 5,000 test disconnects; under 50ms local latency.' }
              ].map((item) => (
                <div key={item.phase} className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <span className="font-mono text-[10px] font-bold text-primary block">
                    {item.phase}
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-border/60">
        <span className="text-muted-foreground font-mono">
          Timed behavioral, technical architecture, and system design rounds.
        </span>
        <Link
          to="/interview"
          className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
        >
          Practice Realistic Rounds <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
