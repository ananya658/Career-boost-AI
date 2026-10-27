import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  Compass,
  Mic,
  Crosshair,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface StageNode {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: React.ComponentType<{ className?: string }>;
  details: {
    heading: string;
    description: string;
    deliverable: string;
    tags: string[];
  };
}

const JOURNEY_STAGES: StageNode[] = [
  {
    id: 'audit',
    step: 'Stage 01',
    title: 'Stack & ATS Audit',
    subtitle: 'Extract skills & detect gaps',
    metric: '88%',
    metricLabel: 'Initial ATS Score',
    status: 'completed',
    icon: FileSearch,
    details: {
      heading: 'Resume Benchmark & Keyword Density',
      description: 'Parses structure, education, and technical competencies. Flags weak passive verbs and identifies missing high-demand keywords before human recruiters look.',
      deliverable: '12 extracted skills • 3 prioritized additions',
      tags: ['ATS Readability', 'Keyword Gap Analysis', 'Action Verbs']
    }
  },
  {
    id: 'roadmap',
    step: 'Stage 02',
    title: 'Milestone Roadmap',
    subtitle: 'Step-by-step engineering curriculum',
    metric: '4/4',
    metricLabel: 'Phases Generated',
    status: 'completed',
    icon: Compass,
    details: {
      heading: 'Structured Role Pathways',
      description: 'Generates milestone checklists with verified documentation links and practical architecture project recommendations to bridge detected deficiencies.',
      deliverable: 'Tailored to Full Stack & Frontend roles',
      tags: ['Core Fundamentals', 'Distributed Systems', 'Verified Docs']
    }
  },
  {
    id: 'simulation',
    step: 'Stage 03',
    title: 'STAR Mock Drills',
    subtitle: 'Timed technical & behavioral rounds',
    metric: '92/100',
    metricLabel: 'Clarity & Depth',
    status: 'active',
    icon: Mic,
    details: {
      heading: 'High-Stakes Answer Evaluation',
      description: 'Timed questions with deterministic scoring analyzing relevance, length, and STAR structure (Situation, Task, Action, Result) with real-world sample responses.',
      deliverable: '5 questions answered • Live feedback summary',
      tags: ['STAR Scoring', 'Domain Depth', 'Time Management']
    }
  },
  {
    id: 'matching',
    step: 'Stage 04',
    title: 'Precision Matcher',
    subtitle: 'Stack compatibility against real jobs',
    metric: '94%',
    metricLabel: 'Best Match Fit',
    status: 'upcoming',
    icon: Crosshair,
    details: {
      heading: 'Role Alignment & Coverage',
      description: 'Compares your actual skill inventory against requirements for curated market opportunities, showing exactly what you meet and where you fall short.',
      deliverable: '22 verified industry postings analyzed',
      tags: ['Skill Intersection', 'Salary Insights', 'Direct Apply']
    }
  },
  {
    id: 'portfolio',
    step: 'Stage 05',
    title: 'Live Showcase',
    subtitle: 'Deploy shareable proof of work',
    metric: '/p/slug',
    metricLabel: 'Public Verified Link',
    status: 'upcoming',
    icon: Award,
    details: {
      heading: 'Recruiter-Ready Developer Portfolio',
      description: 'Instantly turns your projects, verified experience, and skills into an elegant hosted developer portfolio ready for recruiters, with print-ready PDF styling.',
      deliverable: 'Hosted on custom slug • Zero boilerplate',
      tags: ['Instant Publishing', 'Clean Typography', 'PDF Ready']
    }
  }
];

export default function CareerJourneyMap() {
  const [activeStageId, setActiveStageId] = useState<string>('simulation');
  const activeStage = JOURNEY_STAGES.find((s) => s.id === activeStageId) || JOURNEY_STAGES[2];

  return (
    <div className="w-full surface-card rounded-2xl border border-border p-6 sm:p-8 space-y-8">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="accent-badge px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
              Signature Architecture
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              The Engineering Progression Pipeline
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            From Current Skills to Verified Offer Readiness
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Pipeline — Click Any Phase
        </div>
      </div>

      {/* Pipeline Stepper Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
        {JOURNEY_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStageId;
          const isFinished = stage.status === 'completed';

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all relative group flex flex-col justify-between ${
                isActive
                  ? 'border-primary bg-primary/[0.04] shadow-sm'
                  : 'border-border/70 bg-card hover:border-border hover:bg-muted/30'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="activeJourneyIndicator"
                  className="absolute -top-px left-3 right-3 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    {stage.step}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isFinished
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="font-display font-bold text-sm text-foreground line-clamp-1">
                  {stage.title}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 hidden sm:block">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/40 flex items-baseline justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  {stage.metric}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {stage.metricLabel.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {activeStage.step}: {activeStage.title}
                </span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground">
                  {activeStage.details.deliverable}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-display text-foreground">
                {activeStage.details.heading}
              </h4>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-right">
                <div className="font-mono text-sm font-bold text-primary">
                  {activeStage.metric}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">
                  {activeStage.metricLabel}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {activeStage.details.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-mono mr-1">Criteria:</span>
              {activeStage.details.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-card border border-border text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              Phase {activeStage.step.split(' ')[1]} of 05 Verified
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
