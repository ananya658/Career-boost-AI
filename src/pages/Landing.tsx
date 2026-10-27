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
  Code2,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CareerJourneyMap from '../components/CareerJourneyMap';
import ProductPreview from '../components/ProductPreview';

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
      {/* 1. Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-foreground">
              CareerBoost<span className="text-primary font-mono text-xs ml-1 px-1.5 py-0.5 rounded bg-primary/10">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            <button
              type="button"
              onClick={() => scrollToSection('capabilities')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('journey')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Interactive Map
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('preview')}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Live Preview
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
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDemoLaunch}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 text-primary fill-primary" />
                  Instant Sandbox
                </button>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
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
                onClick={() => scrollToSection('capabilities')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Capabilities
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('journey')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Interactive Map
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('preview')}
                className="text-left py-1.5 text-muted-foreground hover:text-foreground"
              >
                Live Preview
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
                Launch Instant Demo
              </button>
              <Link
                to="/auth?mode=signup"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Editorial Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 border-b border-border bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-mono text-muted-foreground shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Structured Career Acceleration Platform</span>
            <span className="text-border">|</span>
            <span className="text-primary font-semibold">Engineering Track</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-foreground max-w-4xl"
          >
            The deliberate path from software engineer to hired.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Benchmark your resume against applicant tracking systems, simulate realistic technical and behavioral rounds under pressure, and navigate your milestone curriculum with measurable clarity.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            <Link
              to={user ? '/dashboard' : '/auth?mode=signup'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-xs hover:bg-primary/90 transition-all text-center"
            >
              Build Your Career Plan
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection('journey')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors text-center cursor-pointer"
            >
              Explore Interactive Pipeline
            </button>
          </motion.div>

          {/* Trust Guarantees */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Real ATS parsing logic
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> STAR-format answer feedback
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Private, user-isolated data
            </span>
          </motion.div>
        </div>
      </section>

      {/* 3. Signature Motion Graphic: Career Progression Pipeline */}
      <section id="journey" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Interactive Progression Map</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            A cohesive system, not disconnected tools.
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore how each capability feeds directly into the next stage of your preparation.
          </p>
        </div>

        <CareerJourneyMap />
      </section>

      {/* 4. Product Preview Section */}
      <section id="preview" className="py-16 border-t border-border bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="accent-badge text-primary font-bold">Workspace Inspection</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
                Genuine application preview.
              </h2>
              <p className="text-sm text-muted-foreground">
                Test the actual interfaces used for keyword parsing, timed question responses, and role alignment.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Simulated interactive state
            </span>
          </div>

          <ProductPreview />
        </div>
      </section>

      {/* 5. Core Capabilities (Bento Architecture) */}
      <section id="capabilities" className="py-20 border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="accent-badge text-primary font-bold">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Five focused instruments for engineering advancement.
          </h2>
          <p className="text-sm text-muted-foreground">
            Every feature addresses a specific bottleneck in the tech hiring funnel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* 1. Resume Analyzer */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Resume ATS Analyzer
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Evaluates keyword density, bullet point metrics, and section structure against automated screening filters.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">PDF & DOCX Support</span>
              <Link to="/resume" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                Inspect <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Interview Simulator */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                STAR Interview Simulator
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Timed questions for frontend, backend, devops, and data roles with instant breakdown across clarity and technical accuracy.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">STAR Framework Rubric</span>
              <Link to="/interview" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                Practice <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Job Matcher */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Crosshair className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Precision Job Matcher
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Computes match percentages against market positions, revealing exact skill intersections and missing qualifications.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">22 Curated Positions</span>
              <Link to="/jobs" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                Match <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4. Career Roadmap */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6 md:col-span-2">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Personalized Engineering Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Structured phased progression from fundamentals to distributed production architectures, with verified documentation links and practical portfolio milestone recommendations.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Interactive Checkbox Tracking</span>
              <Link to="/roadmap" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                Explore Curriculum <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 5. Portfolio Builder */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Hosted Developer Portfolio
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Deploy clean, responsive developer showcase sites with print-to-PDF formatting hosted on custom slugs.
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Shareable `/p/:slug`</span>
              <Link to="/portfolio" className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline">
                Publish <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Methodology: How It Works */}
      <section id="methodology" className="py-20 border-t border-border bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="accent-badge text-primary font-bold">Methodology</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
              Three disciplined steps to hiring readiness.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="surface-card p-6 sm:p-8 rounded-xl border border-border space-y-3">
              <span className="font-mono text-xs font-bold text-primary">01 / AUDIT</span>
              <h3 className="font-display font-bold text-base text-foreground">
                Establish Your Quantitative Baseline
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan your resume and background against automated ATS filters. Pinpoint missing high-frequency tech terms, weak action verbs, and unquantified achievements.
              </p>
            </div>

            <div className="surface-card p-6 sm:p-8 rounded-xl border border-border space-y-3">
              <span className="font-mono text-xs font-bold text-primary">02 / DRILL</span>
              <h3 className="font-display font-bold text-base text-foreground">
                Bridge Deficiencies & Practice Under Pressure
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Follow your verified milestone curriculum. Conduct timed technical interview rounds and refine answers with actionable STAR evaluation scoring.
              </p>
            </div>

            <div className="surface-card p-6 sm:p-8 rounded-xl border border-border space-y-3">
              <span className="font-mono text-xs font-bold text-primary">03 / SHOWCASE</span>
              <h3 className="font-display font-bold text-base text-foreground">
                Deploy Proof of Competence
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Publish a recruiter-ready portfolio, link your projects, and apply directly to matching roles with maximum qualification alignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Action & Minimal Footer */}
      <section className="py-20 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="accent-badge text-primary font-bold">Take Command</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-foreground">
            Start structuring your engineering career today.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Zero fluff, no credit card required. Run a resume diagnostic or take a mock interview round in under three minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 transition-all"
            >
              Get Started for Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleDemoLaunch}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-xs hover:bg-muted transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 text-primary fill-primary" />
              Launch Instant Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <Briefcase className="w-3 h-3" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">CareerBoost AI</span>
            <span className="text-xs text-muted-foreground font-mono ml-2">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
            <Link to="/resume" className="hover:text-foreground transition-colors">Resume Analyzer</Link>
            <Link to="/interview" className="hover:text-foreground transition-colors">Mock Simulator</Link>
            <Link to="/jobs" className="hover:text-foreground transition-colors">Job Matcher</Link>
            <Link to="/roadmap" className="hover:text-foreground transition-colors">Career Roadmap</Link>
            <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio Builder</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
