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
  socialLinks: {
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
          const result = (await response.json()) as PortfolioData;
          setData(result);
          document.title = `${result.name} — Developer Portfolio`;
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Remote portfolio lookup failed:', error);
      }

      const local = localStorage.getItem(`public_portfolio_${slug}`);
      if (local) {
        const parsed = JSON.parse(local) as PortfolioData;
        setData(parsed);
        document.title = `${parsed.name} — Developer Portfolio`;
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
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-medium animate-pulse">Loading developer portfolio...</p>
        </div>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6 text-center">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display">Portfolio Not Found</h1>
          <p className="text-xs text-muted-foreground">
            The portfolio URL <code className="text-primary font-mono font-bold">/p/{slug}</code> has not been published yet or has been updated.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Go to CareerBoost Home
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
          ? 'bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-slate-100'
          : theme === 'cyber'
          ? 'bg-slate-950 text-cyan-400 font-mono'
          : theme === 'executive'
          ? 'bg-slate-900 text-slate-100'
          : 'bg-background text-foreground'
      }`}
    >
      {/* Top action header (hidden on print) */}
      <div className="no-print border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            CareerBoost Showcase
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors text-foreground"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-20 space-y-16">
        {/* Hero Section */}
        <header className="space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-primary/25">
            {data.name?.charAt(0).toUpperCase() || 'P'}
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-foreground">
              {data.name}
            </h1>
            {data.headline && (
              <p className="text-lg sm:text-xl font-semibold text-primary">
                {data.headline}
              </p>
            )}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-2 max-w-2xl">
              {data.bio}
            </p>
          </div>

          {/* Social and Contact Badges */}
          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            {data.socialLinks.email && (
              <a
                href={`mailto:${data.socialLinks.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                {data.socialLinks.email}
              </a>
            )}
            {data.socialLinks.github && (
              <a
                href={data.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {data.socialLinks.linkedin && (
              <a
                href={data.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {data.socialLinks.website && (
              <a
                href={data.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </header>

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border/60 pb-2">
              Technical Stack & Competencies
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {data.projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border/60 pb-2">
              Featured Engineering Projects
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold font-display text-foreground">{project.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
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
                            className="text-primary hover:underline"
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
                    <div className="pt-3 border-t border-border/50 text-[11px] font-mono text-primary/80">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border/60 pb-2">
              Professional Work Experience
            </h2>

            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-primary/40 pl-5 space-y-1.5 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary absolute -left-[6px] top-1.5" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-foreground">
                      {exp.role} <span className="text-primary font-normal">• {exp.company}</span>
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border/60 pb-2">
              Education & Credentials
            </h2>

            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <GraduationCap className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{edu.degree}</h3>
                    <p className="text-[11px] text-muted-foreground">{edu.institution} • {edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" /> Verified Developer Profile • CareerBoost AI
          </span>
          <Link to="/" className="text-primary font-bold hover:underline no-print">
            Build your own portfolio free →
          </Link>
        </footer>
      </main>
    </div>
  );
}
