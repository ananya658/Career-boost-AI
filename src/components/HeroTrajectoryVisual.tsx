import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mic,
  Compass,
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleTrack {
  id: string;
  name: string;
  badge: string;
  salary: string;
  demand: string;
  matchScore: number;
  readinessTime: string;
  verifiedSkills: string[];
  missingSkills: string[];
  stages: {
    atsScore: number;
    atsFinding: string;
    interviewScore: number;
    interviewFocus: string;
    roadmapPhase: string;
    portfolioSlug: string;
  };
}

const TRACKS: RoleTrack[] = [
  {
    id: 'fullstack',
    name: 'Full Stack Architect',
    badge: 'Tier 1 Engineering',
    salary: '$150k – $190k',
    demand: 'High Demand (4.8k open roles)',
    matchScore: 84,
    readinessTime: '14 days estimated',
    verifiedSkills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs'],
    missingSkills: ['Redis Caching', 'System Design', 'Kafka Pipelines'],
    stages: {
      atsScore: 91,
      atsFinding: 'Strong technical density • Added quantified query optimization bullet points',
      interviewScore: 88,
      interviewFocus: 'Distributed concurrency, optimistic UI sync, and STAR answer structure',
      roadmapPhase: 'Phase 3: High-Throughput Event Streaming',
      portfolioSlug: 'alex-developer'
    }
  },
  {
    id: 'ai-eng',
    name: 'AI Product Engineer',
    badge: 'Emerging High Growth',
    salary: '$165k – $215k',
    demand: 'Surging (6.2k open roles)',
    matchScore: 76,
    readinessTime: '21 days estimated',
    verifiedSkills: ['Python', 'TypeScript', 'FastAPI', 'Vector Embeddings', 'Next.js'],
    missingSkills: ['LangGraph', 'Model Fine-tuning', 'Evals & Observability'],
    stages: {
      atsScore: 86,
      atsFinding: 'Identified missing RAG architecture terms • Generated STAR bullet points',
      interviewScore: 82,
      interviewFocus: 'Hallucination mitigation, latency reduction, and prompt eval frameworks',
      roadmapPhase: 'Phase 2: Production LLM Orchestration & Guardrails',
      portfolioSlug: 'alex-ai-engineer'
    }
  },
  {
    id: 'devops',
    name: 'Cloud & Platform Lead',
    badge: 'Infrastructure Core',
    salary: '$155k – $195k',
    demand: 'Stable Core (3.9k open roles)',
    matchScore: 89,
    readinessTime: '10 days estimated',
    verifiedSkills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD Pipelines'],
    missingSkills: ['eBPF Observability', 'FinOps Cost Optimization'],
    stages: {
      atsScore: 94,
      atsFinding: 'Verified multi-cloud security compliance keywords and zero-downtime deployments',
      interviewScore: 90,
      interviewFocus: 'Chaos engineering, disaster recovery RTO/RPO, and incident postmortems',
      roadmapPhase: 'Phase 4: Site Reliability & Automated Canary Deployments',
      portfolioSlug: 'alex-devops-lead'
    }
  }
];

export default function HeroTrajectoryVisual() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<'audit' | 'interview' | 'roadmap' | 'portfolio'>('audit');

  const currentTrack = TRACKS[activeTrackIndex];

  return (
    <div className="w-full rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Top Header Bar: Role Selector Tabs */}
      <div className="bg-muted/40 border-b border-border/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground ml-2">
            CAREER_TELEMETRY_ENGINE // V2.4
          </span>
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-1 bg-background/80 p-0.5 rounded-lg border border-border/60">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrackIndex(idx)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTrackIndex === idx
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {track.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Target Metric Header */}
      <div className="p-5 border-b border-border/60 bg-muted/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary font-semibold border border-primary/20">
                {currentTrack.badge}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {currentTrack.demand}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1">
              {currentTrack.name}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-xs text-muted-foreground font-mono">Market Range</div>
              <div className="text-base font-bold font-mono text-foreground">
                {currentTrack.salary}
              </div>
            </div>
            <div className="pl-4 border-l border-border/80">
              <div className="text-xs text-muted-foreground font-mono">Match Index</div>
              <div className="text-xl font-extrabold font-mono text-emerald-500 flex items-center justify-end gap-1">
                <TrendingUp className="w-4 h-4" />
                {currentTrack.matchScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Verified Skills vs. Gap Breakdown */}
        <div className="pt-2 border-t border-border/40 grid sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
              Verified Stack ({currentTrack.verifiedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {currentTrack.verifiedSkills.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-500 block mb-1">
              Identified Deficiencies ({currentTrack.missingSkills.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {currentTrack.missingSkills.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 dark:text-rose-400 font-mono text-[11px] border border-rose-500/20"
                >
                  ! {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Progression Pipeline */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono uppercase tracking-wider text-muted-foreground">
            Stage Diagnostic Telemetry
          </span>
          <span className="text-xs font-mono text-primary font-semibold">
            Click step to inspect
          </span>
        </div>

        {/* 4 Clickable Step Nodes */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'audit', label: '1. Resume ATS', icon: FileText, score: `${currentTrack.stages.atsScore}%` },
            { id: 'interview', label: '2. Mock STAR', icon: Mic, score: `${currentTrack.stages.interviewScore}%` },
            { id: 'roadmap', label: '3. Roadmap', icon: Compass, score: 'Active' },
            { id: 'portfolio', label: '4. Portfolio', icon: Globe, score: 'Live' }
          ].map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border/70 bg-card hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.score}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-foreground truncate mt-1.5">
                  {step.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Inspector Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTrackIndex}-${activeStep}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-2 text-xs"
          >
            {activeStep === 'audit' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> ATS Resume Scanner Output
                  </span>
                  <span className="font-mono text-emerald-500 font-bold">
                    {currentTrack.stages.atsScore}/100 ATS Score
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  {currentTrack.stages.atsFinding}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">Format: PDF/DOCX Parsing Engine</span>
                  <Link to="/resume" className="text-primary font-semibold text-[11px] hover:underline flex items-center gap-1">
                    Run ATS Scan <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activeStep === 'interview' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-primary" /> Timed Mock Round Evaluation
                  </span>
                  <span className="font-mono text-emerald-500 font-bold">
                    {currentTrack.stages.interviewScore}% Readiness
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Focus rubric: {currentTrack.stages.interviewFocus}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">Simulation: STAR Behavioral & Architecture</span>
                  <Link to="/interview" className="text-primary font-semibold text-[11px] hover:underline flex items-center gap-1">
                    Start Mock Round <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activeStep === 'roadmap' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" /> Active Learning Curriculum
                  </span>
                  <span className="font-mono text-primary font-bold">4/4 Milestones</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Current milestone: {currentTrack.stages.roadmapPhase}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">Verified documentation & repo blueprints</span>
                  <Link to="/roadmap" className="text-primary font-semibold text-[11px] hover:underline flex items-center gap-1">
                    Open Roadmap <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activeStep === 'portfolio' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" /> Live Developer Showcase
                  </span>
                  <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Published
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Public URL: <code className="text-primary font-mono">careerboost.ai/p/{currentTrack.stages.portfolioSlug}</code>
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">Export: One-click print-to-PDF</span>
                  <Link to="/portfolio" className="text-primary font-semibold text-[11px] hover:underline flex items-center gap-1">
                    Configure Showcase <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
