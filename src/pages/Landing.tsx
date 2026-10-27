import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  FileText,
  Mic,
  Compass,
  Globe,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
  Crosshair,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroTrajectoryVisual from '../components/HeroTrajectoryVisual';
import InteractiveAtsTransformer from '../components/InteractiveAtsTransformer';
import InteractiveInterviewProof from '../components/InteractiveInterviewProof';

export default function Landing() {
  const { user, signInWithDemo } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleDemoLaunch = () => {
    signInWithDemo('alex.developer@careerboost.ai', 'Alex Developer');
    navigate('/dashboard');
  };

  const scrollToSection = (id: string) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* 1. Architectural Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground flex items-center">
              CareerBoost
              <span className="text-primary font-mono text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                PRO v2.4
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
            <button
              type="button"
              onClick={() => scrollToSection('telemetry')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Trajectory Engine
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('ats-engine')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              ATS Diagnostic
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('mock-simulator')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              STAR Simulator
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('suite')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Tool Suite
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('methodology')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Methodology
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/95 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDemoLaunch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Launch with pre-seeded developer profile"
                >
                  <Play className="w-3 h-3 text-primary fill-primary" />
                  Instant Sandbox
                </button>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-xs"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted"
            aria-label="Toggle Navigation Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-b border-border bg-background p-4 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              <button
                type="button"
                onClick={() => scrollToSection('telemetry')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Trajectory Engine
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('ats-engine')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                ATS Diagnostic
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('mock-simulator')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                STAR Simulator
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('suite')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Tool Suite
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('methodology')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Methodology
              </button>
            </nav>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDemoLaunch}
                className="w-full py-2.5 rounded-lg border border-border text-xs font-semibold text-foreground flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                Launch Instant Sandbox
              </button>
              <Link
                to="/auth?mode=signup"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold text-center"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Asymmetric Two-Column Editorial Hero */}
      <section id="telemetry" className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-border bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Value Narrative (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Telemetry Kicker */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-card text-xs font-mono text-muted-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>TECHNICAL CAREER PLATFORM</span>
                <span className="text-border">/</span>
                <span className="text-primary font-semibold">2026 RECRUITER BENCHMARKS</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08]"
              >
                The disciplined path from code to senior offer.
              </motion.h1>

              {/* Supporting Copy */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                Skip generic advice. Benchmark your resume against real applicant tracking systems, drill timed mock technical rounds evaluated on the STAR framework, and navigate a verified curriculum toward your target compensation.
              </motion.p>

              {/* Hero Action Row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <Link
                  to={user ? '/dashboard' : '/auth?mode=signup'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/95 transition-all text-center"
                >
                  Build Your Career Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleDemoLaunch}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-xs hover:bg-muted transition-colors text-center cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                  Launch Instant Sandbox
                </button>
              </motion.div>

              {/* Trust Guarantees */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground border-t border-border/60"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Deterministic ATS scan
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> STAR answer evaluation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Isolated user privacy
                </span>
              </motion.div>
            </div>

            {/* Right Column: Hero Signature Interactive Visual (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="lg:col-span-5 w-full"
            >
              <HeroTrajectoryVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Proof of Method: Interactive ATS Transformer */}
      <section id="ats-engine" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-border">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Proof of Method: Diagnostic Engine</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Eliminate resume black holes with measurable keyword calibration.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Over 80% of developer applications fail automated applicant tracking algorithms before human inspection. CareerBoost AI pinpoints missing tech keywords, weak passive phrasing, and unquantified achievements.
          </p>
        </div>

        <InteractiveAtsTransformer />
      </section>

      {/* 4. Realistic Mock Interview Simulation */}
      <section id="mock-simulator" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-b border-border bg-muted/10">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Pressure-Tested Simulation</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Real interview questions. Evaluated on the STAR framework.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Answer technical, architectural, and behavioral prompts under realistic time constraints. Receive concrete feedback across technical depth, structured delivery, and conciseness.
          </p>
        </div>

        <InteractiveInterviewProof />
      </section>

      {/* 5. The 5 Core Capabilities: Asymmetric Editorial Suite */}
      <section id="suite" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-b border-border">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Engineering Suite</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Five focused instruments for your career advancement.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A cohesive system addressing every stage of the tech hiring pipeline without fragmented tools.
          </p>
        </div>

        {/* Varied Asymmetric Layout */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* Item 1: Job Matcher (7 Cols) */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Crosshair className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">01 // COMPATIBILITY</span>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  Precision Job & Skill Intersector
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 max-w-xl">
                  Evaluates your profile against curated market positions or any custom employer job description, outputting transparent match percentages and a prioritized gap list.
                </p>
              </div>

              {/* Mini feature snippet */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-emerald-500 block mb-0.5 font-semibold">Matched Skills</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">React</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">TypeScript</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[10px]">PostgreSQL</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-rose-500 block mb-0.5 font-semibold">Missing Requirements</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-mono text-[10px]">Redis Caching</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-mono text-[10px]">Kafka</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground">Curated + Custom Job Descriptions</span>
              <Link to="/jobs" className="text-primary font-semibold inline-flex items-center gap-1 hover:underline">
                Explore Job Matcher <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Item 2: Personalized Roadmap (5 Cols) */}
          <div className="lg:col-span-5 surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">02 // CURRICULUM</span>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  Phased Career Roadmap
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                  Structured learning tracks with verified engineering documentation links and hands-on milestone checklists.
                </p>
              </div>

              {/* Mini progression check */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">Phase 02: Distributed Systems</span>
                  <span className="text-emerald-500 font-bold">3/4 Done</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-3/4" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground">Interactive Checklists</span>
              <Link to="/roadmap" className="text-primary font-semibold inline-flex items-center gap-1 hover:underline">
                View Roadmap <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Item 3: ATS Resume Analyzer (4 Cols) */}
          <div className="lg:col-span-4 surface-card rounded-2xl p-6 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                ATS Resume Diagnostic
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan keyword density, verify section formatting, and generate quantified STAR bullet points with PDF/DOCX import.
              </p>
            </div>
            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground text-[11px]">Instant Scoring</span>
              <Link to="/resume" className="text-primary font-semibold hover:underline flex items-center gap-1">
                Scan <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Item 4: Mock Interview Simulator (4 Cols) */}
          <div className="lg:col-span-4 surface-card rounded-2xl p-6 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Mic className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                STAR Mock Interview
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Timed simulation rounds across technical architecture and behavioral questions with instant NLP rubric breakdown.
              </p>
            </div>
            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground text-[11px]">STAR Rubric</span>
              <Link to="/interview" className="text-primary font-semibold hover:underline flex items-center gap-1">
                Practice <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Item 5: Developer Showcase Portfolio (4 Cols) */}
          <div className="lg:col-span-4 surface-card rounded-2xl p-6 border border-border flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                Hosted Portfolio Showcase
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Publish a clean, responsive developer showcase with custom slugs (`/p/:slug`), theme options, and one-click PDF export.
              </p>
            </div>
            <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="font-mono text-muted-foreground text-[11px]">Live Hosting</span>
              <Link to="/portfolio" className="text-primary font-semibold hover:underline flex items-center gap-1">
                Publish <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Systematic 3-Step Methodology */}
      <section id="methodology" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 border-b border-border bg-muted/10">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Methodology</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            A three-step disciplined sequence to hiring readiness.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Eliminate trial-and-error by following an engineering-backed progression.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="surface-card p-6 sm:p-7 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">STAGE 01</span>
              <span className="font-mono text-[11px] text-muted-foreground">DIAGNOSTIC</span>
            </div>
            <h3 className="font-bold text-base text-foreground">
              Establish Quantitative Baseline
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan your resume against automated ATS filters. Pinpoint missing high-demand technical keywords, weak verbs, and unquantified metrics.
            </p>
          </div>

          <div className="surface-card p-6 sm:p-7 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">STAGE 02</span>
              <span className="font-mono text-[11px] text-muted-foreground">REINFORCE</span>
            </div>
            <h3 className="font-bold text-base text-foreground">
              Bridge Gaps & Drill Under Pressure
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete your personalized roadmap milestones with verified docs. Conduct timed mock technical rounds evaluated on STAR answer criteria.
            </p>
          </div>

          <div className="surface-card p-6 sm:p-7 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">STAGE 03</span>
              <span className="font-mono text-[11px] text-muted-foreground">DEPLOY</span>
            </div>
            <h3 className="font-bold text-base text-foreground">
              Publish Proof of Competence
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deploy your verified developer portfolio, link real GitHub implementations, and apply directly to matching roles with maximum qualification fit.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Take Command & Instant Sandbox CTA */}
      <section className="py-20 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="accent-badge text-primary font-bold">Immediate Access</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Start structuring your engineering career today.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Zero marketing fluff, no credit card required. Run a resume diagnostic or take a mock interview round in under three minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/95 transition-all"
            >
              Get Started for Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleDemoLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium text-xs hover:bg-muted transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 text-primary fill-primary" />
              Launch Instant Demo Sandbox
            </button>
          </div>
        </div>
      </section>

      {/* 8. Technical Minimalist Footer */}
      <footer className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <Briefcase className="w-3 h-3" />
            </div>
            <span className="font-bold text-sm text-foreground">CareerBoost AI</span>
            <span className="text-xs text-muted-foreground font-mono ml-2">© {new Date().getFullYear()}</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-4 text-[11px] font-mono text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Systems Operational
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-muted-foreground font-mono">
            <Link to="/resume" className="hover:text-foreground transition-colors">Resume ATS</Link>
            <Link to="/interview" className="hover:text-foreground transition-colors">Mock Rounds</Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">Job Matcher</Link>
            <Link to="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link>
            <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
