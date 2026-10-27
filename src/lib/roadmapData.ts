import { findMissingSkills, normalizeSkill } from './skills';

export interface VerifiedResource {
  name: string;
  url: string;
  type: 'docs' | 'tutorial' | 'guide';
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  phase: string;
  completed: boolean;
  relatedSkill?: string;
  projectIdea?: string;
  resources: VerifiedResource[];
}

export interface RoleRoadmap {
  role: string;
  required_skills: string[];
  phases: {
    phase: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    items: {
      title: string;
      description: string;
      relatedSkill: string;
      projectIdea: string;
      resources: VerifiedResource[];
    }[];
  }[];
}

export const roadmaps: Record<string, RoleRoadmap> = {
  'Frontend Developer': {
    role: 'Frontend Developer',
    required_skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Next.js', 'Testing', 'Accessibility'],
    phases: [
      {
        phase: 'Phase 1: Modern Web Foundations',
        level: 'beginner',
        items: [
          {
            title: 'Semantic HTML5 & Accessible CSS Layouts',
            description: 'Master Flexbox, CSS Grid, custom properties, and WCAG accessibility standards for responsive layouts.',
            relatedSkill: 'HTML',
            projectIdea: 'Build a mobile-first responsive product landing page with accessible modal dialogs.',
            resources: [
              { name: 'MDN HTML & CSS Guides', url: 'https://developer.mozilla.org', type: 'docs' },
              { name: 'Web.dev Responsive Design', url: 'https://web.dev/learn/design', type: 'guide' },
            ],
          },
          {
            title: 'Modern JavaScript (ES6+) & DOM APIs',
            description: 'Deep dive into closures, async/await, event delegation, and array methods for functional data handling.',
            relatedSkill: 'JavaScript',
            projectIdea: 'Build an interactive dashboard with live filtering, local storage persistence, and debounce.',
            resources: [
              { name: 'JavaScript.info Complete Guide', url: 'https://javascript.info', type: 'guide' },
              { name: 'MDN Web APIs', url: 'https://developer.mozilla.org/en-US/docs/Web/API', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 2: React & TypeScript Component Architecture',
        level: 'intermediate',
        items: [
          {
            title: 'React 19 & Component Lifecycle',
            description: 'Build composable UI primitives, master custom hooks, context, and modern state machines.',
            relatedSkill: 'React',
            projectIdea: 'Build a multi-step checkout workflow with form validation and state caching.',
            resources: [
              { name: 'Official React Documentation', url: 'https://react.dev', type: 'docs' },
            ],
          },
          {
            title: 'Type-Safe Interfaces with TypeScript',
            description: 'Learn strict typing, union types, generics, and typing asynchronous API responses.',
            relatedSkill: 'TypeScript',
            projectIdea: 'Refactor an existing vanilla React application into strictly typed TypeScript.',
            resources: [
              { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 3: Production Performance & Testing',
        level: 'advanced',
        items: [
          {
            title: 'Core Web Vitals & Bundle Optimization',
            description: 'Audit and optimize LCP, INP, and CLS using code-splitting, dynamic imports, and memoization.',
            relatedSkill: 'Performance',
            projectIdea: 'Profile and optimize an application bundle to achieve a 95+ Google Lighthouse score.',
            resources: [
              { name: 'Web.dev Core Web Vitals', url: 'https://web.dev/vitals', type: 'docs' },
            ],
          },
          {
            title: 'Automated Testing with Vitest & Testing Library',
            description: 'Write unit tests, integration tests, and user event simulations for bulletproof features.',
            relatedSkill: 'Testing',
            projectIdea: 'Create a test suite covering critical authentication and state transition branches.',
            resources: [
              { name: 'Testing Library Guides', url: 'https://testing-library.com', type: 'docs' },
            ],
          },
        ],
      },
    ],
  },
  'Full Stack Developer': {
    role: 'Full Stack Developer',
    required_skills: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL', 'PostgreSQL', 'Docker', 'REST API', 'System Design'],
    phases: [
      {
        phase: 'Phase 1: Full-Stack Foundations',
        level: 'beginner',
        items: [
          {
            title: 'Relational Database Modeling with PostgreSQL',
            description: 'Design normalized relational schemas, write complex queries, indexes, and foreign key cascades.',
            relatedSkill: 'PostgreSQL',
            projectIdea: 'Design a multi-tenant database schema for an e-commerce platform with order tracking.',
            resources: [
              { name: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs', type: 'docs' },
            ],
          },
          {
            title: 'REST API Design with Node.js & Express',
            description: 'Build scalable endpoints with input validation, error contracts, and middleware auth.',
            relatedSkill: 'Node.js',
            projectIdea: 'Build a secure authentication and user profile CRUD microservice.',
            resources: [
              { name: 'Node.js Guides', url: 'https://nodejs.org/en/docs', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 2: End-to-End Type Safety & Auth',
        level: 'intermediate',
        items: [
          {
            title: 'Unified React & Node Architecture',
            description: 'Integrate React frontends with backend APIs using shared TypeScript types and state synchronization.',
            relatedSkill: 'TypeScript',
            projectIdea: 'Build an end-to-end task collaboration tool with optimistic UI and live database updates.',
            resources: [
              { name: 'React & TypeScript Handbook', url: 'https://react.dev/learn/typescript', type: 'guide' },
            ],
          },
          {
            title: 'Containerization & Docker Workflows',
            description: 'Containerize multi-container web apps with docker-compose for local development and cloud deploy.',
            relatedSkill: 'Docker',
            projectIdea: 'Containerize an app, database, and Redis cache with health checks in Docker Compose.',
            resources: [
              { name: 'Docker Documentation', url: 'https://docs.docker.com', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 3: Scalability & System Architecture',
        level: 'advanced',
        items: [
          {
            title: 'System Design, Caching & Background Queues',
            description: 'Implement Redis caching, message queues, rate-limiting, and connection pooling.',
            relatedSkill: 'System Design',
            projectIdea: 'Design a URL shortener with distributed caching handling 10,000 req/sec.',
            resources: [
              { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'guide' },
            ],
          },
        ],
      },
    ],
  },
  'Backend Developer': {
    role: 'Backend Developer',
    required_skills: ['Node.js', 'PostgreSQL', 'SQL', 'REST API', 'Docker', 'Redis', 'System Design', 'Testing'],
    phases: [
      {
        phase: 'Phase 1: API & Relational Core',
        level: 'beginner',
        items: [
          {
            title: 'API Architecture & Middleware',
            description: 'Build robust HTTP APIs with error handling, logging, and rate limiting.',
            relatedSkill: 'Node.js',
            projectIdea: 'Build an API gateway with JWT authorization and request logging.',
            resources: [
              { name: 'Express Documentation', url: 'https://expressjs.com', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 2: Data Persistence & Transactions',
        level: 'intermediate',
        items: [
          {
            title: 'Database Transactions & Query Optimization',
            description: 'Master ACID transactions, indexes, EXPLAIN ANALYZE, and connection pooling.',
            relatedSkill: 'PostgreSQL',
            projectIdea: 'Optimize slow queries on a 1-million row dataset with composite indexes.',
            resources: [
              { name: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com', type: 'guide' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 3: High Scale Distributed Backend',
        level: 'advanced',
        items: [
          {
            title: 'Distributed Caching & Message Streaming',
            description: 'Integrate Redis pub/sub, background task workers, and distributed locking.',
            relatedSkill: 'System Design',
            projectIdea: 'Build a background job queue with retry exponential backoff and dead-letter queues.',
            resources: [
              { name: 'Redis Documentation', url: 'https://redis.io/docs', type: 'docs' },
            ],
          },
        ],
      },
    ],
  },
  'Data Analyst': {
    role: 'Data Analyst',
    required_skills: ['SQL', 'Python', 'Pandas', 'Tableau', 'Excel', 'Statistics', 'Data Visualization'],
    phases: [
      {
        phase: 'Phase 1: SQL & Data Wrangling',
        level: 'beginner',
        items: [
          {
            title: 'Advanced SQL Querying',
            description: 'Master Window functions, CTEs, complex joins, and statistical aggregations.',
            relatedSkill: 'SQL',
            projectIdea: 'Analyze user churn and cohort retention on a production SaaS dataset using SQL.',
            resources: [
              { name: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial', type: 'guide' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 2: Python Data Science & Pandas',
        level: 'intermediate',
        items: [
          {
            title: 'Exploratory Data Analysis with Pandas',
            description: 'Clean data, handle missing values, and generate statistical distribution models.',
            relatedSkill: 'Python',
            projectIdea: 'Create an automated sales forecasting notebook with Jupyter and Pandas.',
            resources: [
              { name: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 3: Executive Dashboards & A/B Testing',
        level: 'advanced',
        items: [
          {
            title: 'Executive BI Dashboards & Statistical Testing',
            description: 'Formulate hypotheses, calculate p-values and confidence intervals, and present visual dashboards.',
            relatedSkill: 'Statistics',
            projectIdea: 'Design an interactive Tableau/PowerBI dashboard summarizing executive conversion KPIs.',
            resources: [
              { name: 'StatQuest with Josh Starmer', url: 'https://statquest.org', type: 'guide' },
            ],
          },
        ],
      },
    ],
  },
  'DevOps Engineer': {
    role: 'DevOps Engineer',
    required_skills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Monitoring'],
    phases: [
      {
        phase: 'Phase 1: Linux & Containers',
        level: 'beginner',
        items: [
          {
            title: 'Linux Systems & Shell Automation',
            description: 'Master file permissions, process management, systemd, and Bash automation.',
            relatedSkill: 'Linux',
            projectIdea: 'Write a self-healing server backup and log rotation script.',
            resources: [
              { name: 'Linux Journey', url: 'https://linuxjourney.com', type: 'guide' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 2: CI/CD & Cloud Infrastructure',
        level: 'intermediate',
        items: [
          {
            title: 'Automated CI/CD with GitHub Actions',
            description: 'Build lint, test, containerize, and deploy pipelines with secrets management.',
            relatedSkill: 'CI/CD',
            projectIdea: 'Build a production CI/CD pipeline deploying Docker containers to cloud servers.',
            resources: [
              { name: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', type: 'docs' },
            ],
          },
          {
            title: 'Infrastructure as Code with Terraform',
            description: 'Define and provision VPCs, compute instances, and load balancers declaratively.',
            relatedSkill: 'Terraform',
            projectIdea: 'Provision a high-availability multi-zone cloud cluster using Terraform modules.',
            resources: [
              { name: 'HashiCorp Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform', type: 'docs' },
            ],
          },
        ],
      },
      {
        phase: 'Phase 3: Orchestration & Observability',
        level: 'advanced',
        items: [
          {
            title: 'Kubernetes Cluster Management',
            description: 'Deploy pods, services, ingress controllers, config maps, and horizontal pod autoscalers.',
            relatedSkill: 'Kubernetes',
            projectIdea: 'Deploy a zero-downtime rolling update application with Prometheus monitoring in Kubernetes.',
            resources: [
              { name: 'Kubernetes Official Docs', url: 'https://kubernetes.io/docs', type: 'docs' },
            ],
          },
        ],
      },
    ],
  },
};

export function generateRoadmap(
  targetRole: string,
  userSkills: string[],
  completedSkills: string[] = []
): { steps: RoadmapStep[]; matchPercentage: number; missingSkills: string[] } {
  const roleRoadmap = roadmaps[targetRole] || roadmaps['Full Stack Developer'];

  const normalizedUserSkills = new Set(userSkills.map((skill) => normalizeSkill(skill)));
  const matched = roleRoadmap.required_skills.filter((skill) => normalizedUserSkills.has(normalizeSkill(skill)));
  const matchPercentage = Math.round((matched.length / roleRoadmap.required_skills.length) * 100);

  const missingSkills = findMissingSkills(userSkills, roleRoadmap.required_skills);
  const completedSet = new Set(completedSkills.map((skill) => normalizeSkill(skill)));

  const steps: RoadmapStep[] = [];
  let stepCounter = 1;

  for (const phase of roleRoadmap.phases) {
    for (const item of phase.items) {
      const isCompleted = completedSet.has(normalizeSkill(item.relatedSkill));
      steps.push({
        id: `step-${stepCounter++}`,
        title: item.title,
        description: item.description,
        level: phase.level,
        phase: phase.phase,
        completed: isCompleted,
        relatedSkill: item.relatedSkill,
        projectIdea: item.projectIdea,
        resources: item.resources,
      });
    }
  }

  return { steps, matchPercentage, missingSkills };
}
