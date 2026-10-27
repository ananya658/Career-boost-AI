import { dedupeSkills, findMissingSkills, normalizeSkill } from './skills';

export interface Job {
  id: string;
  title: string;
  company: string;
  required_skills: string[];
  preferred_skills?: string[];
  description: string;
  location?: string;
  type?: string;
  salary_range?: string;
  experience_level?: string;
  url?: string;
}

export interface MatchResult {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchExplanation: string;
  recommendations: string[];
}

export function explainMatchFit(
  score: number,
  matchedSkills: string[],
  missingSkills: string[],
  jobTitle: string
): { matchExplanation: string; recommendations: string[] } {
  let matchExplanation = '';
  const recommendations: string[] = [];

  if (score >= 80) {
    matchExplanation = `Exceptional alignment (${score}%). You possess almost all core competencies required for ${jobTitle}, notably ${matchedSkills.slice(0, 3).join(', ')}. Your application will comfortably rank in top ATS percentiles.`;
    if (missingSkills.length > 0) {
      recommendations.push(
        `Highlight familiarity or fast-learning capability with ${missingSkills.slice(0, 2).join(' and ')} in your cover letter.`
      );
    }
    recommendations.push('Quantify technical accomplishments in previous projects to stand out in screening calls.');
  } else if (score >= 55) {
    matchExplanation = `Moderate-to-Strong alignment (${score}%). You meet several critical requirements (${matchedSkills.slice(0, 3).join(', ')}), but have key gaps in ${missingSkills.slice(0, 2).join(', ')}.`;
    recommendations.push(
      `Bridge your gap in ${missingSkills[0] || 'missing technologies'} with a small proof-of-concept project on GitHub.`
    );
    recommendations.push('Tailor your resume summary to directly address the job’s day-to-day deliverables.');
  } else {
    matchExplanation = `Foundational alignment (${score}%). While you bring ${matchedSkills.length ? matchedSkills.join(', ') : 'transferable skills'}, this position heavily relies on ${missingSkills.slice(0, 3).join(', ')}.`;
    recommendations.push(
      `Prioritize mastering ${missingSkills.slice(0, 2).join(' and ')} before applying for senior variants of this role.`
    );
    recommendations.push('Look for associate or junior postings in this domain as stepping stones.');
  }

  return { matchExplanation, recommendations };
}

export function calculateMatch(
  userSkills: string[],
  jobSkills: string[],
  jobTitle = 'Target Role'
): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchExplanation: string;
  recommendations: string[];
} {
  const uniqueUserSkills = dedupeSkills(userSkills);
  const userSkillSet = new Set(uniqueUserSkills.map((skill) => normalizeSkill(skill)));

  const matchedSkills = dedupeSkills(jobSkills).filter((skill) => userSkillSet.has(normalizeSkill(skill)));
  const missingSkills = findMissingSkills(uniqueUserSkills, jobSkills);

  const score = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0;
  const { matchExplanation, recommendations } = explainMatchFit(score, matchedSkills, missingSkills, jobTitle);

  return {
    score,
    matchedSkills,
    missingSkills,
    matchExplanation,
    recommendations,
  };
}

export function matchJobs(
  userSkills: string[],
  jobs: Job[],
  limit = 12
): MatchResult[] {
  const normalizedSkills = dedupeSkills(userSkills);

  const ranked: MatchResult[] = jobs
    .map((job) => {
      const { score, matchedSkills, missingSkills, matchExplanation, recommendations } = calculateMatch(
        normalizedSkills,
        job.required_skills,
        job.title
      );
      return {
        job,
        score,
        matchedSkills,
        missingSkills,
        matchExplanation,
        recommendations,
      };
    })
    .sort((a, b) => b.score - a.score || b.matchedSkills.length - a.matchedSkills.length);

  return ranked.slice(0, limit);
}
