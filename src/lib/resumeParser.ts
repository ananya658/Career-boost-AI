import { extractSkillsFromText, findMissingSkills } from './skills';

export interface ParsedResume {
  skills: string[];
  education: string[];
  experience: string[];
  projects: string[];
  metricsFound: string[];
  suggestions: string[];
  strengths: string[];
  improvedBullets: string[];
}

const EDUCATION_PATTERNS = [
  /\b(bachelor(?:'s)?|b\.tech|btech|b\.e\.?|bs|bsc|bca)\b/gi,
  /\b(master(?:'s)?|m\.tech|mtech|ms|msc|mba|mca)\b/gi,
  /\b(phd|doctorate)\b/gi,
  /\b(university|college|institute|polytechnic|academy)\b/gi,
];

const EXPERIENCE_KEYWORDS = [
  'designed',
  'developed',
  'implemented',
  'optimized',
  'led',
  'delivered',
  'deployed',
  'migrated',
  'automated',
  'analyzed',
  'scaled',
  'integrated',
  'collaborated',
  'architected',
  'refactored',
  'maintained',
  'engineered',
];

const METRIC_PATTERNS = [
  /\b\d+%\b/g,
  /\b\d+\s*(?:ms|seconds|minutes|hours)\b/gi,
  /\$\s*\d+[\d,.]*(?:k|m|b)?\b/gi,
  /\b\d+[\d,.]*\s*(?:users|clients|requests|transactions|downloads|stars)\b/gi,
  /\b(?:reduced|increased|improved|boosted|cut|saved)\s+by\s+\d+%/gi,
];

const ROLE_PRIORITY_SKILLS: Record<string, string[]> = {
  'Frontend Developer': ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript', 'Tailwind CSS', 'Next.js', 'Testing'],
  'Backend Developer': ['Node.js', 'PostgreSQL', 'REST API', 'Docker', 'Redis', 'SQL', 'Python', 'System Design'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'REST API', 'Git', 'CSS'],
  'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'Monitoring', 'Bash'],
  'Data Analyst': ['SQL', 'Python', 'Pandas', 'Tableau', 'Excel', 'Statistics', 'Power BI', 'Data Analysis'],
};

function collectEducation(text: string): string[] {
  const found = new Set<string>();
  for (const pattern of EDUCATION_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      if (match[0]) found.add(match[0].trim());
    }
  }
  return Array.from(found);
}

function collectExperienceKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return EXPERIENCE_KEYWORDS.filter((keyword) => lower.includes(keyword));
}

function collectMetrics(text: string): string[] {
  const found: string[] = [];
  for (const pattern of METRIC_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches.slice(0, 4));
  }
  return Array.from(new Set(found));
}

function collectProjects(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const projects: string[] = [];
  for (const line of lines) {
    if (/(?:project|portfolio|built|developed|application|dashboard|api|pipeline|service)\b/i.test(line) && line.trim().length > 15) {
      projects.push(line.trim().slice(0, 100));
    }
  }
  return projects.slice(0, 5);
}

export function generateImprovedBullets(rawText: string, skills: string[]): string[] {
  const lines = rawText
    .split(/\r?\n|[•\-*]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 20 && l.length < 180);

  const topSkill = skills[0] || 'modern tech stack';
  const secondSkill = skills[1] || 'automated testing';

  const bullets: string[] = [];

  if (lines.length > 0) {
    bullets.push(
      `Architected and shipped scalable solutions using ${topSkill}, enhancing system responsiveness and user experience.`
    );
  }

  if (lines.length > 1) {
    bullets.push(
      `Optimized data flows and component state with ${secondSkill}, reducing latency by ~30% across key workflows.`
    );
  } else {
    bullets.push(
      `Collaborated across engineering and product to deliver maintainable, tested features using ${topSkill}.`
    );
  }

  bullets.push(
    `Refactored core workflows with robust error handling and clean architecture, increasing code coverage and test reliability.`
  );

  return bullets;
}

export function buildResumeSuggestions(
  skills: string[],
  education: string[],
  experience: string[],
  metrics: string[],
  targetRole?: string
): { suggestions: string[]; strengths: string[] } {
  const suggestions: string[] = [];
  const strengths: string[] = [];

  if (skills.length >= 8) {
    strengths.push(`Rich skill inventory detected (${skills.length} technical skills found).`);
  } else {
    suggestions.push('Add 4-5 more role-specific tools, libraries, or frameworks to pass keyword thresholds.');
  }

  if (metrics.length >= 2) {
    strengths.push('Demonstrates quantifiable results with numerical metrics (e.g. percentages, user scale).');
  } else {
    suggestions.push('Add quantified metrics to your bullet points (e.g. "Reduced bundle size by 25%", "Supported 5,000+ daily active users").');
  }

  if (education.length > 0) {
    strengths.push('Education credentials clearly indicated.');
  } else {
    suggestions.push('Include formal or informal education milestones (degree, bootcamp, or major certifications).');
  }

  if (experience.length >= 6) {
    strengths.push('Effective use of strong engineering action verbs (e.g. architected, optimized, deployed).');
  } else {
    suggestions.push('Replace passive phrasing like "responsible for" with high-impact action verbs like "spearheaded", "engineered", or "benchmarked".');
  }

  if (targetRole && ROLE_PRIORITY_SKILLS[targetRole]) {
    const missingPriority = findMissingSkills(skills, ROLE_PRIORITY_SKILLS[targetRole]);
    if (missingPriority.length > 0) {
      suggestions.push(`For ${targetRole}, consider adding concrete evidence of: ${missingPriority.slice(0, 3).join(', ')}.`);
    }
  }

  return { suggestions, strengths };
}

export function parseResume(text: string, targetRole = 'Full Stack Developer'): ParsedResume {
  const normalizedText = text.replace(/\s+/g, ' ').trim();

  const skills = extractSkillsFromText(normalizedText);
  const education = collectEducation(normalizedText);
  const experience = collectExperienceKeywords(normalizedText);
  const metricsFound = collectMetrics(normalizedText);
  const projects = collectProjects(text);
  const { suggestions, strengths } = buildResumeSuggestions(skills, education, experience, metricsFound, targetRole);
  const improvedBullets = generateImprovedBullets(text, skills);

  return {
    skills,
    education,
    experience,
    projects,
    metricsFound,
    suggestions,
    strengths,
    improvedBullets,
  };
}

export function calculateResumeScore(parsed: ParsedResume, targetRole = 'Full Stack Developer'): number {
  const skillCoverage = Math.min(parsed.skills.length / 10, 1) * 45;
  const educationScore = parsed.education.length > 0 ? 15 : 5;
  const experienceScore = Math.min(parsed.experience.length / 6, 1) * 20;
  const metricsScore = Math.min(parsed.metricsFound.length / 2, 1) * 10;

  let roleFitBonus = 0;
  if (ROLE_PRIORITY_SKILLS[targetRole]) {
    const matched = parsed.skills.filter((s) =>
      ROLE_PRIORITY_SKILLS[targetRole].some((p) => p.toLowerCase() === s.toLowerCase())
    );
    roleFitBonus = Math.min(matched.length * 2, 10);
  }

  return Math.max(25, Math.min(98, Math.round(skillCoverage + educationScore + experienceScore + metricsScore + roleFitBonus)));
}

export function parseJobDescriptionSkills(description: string): string[] {
  return extractSkillsFromText(description);
}

export function recommendMissingSkills(resumeSkills: string[], jobSkills: string[], limit = 6): string[] {
  return findMissingSkills(resumeSkills, jobSkills).slice(0, limit);
}
