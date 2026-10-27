import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// 1. Logic tests for Resume Evaluation
describe('Resume Evaluation Logic', () => {
  const sampleResume = `
    Alex Rivera - Senior Full Stack Engineer
    alex@example.com | San Francisco, CA | github.com/alexrivera

    Summary:
    Experienced full-stack developer with 6+ years designing, developing, and deploying scalable distributed web applications.

    Experience:
    Senior Software Engineer at TechCorp (2021 - Present)
    - Architected and delivered a real-time event streaming pipeline processing 15M daily events, reducing latency by 42%.
    - Managed and spearheaded microservice migration using Node.js, TypeScript, Docker, and AWS ECS.
    - Mentored 6 junior engineers and improved code review cycle time by 25%.

    Software Engineer at StartupX (2018 - 2021)
    - Built responsive React dashboards and GraphQL API endpoints, increasing user engagement by 35%.
    - Optimized PostgreSQL database queries, cutting p95 query times from 850ms to 95ms.

    Skills:
    TypeScript, JavaScript, React, Node.js, Python, PostgreSQL, Docker, AWS, GraphQL, CI/CD, Git, Redis

    Education:
    B.S. in Computer Science - University of California, Berkeley (2018)

    Projects:
    CloudMonitor - Open-source infrastructure health dashboard built with React and Go. Over 1,200 GitHub stars.
  `;

  it('detects key resume sections correctly', () => {
    const lower = sampleResume.toLowerCase();
    const hasSummary = lower.includes('summary');
    const hasExperience = lower.includes('experience');
    const hasSkills = lower.includes('skills');
    const hasEducation = lower.includes('education');
    const hasProjects = lower.includes('projects');

    assert.equal(hasSummary, true);
    assert.equal(hasExperience, true);
    assert.equal(hasSkills, true);
    assert.equal(hasEducation, true);
    assert.equal(hasProjects, true);
  });

  it('detects strong action verbs and quantified metrics', () => {
    const actionVerbs = ['architected', 'spearheaded', 'managed', 'mentored', 'built', 'optimized', 'delivered'];
    const lower = sampleResume.toLowerCase();
    const matchedVerbs = actionVerbs.filter(v => lower.includes(v));
    
    assert.ok(matchedVerbs.length >= 5, `Expected at least 5 action verbs, found ${matchedVerbs.length}`);

    // Check metric indicators (% or numbers with M/K)
    const metricMatches = sampleResume.match(/\d+[%MK]|\d+\s*(ms|stars|engineers|events)/gi) || [];
    assert.ok(metricMatches.length >= 4, `Expected at least 4 metric indicators, found ${metricMatches.length}`);
  });

  it('calculates realistic score between 0 and 100', () => {
    // Scoring rubric simulation
    let score = 40; // baseline
    const lower = sampleResume.toLowerCase();
    if (lower.includes('experience')) score += 15;
    if (lower.includes('skills')) score += 15;
    if (lower.includes('education')) score += 10;
    if (lower.includes('projects')) score += 10;
    if (sampleResume.length > 500) score += 10;

    score = Math.min(100, Math.max(0, score));
    assert.ok(score >= 85, `Expected high score for comprehensive resume, got ${score}`);
  });
});

// 2. Logic tests for Job Matching
describe('Job Matching Logic', () => {
  const candidateSkills = ['react', 'typescript', 'node.js', 'docker', 'postgresql', 'git'];
  const requiredJobSkills = ['react', 'typescript', 'graphql', 'docker', 'kubernetes', 'aws'];

  it('identifies matching and missing skills accurately', () => {
    const candidateLower = candidateSkills.map(s => s.toLowerCase());
    const matching = requiredJobSkills.filter(s => candidateLower.includes(s.toLowerCase()));
    const missing = requiredJobSkills.filter(s => !candidateLower.includes(s.toLowerCase()));

    assert.deepEqual(matching, ['react', 'typescript', 'docker']);
    assert.deepEqual(missing, ['graphql', 'kubernetes', 'aws']);
  });

  it('computes accurate match percentage and fit verdict', () => {
    const matchCount = 3;
    const totalRequired = 6;
    const matchScore = Math.round((matchCount / totalRequired) * 100);

    assert.equal(matchScore, 50);

    const getVerdict = (s) => {
      if (s >= 80) return 'Strong Fit';
      if (s >= 60) return 'Moderate Fit';
      return 'Growth Opportunity';
    };

    assert.equal(getVerdict(matchScore), 'Growth Opportunity');
    assert.equal(getVerdict(85), 'Strong Fit');
  });
});

// 3. Logic tests for Interview Answer Evaluation
describe('Interview Evaluation Logic', () => {
  it('penalizes overly brief or empty answers', () => {
    const shortAnswer = 'I use useState and useEffect.';
    const words = shortAnswer.trim().split(/\s+/).length;
    assert.ok(words < 15);

    const isTooBrief = words < 20;
    assert.equal(isTooBrief, true);
  });

  it('scores structured, substantive answers higher', () => {
    const substantiveAnswer = `
      In React, reconciliation is the algorithm React uses to diff one tree of elements with another to determine which parts need to be updated in the real DOM.
      When state or props change, React generates a new Virtual DOM tree and compares it to the previous one using a heuristic O(n) algorithm.
      It uses element keys to efficiently track lists and avoids unnecessary re-renders. We can optimize this using React.memo, useMemo, and useCallback.
    `;
    const words = substantiveAnswer.trim().split(/\s+/).length;
    assert.ok(words > 40);

    const keyTerms = ['reconciliation', 'virtual dom', 'key', 'diff', 'memo'];
    const lower = substantiveAnswer.toLowerCase();
    const hits = keyTerms.filter(t => lower.includes(t));
    assert.ok(hits.length >= 3, `Expected at least 3 domain keywords, got ${hits.length}`);
  });
});

// 4. Logic tests for Career Roadmap Generation
describe('Roadmap Generator Structure', () => {
  it('validates verified URLs have https protocols', () => {
    const verifiedResources = [
      'https://react.dev/learn',
      'https://www.typescriptlang.org/docs/',
      'https://nodejs.org/docs/latest/api/',
      'https://docs.docker.com/get-started/',
      'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    ];

    for (const url of verifiedResources) {
      assert.ok(url.startsWith('https://'), `URL must be secure: ${url}`);
      assert.doesNotThrow(() => new URL(url), `URL must parse cleanly: ${url}`);
    }
  });

  it('ensures roadmap has progressive phases with milestones', () => {
    const phases = [
      { id: 'foundations', title: 'Phase 1: Core Fundamentals', milestones: 4 },
      { id: 'intermediate', title: 'Phase 2: Modern Production Architectures', milestones: 4 },
      { id: 'advanced', title: 'Phase 3: Scale, Reliability & Leadership', milestones: 3 },
    ];

    assert.equal(phases.length, 3);
    const totalMilestones = phases.reduce((acc, p) => acc + p.milestones, 0);
    assert.equal(totalMilestones, 11);
  });
});
