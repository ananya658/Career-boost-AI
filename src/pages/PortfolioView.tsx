import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ExternalLink,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Globe,
  Printer,
  ArrowLeft,
  Calendar,
  GraduationCap
} from 'lucide-react';

interface Project {
  title: string;
  description: string;
  link?: string;
  github?: string;
  tags?: string;
}

interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  highlights: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface PortfolioData {
  name: string;
  headline?: string;
  bio: string;
  theme?: 'modern' | 'executive' | 'creative' | 'cyber';
  skills: string[];
  projects: Project[];
  experience?: WorkExperience[];
  education?: EducationItem[];
  socialLinks?: {
    email?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  error?: string;
}

export default function PortfolioView() {
  const { slug } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/portfolios?slug=${encodeURIComponent(slug)}`);
        if (response.ok) {
          const raw = await response.json();
          const normalized: PortfolioData = {
            name: raw.name || 'Developer',
            headline: raw.headline || raw.title || '',
            bio: raw.bio || '',
            theme: raw.theme || 'modern',
            skills: Array.isArray(raw.skills) ? raw.skills : [],
            projects: Array.isArray(raw.projects) ? raw.projects : [],
            experience: Array.isArray(raw.experience) ? raw.experience : [],
            education: Array.isArray(raw.education) ? raw.education : [],
            socialLinks: raw.socialLinks || raw.social_links || {},
          };
          setData(normalized);
          document.title = `${normalized.name} — Developer Portfolio`;
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Remote portfolio lookup failed:', error);
      }

      const local = localStorage.getItem(`public_portfolio_${slug}`);
      if (local) {
        try {
          const raw = JSON.parse(local);
          const normalized: PortfolioData = {
            name: raw.name || 'Developer',
            headline: raw.headline || '',
            bio: raw.bio || '',
            theme: raw.theme || 'modern',
            skills: Array.isArray(raw.skills) ? raw.skills : [],
            projects: Array.isArray(raw.projects) ? raw.projects : [],
            experience: Array.isArray(raw.experience) ? raw.experience : [],
            education: Array.isArray(raw.education) ? raw.education : [],
            socialLinks: raw.socialLinks || raw.social_links || {},
          };
          setData(normalized);
          document.title = `${normalized.name} — Developer Portfolio`;
        } catch {
          setData({
            name: '',
            bio: '',
            skills: [],
            projects: [],
            socialLinks: {},
            error: 'Portfolio not found',
          });
        }
      } else {
        setData({
          name: '',
          bio: '',
          skills: [],
          projects: [],
          socialLinks: {},
          error: 'Portfolio not found',
        });
      }

      setLoading(false);
    };

    void fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-mono animate-pulse">Loading developer portfolio...</p>
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 text-center">
        <div className="max-w-md w-full surface-card rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Portfolio Not Found</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The portfolio URL <code className="text-primary font-mono font-medium">/p/{slug}</code> has not been published yet or has been removed.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Go to CareerBoost
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const theme = data.theme || 'modern';

  return (
    <div
      className={`min-h-screen print-container selection:bg-primary/20 ${
        theme === 'creative'
          ? 'bg-slate-950 text-slate-100'
          : theme === 'cyber'
          ? 'bg-slate-950 text-slate-100 font-mono'
          : theme === 'executive'
          ? 'bg-slate-900 text-slate-100'
          : 'bg-background text-foreground'
      }`}
    >
      {/* Top action bar (hidden on print) */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-3 no-print">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Builder
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Public View
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted font-medium transition-colors"
              title="Print to PDF"
            >
              <Printer className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Portfolio Content */}
      <main className="max-w-4xl mx-auto px-6 py-14 space-y-12">
        {/* Hero Section */}
        <header className="space-y-4 border-b border-border/60 pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {data.name}
            </h1>
            {data.headline && (
              <p className="text-base sm:text-lg font-medium text-primary">
                {data.headline}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 max-w-2xl">
              {data.bio}
            </p>
          </div>

          {/* Social and Contact Links */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            {data.socialLinks?.email && (
              <a
                href={`mailto:${data.socialLinks.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                {data.socialLinks.email}
              </a>
            )}
            {data.socialLinks?.github && (
              <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {data.socialLinks?.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {data.socialLinks?.website && (
              <a
                href={data.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </header>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Technical Stack & Competencies
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Featured Engineering Projects
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="surface-card rounded-xl p-5 border border-border space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="View source"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline transition-colors"
                            title="Live demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.tags && (
                    <div className="pt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                      {project.tags}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Professional Work Experience
            </h2>

            <div className="space-y-5">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-primary/30 pl-4 space-y-1 relative">
                  <div className="w-2 h-2 rounded-full bg-primary absolute -left-[5px] top-1.5" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {exp.role} <span className="text-muted-foreground font-normal">• {exp.company}</span>
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {exp.highlights}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
              Education & Credentials
            </h2>

            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl surface-card border border-border/60">
                  <GraduationCap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-[11px] text-muted-foreground font-mono">{edu.institution} • {edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Verified Developer Profile • CareerBoost AI
          </span>
          <Link to="/" className="text-primary font-semibold hover:underline no-print">
            Build your own portfolio free →
          </Link>
        </footer>
      </main>
    </div>
  );
}
