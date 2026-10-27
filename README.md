# CareerBoost AI — Production-Grade Career Development Platform

CareerBoost AI is a modern, full-stack, AI-powered career development platform built with React 19, TypeScript, Vite, Tailwind CSS, and Supabase. It delivers actionable career acceleration tools with resilient persistence, professional UI/UX, and zero placeholder gimmicks.

---

## 🌟 Core Features

### 1. 🎯 Job Matcher (`/jobs`)
- **Curated Tech Positions & Custom JD Analyzer**: Matches candidates against an indexed dataset of 22 engineering, product, and AI roles or parses arbitrary pasted job postings.
- **Explainable Fit Scoring**: Breaks down matches into Matching Skills, Missing Skills, and qualitative verdict with explicit improvement advice.
- **Saved Bookmarks**: Allows candidates to save, track, and manage job targets with dual-layer persistence.

### 2. 🎙️ AI Interview Simulator (`/interview`)
- **Configurable Sessions**: Choose target role, seniority level (Junior to Principal/Staff), category (System Design, Algorithms, Behavioral, Frameworks), and question depth.
- **Live Interactive Evaluation**: Analyzes technical accuracy, depth, relevance, and structural clarity. Provides actionable feedback and benchmark Staff-level ideal answers.
- **Session History & Progress**: Generates comprehensive post-interview scorecards saved to the user's permanent history.
- **Transparent AI / Sandbox Mode**: Clearly identifies fallback evaluation when third-party model keys are not yet configured.

### 3. 📄 Resume Analyzer (`/resume`)
- **Multi-Format Uploads & Direct Input**: Accepts PDF, DOCX, and TXT files (up to 5MB) or raw pasted text with strict file validation.
- **ATS Health Score & Section Auditing**: Scans for Action Verbs, Quantifiable Business Metrics (percentages, numbers, latencies), Contact Details, and Core Sections.
- **Actionable Bullet Re-writing**: Provides instant, copyable improved bullet points in Google XYZ format (`Accomplished [X] as measured by [Y] by doing [Z]`).

### 4. 💼 Portfolio Builder (`/portfolio` & `/p/:slug`)
- **Live Interactive Editor**: Sections for Personal Info, Work Experience, Education, Projects, and Social links.
- **Multi-Theme Engine**: Choose between `Modern Minimal`, `Executive Slate`, `Creative Violet`, and `Cyber Dark`.
- **Public Shareable Route**: Generates clean public profile pages at `/p/:slug` with mobile responsiveness and print-to-PDF layout.

### 5. 🗺️ Career Roadmap Generator (`/roadmap`)
- **3-Phase Structured Curriculum**: Generates foundational, architectural, and leadership milestones tailored to target roles.
- **Verified Learning Links**: Every milestone includes verified links to official documentation (React, TypeScript, MDN, Docker, Node.js).
- **Interactive Checkbox Tracking**: Mark milestones complete to earn XP and watch your career progress bar update in real time.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Lucide React, Framer Motion, Recharts
- **Backend & APIs**: Node.js micro-router in `api/functions.js` + `server.mjs` handling auth, email triggers, resume parsing, and CRUD
- **Persistence**: Dual-layer architecture:
  - **Layer 1 (Cloud)**: Supabase PostgreSQL with Row Level Security (RLS) policies
  - **Layer 2 (Local Sandbox)**: Resilient `localStorage` store ensuring the entire app works seamlessly out-of-the-box before cloud credentials are added
- **Gamification**: Real-time XP tracking and career progression levels

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v24+`
- `pnpm` (or `npm`)

### 1. Clone & Install
```bash
git clone <repo-url>
cd Career-boost-AI-main
pnpm install
```

### 2. Environment Setup
Copy the environment template:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials (optional for initial trial; the app works smoothly in Sandbox mode):
```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Schema Setup (Supabase)
To enable cloud persistence and authentication:
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the provided [`supabase-schema.sql`](supabase-schema.sql).
3. This creates:
   - `profiles`, `user_stats`, `resumes`, `interviews`, `jobs`, `saved_jobs`, `roadmaps`, `portfolios`, `progress`
   - Row Level Security (RLS) policies securing user data
   - Automatic performance indexes
   - `increment_xp` stored procedure

### 4. Run Development Server
```bash
# Starts both the Vite frontend and API handler at http://localhost:5173
pnpm dev
```

For frontend-only Vite development without backend endpoints:
```bash
pnpm dev:vite
```

---

## 🧪 Testing & Verification

```bash
# Run unit tests for core scoring, resume analysis, and roadmap logic
pnpm test

# Run ESLint validation
pnpm run lint

# Run TypeScript compiler check and Vite production build
pnpm run build
```

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. In the **Vercel Dashboard**, click **New Project** and select this repository.
3. Configure settings:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build` (or `vite build`)
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` (if using email verification)
5. Deploy. `vercel.json` automatically configures API routing to `/api/functions.js` and SPA client fallback to `/index.html`.
