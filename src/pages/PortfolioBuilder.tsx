import { useEffect, useState } from 'react';
import {
  ExternalLink,
  Loader2,
  Save,
  Plus,
  Trash2,
  Globe,
  Copy,
  Check,
  Eye,
  Github,
  Linkedin,
  Mail,
  Smartphone,
  Monitor,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, awardXp } from '../lib/database';
import supabase, { isSupabaseConfigured } from '../lib/supabase';

interface PortfolioProject {
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
  id?: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  theme: 'modern' | 'executive' | 'creative' | 'cyber';
  skills: string[];
  projects: PortfolioProject[];
  experience: WorkExperience[];
  education: EducationItem[];
  socialLinks: {
    email: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export default function PortfolioBuilder() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<'modern' | 'executive' | 'creative' | 'cyber'>('modern');
  const [skillsText, setSkillsText] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  const [projects, setProjects] = useState<PortfolioProject[]>([
    {
      title: 'Real-Time SaaS Platform',
      description: 'Engineered full-stack collaborative productivity suite with optimistic UI updates and PostgreSQL backend.',
      link: 'https://example.com/demo',
      github: 'https://github.com/example/saas',
      tags: 'React, TypeScript, Node.js, PostgreSQL'
    }
  ]);

  const [experience, setExperience] = useState<WorkExperience[]>([
    {
      role: 'Full Stack Engineer',
      company: 'TechFlow Systems',
      duration: '2023 - Present',
      highlights: 'Spearheaded migration to Next.js and Tailwind CSS, reducing average page load latency by 45%.'
    }
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      year: '2022'
    }
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioData = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const defaultSlug = `${(user.email ?? 'dev').split('@')[0]}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

        let existingPortfolio: PortfolioData | null = null;

        // Try remote fetch if configured
        if (isSupabaseConfigured) {
          const { data } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (data) {
            existingPortfolio = {
              id: data.id,
              slug: data.slug,
              name: data.name,
              headline: data.title || '',
              bio: data.bio || '',
              theme: data.theme || 'modern',
              skills: data.skills || [],
              projects: data.projects || [],
              experience: data.experience || [],
              education: data.education || [],
              socialLinks: data.social_links || { email: user.email || '' },
            };
          }
        }

        // Try local storage fallback
        if (!existingPortfolio) {
          const local = localStorage.getItem(`portfolio_${user.id}`);
          if (local) existingPortfolio = JSON.parse(local) as PortfolioData;
        }

        // If still empty, prepopulate from profile
        if (!existingPortfolio) {
          const profile = await getUserProfile(user.id);
          existingPortfolio = {
            slug: defaultSlug,
            name: profile?.full_name || user.email?.split('@')[0] || 'Software Engineer',
            headline: profile?.headline || 'Full Stack Engineer & Problem Solver',
            bio: profile?.bio || 'Building scalable, accessible, and user-first web applications using modern cloud architectures.',
            theme: 'modern',
            skills: profile?.skills?.length ? profile.skills : ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
            projects: [
              {
                title: 'High-Throughput Analytics Dashboard',
                description: 'Real-time telemetry and charting application handling 50k+ daily events with React and Supabase.',
                link: 'https://example.com',
                github: 'https://github.com',
                tags: 'React, Recharts, TypeScript'
              }
            ],
            experience: [
              {
                role: 'Software Engineer',
                company: 'TechCorp',
                duration: '2023 - Present',
                highlights: 'Designed responsive user interfaces and GraphQL microservices with 99.9% uptime.'
              }
            ],
            education: [
              {
                degree: 'B.S. in Computer Science / Software Engineering',
                institution: 'Tech Institute',
                year: '2023'
              }
            ],
            socialLinks: {
              email: user.email || '',
              github: 'https://github.com',
              linkedin: 'https://linkedin.com',
              website: 'https://example.com'
            }
          };
        }

        if (isMounted && existingPortfolio) {
          setSlug(existingPortfolio.slug);
          setName(existingPortfolio.name);
          setHeadline(existingPortfolio.headline);
          setBio(existingPortfolio.bio);
          setTheme(existingPortfolio.theme || 'modern');
          setSkillsText(existingPortfolio.skills.join(', '));
          setEmail(existingPortfolio.socialLinks.email || user.email || '');
          setGithub(existingPortfolio.socialLinks.github || '');
          setLinkedin(existingPortfolio.socialLinks.linkedin || '');
          setWebsite(existingPortfolio.socialLinks.website || '');
          if (existingPortfolio.projects?.length) setProjects(existingPortfolio.projects);
          if (existingPortfolio.experience?.length) setExperience(existingPortfolio.experience);
          if (existingPortfolio.education?.length) setEducation(existingPortfolio.education);
        }
      } catch (err) {
        console.error('Error loading portfolio:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadPortfolioData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatusMessage(null);

    const cleanSlug = (slug || user.email?.split('@')[0] || 'dev').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const cleanSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const portfolioRecord: PortfolioData = {
      slug: cleanSlug,
      name: name.trim() || 'Software Engineer',
      headline: headline.trim(),
      bio: bio.trim(),
      theme,
      skills: cleanSkills,
      projects,
      experience,
      education,
      socialLinks: {
        email: email.trim(),
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        website: website.trim() || undefined,
      },
    };

    // Store in public access cache for instant /p/:slug viewing
    localStorage.setItem(`public_portfolio_${cleanSlug}`, JSON.stringify(portfolioRecord));
    localStorage.setItem(`portfolio_${user.id}`, JSON.stringify(portfolioRecord));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('portfolios').upsert(
          {
            user_id: user.id,
            slug: cleanSlug,
            name: portfolioRecord.name,
            title: portfolioRecord.headline,
            bio: portfolioRecord.bio,
            skills: portfolioRecord.skills,
            projects: portfolioRecord.projects,
            experience: portfolioRecord.experience,
            education: portfolioRecord.education,
            social_links: portfolioRecord.socialLinks,
            theme: portfolioRecord.theme,
            published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      } catch (err) {
        console.warn('Supabase portfolio sync error:', err);
      }
    }

    await awardXp(user.id, 60);

    setStatusMessage('Portfolio successfully published & saved!');
    setTimeout(() => setStatusMessage(null), 4000);
    setSaving(false);
  };

  const handleCopyShareLink = () => {
    const fullUrl = `${window.location.origin}/p/${slug}`;
    void navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { title: '', description: '', link: '', github: '', tags: '' }
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      { role: '', company: '', duration: '', highlights: '' }
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience((prev) => prev.filter((_, idx) => idx !== index));
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      { degree: '', institution: '', year: '' }
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const publicUrl = `/p/${slug}`;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Header & Publishing Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-foreground">Developer Portfolio Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, theme, and publish a live responsive developer showcase with instant shareable links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Copied!' : 'Copy Share URL'}
          </button>

          <Link
            to={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Preview Tab
          </Link>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save & Publish
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          {statusMessage}
        </div>
      )}

      {/* Editor & Preview Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-6 space-y-6">
          {/* Identity & Slug Settings */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Public URL & Theme
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Custom URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-border bg-background px-3 py-2 text-xs">
                  <span className="text-muted-foreground">/p/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-name"
                    className="flex-1 bg-transparent font-mono outline-none text-foreground ml-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Visual Theme Template
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'modern' | 'executive' | 'creative' | 'cyber')}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="modern">Modern Minimal</option>
                  <option value="executive">Executive Slate</option>
                  <option value="creative">Creative Aurora</option>
                  <option value="cyber">Cyber Tech</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Full Stack Engineer | React, TypeScript, Cloud"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                About & Bio Summary
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell recruiters and visitors about your technical passion and achievements..."
                className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Key Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, TypeScript, Next.js, PostgreSQL, Docker, Tailwind CSS"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Featured Projects */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-foreground">Featured Projects ({projects.length})</h2>
              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].title = e.target.value;
                      setProjects(updated);
                    }}
                    placeholder="Project Name"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                  />

                  <textarea
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].description = e.target.value;
                      setProjects(updated);
                    }}
                    rows={2}
                    placeholder="Brief description of the problem solved, architecture, and impact..."
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none resize-none"
                  />

                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={proj.link || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].link = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="Live Demo URL (https://...)"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                    <input
                      type="url"
                      value={proj.github || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].github = e.target.value;
                        setProjects(updated);
                      }}
                      placeholder="GitHub Repo URL"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-foreground">Work Experience ({experience.length})</h2>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Role
              </button>
            </div>

            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Role #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].role = e.target.value;
                        setExperience(updated);
                      }}
                      placeholder="Job Title (e.g. Frontend Engineer)"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].company = e.target.value;
                        setExperience(updated);
                      }}
                      placeholder="Company Name"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].duration = e.target.value;
                      setExperience(updated);
                    }}
                    placeholder="Duration (e.g. 2022 - Present)"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                  />

                  <textarea
                    value={exp.highlights}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[idx].highlights = e.target.value;
                      setExperience(updated);
                    }}
                    rows={2}
                    placeholder="Key impact and deliverables..."
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education Credentials */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education ({education.length})
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Credential #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].degree = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="Degree / Certificate (e.g. B.S. in Computer Science)"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].institution = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="University / Organization"
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].year = e.target.value;
                      setEducation(updated);
                    }}
                    placeholder="Graduation Year (e.g. 2023)"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <h2 className="text-base font-bold font-display text-foreground">Contact & Social Links</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domain.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">GitHub</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">Portfolio / Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-1.5 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Device Preview */}
        <div className="lg:col-span-6 sticky top-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Eye className="w-4 h-4 text-primary" />
              Live Responsive Preview
            </div>

            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'desktop' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'mobile' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mock Preview Window */}
          <div
            className={`mx-auto transition-all duration-300 rounded-3xl border border-border shadow-2xl overflow-hidden ${
              previewDevice === 'mobile' ? 'max-w-[375px]' : 'w-full'
            } ${
              theme === 'creative'
                ? 'bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 text-slate-100'
                : theme === 'cyber'
                ? 'bg-slate-950 text-cyan-400 font-mono border-cyan-500/30'
                : theme === 'executive'
                ? 'bg-slate-900 text-slate-100'
                : 'bg-card text-foreground'
            }`}
          >
            {/* Browser chrome header */}
            <div className="bg-muted/40 border-b border-border/50 px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono truncate">careerboost.ai/p/{slug}</span>
              <div className="w-4" />
            </div>

            {/* Rendered Portfolio Content */}
            <div className="p-6 sm:p-8 space-y-7 max-h-[700px] overflow-y-auto">
              {/* Header */}
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg">
                  {name ? name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-display">{name || 'Your Name'}</h3>
                  <p className="text-xs text-primary font-semibold mt-0.5">{headline || 'Professional Title'}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{bio}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1 text-xs">
                  {email && <span className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3.5 h-3.5" />{email}</span>}
                  {github && <span className="flex items-center gap-1 text-primary"><Github className="w-3.5 h-3.5" />GitHub</span>}
                  {linkedin && <span className="flex items-center gap-1 text-primary"><Linkedin className="w-3.5 h-3.5" />LinkedIn</span>}
                </div>
              </div>

              {/* Skills */}
              {skillsText && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Core Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsText.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured Projects</h4>
                  <div className="space-y-3">
                    {projects.map((p, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{p.title || 'Project Title'}</span>
                          {p.link && <ExternalLink className="w-3 h-3 text-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {experience.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience</h4>
                  <div className="space-y-2.5">
                    {experience.map((exp, i) => (
                      <div key={i} className="border-l-2 border-primary/40 pl-3 space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">{exp.role || 'Role'} • {exp.company || 'Company'}</span>
                        <span className="text-[10px] text-muted-foreground block">{exp.duration}</span>
                        <p className="text-[11px] text-muted-foreground mt-1">{exp.highlights}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
