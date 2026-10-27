import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Mic,
  Map,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Zap,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, signInWithDemo } = useAuth();
  const navigate = useNavigate();
  const [activeFeatureTab, setActiveFeatureTab] = useState<'resume' | 'interview' | 'jobs' | 'roadmap' | 'portfolio'>('resume');

  const handleDemoLaunch = () => {
    signInWithDemo('alex.developer@careerboost.ai', 'Alex Developer');
    navigate('/dashboard');
  };

  const featureTabs = [
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'interview', label: 'AI Interview', icon: Mic },
    { id: 'jobs', label: 'Job Matcher', icon: Briefcase },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-foreground">
              CareerBoost<span className="text-primary">.ai</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-foreground transition-colors">Live Preview</a>
            <a href="#outcomes" className="hover:text-foreground transition-colors">Outcomes</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all text-sm"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoLaunch}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-border/80 hover:bg-muted text-foreground transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                  Try Instant Demo
                </button>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all text-sm"
                >
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-primary/15 via-purple-500/10 to-pink-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs sm:text-sm font-semibold backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            Next-Gen AI Career Copilot for Software Engineers & Tech Pros
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display leading-[1.1]"
          >
            Land Your Dream Role with <br />
            <span className="gradient-text">Precision AI Preparation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Stop submitting blind applications. Analyze your resume against ATS algorithms,
            practice real-time technical and behavioral interviews with actionable AI feedback,
            and generate a live, shareable developer portfolio in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-base shadow-xl shadow-primary/25 hover:from-primary/95 hover:to-purple-600/95 transition-all"
              >
                Open My Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth?mode=signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDemoLaunch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-card border border-border/80 font-bold text-base hover:bg-muted text-foreground transition-all shadow-sm"
                >
                  <Play className="w-4 h-4 text-primary fill-primary" />
                  Instant Sandbox Demo
                </button>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Real Job Match Algorithm
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Row Level Security Protected
            </span>
          </motion.div>
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section id="preview" className="py-20 border-t border-border/40 bg-muted/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              A Full Career Acceleration Suite
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Explore the five integrated tools designed to take you from resume polishing to final round offer.
            </p>
          </div>

          {/* Feature switcher tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Preview Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-border shadow-2xl relative overflow-hidden">
            {activeFeatureTab === 'resume' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" />
                    Resume ATS Scoring & Parser
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display">
                    Bypass Applicant Tracking Systems with Confidence
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Upload your PDF or DOCX resume. Our parser evaluates keyword density,
                    structural readability, quantified metrics, and suggests quantifiable bullet-point
                    upgrades tailored to your target job title.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Automatic skill extraction across languages, cloud platforms, and databases.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Clear breakdown of strengths, missing competencies, and weak phrasing.</span>
                    </div>
                  </div>
                  <Link
                    to="/resume"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Try Resume Analyzer Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-background/90 rounded-2xl p-6 border border-border space-y-5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base">ATS Compatibility Index</h4>
                      <p className="text-xs text-muted-foreground">Frontend Engineer Target Profile</p>
                    </div>
                    <span className="text-3xl font-extrabold text-emerald-500">88%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-1">
                      <span className="font-bold text-foreground">Identified Core Strengths</span>
                      <p className="text-muted-foreground">React 19, TypeScript, State Management, Vite, Component Architecture.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                      <span className="font-bold text-amber-500">Recommended Additions</span>
                      <p className="text-muted-foreground">Add specific metrics for performance optimization (e.g. "Reduced load times by 40%").</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'interview' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                    <Mic className="w-3.5 h-3.5" />
                    Adaptive Mock Interviews
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display">
                    Simulate Technical & Behavioral Rounds
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Practice realistic interviews under pressure with live countdown timers,
                    comprehensive STAR-method feedback, and transparent scoring across clarity,
                    relevance, and technical depth.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Difficulty levels: Beginner, Intermediate, and Advanced.</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Full post-interview evaluation report with sample ideal responses.</span>
                    </div>
                  </div>
                  <Link
                    to="/interview"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Start an Interview Simulation <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-background/90 rounded-2xl p-6 border border-border space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Question 2 of 5</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">Medium Difficulty</span>
                  </div>
                  <p className="text-sm font-semibold">"How do you handle state management across deeply nested components in modern React?"</p>
                  <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-emerald-500">Answer Clarity: 92%</span>
                      <span className="text-purple-500">Technical Depth: 86%</span>
                    </div>
                    <p className="text-muted-foreground italic">"Excellent explanation of Zustand vs Context API, with good trade-off consideration regarding re-renders."</p>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'jobs' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">
                    <Briefcase className="w-3.5 h-3.5" />
                    Intelligent Job Matching
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display">
                    Discover Roles Aligned with Your Stack
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Test your profile against curated, realistic positions or paste custom job descriptions.
                    See exact matching percentages, overlap breakdown, and missing skills to prioritize before applying.
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Match Your Skills <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-background/90 rounded-2xl p-6 border border-border space-y-4 shadow-inner">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base">Frontend Engineer (React / Next.js)</h4>
                      <p className="text-xs text-muted-foreground">Vercel Ecosystem • Remote • $110k - $145k</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-sm">92% Match</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground font-semibold">Matched Skills (5/6)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS'].map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'roadmap' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
                    <Map className="w-3.5 h-3.5" />
                    Personalized Career Roadmaps
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display">
                    Structured Milestones from Zero to Senior
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Generate step-by-step learning pathways with verified documentation links, project recommendations,
                    and interactive checkbox tracking synced to your profile XP.
                  </p>
                  <Link
                    to="/roadmap"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Build Your Roadmap <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-background/90 rounded-2xl p-6 border border-border space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="font-bold text-sm">Full Stack Developer Pathway</span>
                    <span className="text-xs text-primary font-bold">60% Complete</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Phase 1: Core Fundamentals & TypeScript
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Phase 2: Relational Databases & REST Architecture
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]">3</div>
                      Phase 3: Microservices, Docker & CI/CD Pipelines
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'portfolio' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    Instant Developer Portfolio
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display">
                    Publish a Live Showcase in Minutes
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Fill in your experience, projects, and skills to generate a stunning, responsive,
                    accessible portfolio hosted at a custom slug with print and PDF export ready.
                  </p>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    Build Portfolio Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-background/90 rounded-2xl p-6 border border-border space-y-4 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                      AD
                    </div>
                    <div>
                      <h4 className="font-bold text-base">Alex Developer</h4>
                      <p className="text-xs text-muted-foreground">Full Stack Software Engineer • San Francisco, CA</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">"Specializing in high-performance web applications using React, Node.js, and PostgreSQL."</p>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-medium">3 Featured Projects</span>
                    <span className="px-2.5 py-1 rounded-md bg-muted text-[11px] font-medium">Shareable URL: /p/alex-dev</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            How CareerBoost AI Operates
          </h2>
          <p className="text-muted-foreground text-base">
            A frictionless three-stage cycle that converts your skills into hireable momentum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-2xl p-8 space-y-4 border border-border relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg font-display">
              01
            </div>
            <h3 className="text-xl font-bold font-display">Audit & Benchmark</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Upload your existing resume or paste your bio. Discover your baseline ATS score,
              highlighted strengths, and specific skill omissions across modern hiring criteria.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 space-y-4 border border-border relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-lg font-display">
              02
            </div>
            <h3 className="text-xl font-bold font-display">Train & Level Up</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Take tailored mock interview rounds. Receive instant evaluative scoring on communication,
              role-specific nuance, and technical accuracy to eliminate blind spots.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 space-y-4 border border-border relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg font-display">
              03
            </div>
            <h3 className="text-xl font-bold font-display">Showcase & Match</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Generate an elegant live developer portfolio with your verified projects and experience,
              and apply directly to jobs matching your exact qualifications.
            </p>
          </div>
        </div>
      </section>

      {/* Outcome Proof & Metrics */}
      <section id="outcomes" className="py-16 border-t border-border/40 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-extrabold font-display gradient-text">85%+</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Average ATS Score Improvement</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold font-display text-emerald-500">2.4x</div>
              <p className="text-xs sm:text-sm text-muted-foreground">More Interview Callbacks</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold font-display text-purple-500">5+ Roles</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Supported Engineering Tracks</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-extrabold font-display text-pink-500">100%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">User-Owned Private Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 glass-panel rounded-3xl p-10 sm:p-14 border border-primary/20 shadow-2xl relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display">
            Ready to Take Control of Your Career?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Join software engineers, data analysts, and tech switchers actively using CareerBoost AI to interview better and land competitive jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={handleDemoLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-bold text-base hover:bg-secondary/80 transition-all"
            >
              Launch Live Demo Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-auto bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg font-display">CareerBoost AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CareerBoost AI. Built with React 19, TypeScript, and Supabase.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link to="/resume" className="hover:text-foreground transition-colors">Resume Analyzer</Link>
            <Link to="/interview" className="hover:text-foreground transition-colors">Mock Interviews</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
