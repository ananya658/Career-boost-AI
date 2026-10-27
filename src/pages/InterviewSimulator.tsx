import { useEffect, useState, useMemo } from 'react';
import {
  Send,
  Bot,
  Zap,
  Clock,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Award,
  History,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getQuestionsForRole, shuffleArray, type InterviewSession } from '../lib/questionsData';
import {
  evaluateAnswer,
  calculateOverallScore,
  generateInterviewSummary,
  type EvaluationResult
} from '../lib/interviewEvaluation';
import {
  saveInterviewRecord,
  getSavedInterviews,
  type InterviewRecord
} from '../lib/database';

type InterviewPhase = 'setup' | 'interviewing' | 'completed' | 'history';

const SAMPLE_ANSWERS: Record<string, string> = {
  JavaScript:
    'In modern JavaScript, const should be used by default for immutable bindings, and let when values must change within block scope. Avoid var due to function scoping and hoisting pitfalls. For instance, in loop closures, let guarantees block-level state per iteration.',
  React:
    'Functional React components re-render whenever state or parent props change. React invokes the component function, produces a new Virtual DOM tree, diffs it against previous fiber nodes, and commits minimal DOM mutations. To avoid wasted re-renders, use React.memo, useCallback for stable function references, and keep state localized.',
  Architecture:
    'When structuring growing frontend applications, follow feature-sliced architecture or modular domain grouping. Shared primitives live in a headless design system package, while business logic resides in custom hooks. Components stay dumb and presentational where possible.',
  Performance:
    'Core Web Vitals prioritize LCP, INP, and CLS. I optimize LCP through preloading hero images, server-side streaming or SSG, and critical CSS inlining. INP improves by keeping JavaScript main-thread execution under 50ms with web workers or deferred task scheduling.',
  Security:
    'Secure SPA authentication relies on short-lived JWT access tokens stored in memory, combined with httpOnly, SameSite=Strict refresh cookies to defend against XSS. Avoid localStorage for sensitive tokens to prevent script exfiltration.',
  'System Design':
    'For high-concurrency systems, implement a decoupled asynchronous architecture: an API gateway with rate limiting, an in-memory Redis cluster for session caching and read replicas, Kafka for persistent event streaming, and horizontal worker auto-scaling behind load balancers.',
  Behavioral:
    'Using the STAR framework: Situation: A critical production migration deadline was delayed by 3 weeks due to third-party API deprecations. Task: I was responsible for delivering the data pipeline without impacting users. Action: I organized daily unblocking syncs, prioritized MVP endpoints, and created a dual-write adapter. Result: We shipped on schedule with zero customer downtime.',
};

export default function InterviewSimulator() {
  const { user } = useAuth();

  const [phase, setPhase] = useState<InterviewPhase>('setup');
  const [role, setRole] = useState('Full Stack Developer');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [category, setCategory] = useState<'All-Around' | 'Technical' | 'Architecture' | 'Behavioral'>('All-Around');
  const [questionCount, setQuestionCount] = useState(3);

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Past interview history state
  const [pastInterviews, setPastInterviews] = useState<InterviewRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Data Analyst'
  ];

  useEffect(() => {
    if (user && phase === 'history') {
      let isMounted = true;
      void getSavedInterviews(user.id)
        .then((items) => {
          if (isMounted) setPastInterviews(items);
        })
        .finally(() => {
          if (isMounted) setLoadingHistory(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [user, phase]);

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startInterview = () => {
    let availableQuestions = getQuestionsForRole(role, difficulty);

    if (category !== 'All-Around') {
      const filtered = availableQuestions.filter((q) =>
        q.category.toLowerCase().includes(category.toLowerCase())
      );
      if (filtered.length >= 2) availableQuestions = filtered;
    }

    const questions = shuffleArray(availableQuestions).slice(0, questionCount);

    const newSession: InterviewSession = {
      id: crypto.randomUUID(),
      role,
      difficulty,
      questions,
      answers: new Array(questions.length).fill(''),
      scores: new Array(questions.length).fill(0),
      feedbacks: new Array(questions.length).fill(''),
      suggestions: new Array(questions.length).fill([]),
      startTime: Date.now(),
      currentQuestionIndex: 0,
      isCompleted: false,
      totalScore: 0,
    };

    setSession(newSession);
    setPhase('interviewing');
    setTimeLeft(questions[0]?.timeLimit ?? 120);
    setIsTimerRunning(true);
    setCurrentAnswer('');
    setShowFeedback(false);
    setCurrentEvaluation(null);
  };

  const submitAnswer = async () => {
    if (!session || !currentAnswer.trim()) return;

    setEvaluating(true);
    const currentQuestion = session.questions[session.currentQuestionIndex];

    // Evaluate answer with rule-based domain analyzer
    const evaluation = evaluateAnswer(currentAnswer, currentQuestion);

    const updatedSession: InterviewSession = {
      ...session,
      answers: [...session.answers],
      scores: [...session.scores],
      feedbacks: [...session.feedbacks],
      suggestions: [...session.suggestions],
    };

    updatedSession.answers[session.currentQuestionIndex] = currentAnswer;
    updatedSession.scores[session.currentQuestionIndex] = evaluation.score;
    updatedSession.feedbacks[session.currentQuestionIndex] = evaluation.feedback;
    updatedSession.suggestions[session.currentQuestionIndex] = evaluation.suggestions;

    setCurrentEvaluation(evaluation);
    setShowFeedback(true);
    setIsTimerRunning(false);
    setSession(updatedSession);
    setEvaluating(false);
  };

  const nextQuestion = async () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    const updatedSession = { ...session };

    if (nextIndex >= session.questions.length) {
      const { averageScore } = calculateOverallScore(session.scores);
      updatedSession.isCompleted = true;
      updatedSession.totalScore = averageScore;
      setSession(updatedSession);
      setPhase('completed');

      // Persist completed interview to history & database
      if (user) {
        const fullSummary = generateInterviewSummary({
          role: session.role,
          difficulty: session.difficulty,
          questions: session.questions,
          scores: session.scores,
          feedbacks: session.feedbacks,
        });

        await saveInterviewRecord(user.id, {
          id: session.id,
          role: session.role,
          difficulty: session.difficulty,
          category,
          score: averageScore,
          questions: session.questions,
          answers: session.answers,
          feedbacks: session.feedbacks,
          suggestions: session.suggestions,
          summary: fullSummary,
        });
      }
      return;
    }

    updatedSession.currentQuestionIndex = nextIndex;
    setSession(updatedSession);
    setCurrentAnswer('');
    setShowFeedback(false);
    setCurrentEvaluation(null);
    setTimeLeft(session.questions[nextIndex].timeLimit);
    setIsTimerRunning(true);
  };

  const restartInterview = () => {
    setPhase('setup');
    setSession(null);
    setCurrentAnswer('');
    setTimeLeft(0);
    setIsTimerRunning(false);
    setShowFeedback(false);
    setCurrentEvaluation(null);
  };

  const currentSampleAnswer = useMemo(() => {
    if (!session) return SAMPLE_ANSWERS.React;
    const cat = session.questions[session.currentQuestionIndex]?.category || 'React';
    return (
      SAMPLE_ANSWERS[cat] ||
      SAMPLE_ANSWERS[role.split(' ')[0]] ||
      'Structure the answer using Situation, Task, Action, and Result (STAR). Address edge cases, trade-offs, and measurable outcomes.'
    );
  }, [session, role]);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interview Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time interactive technical, architectural, and behavioral mock rounds with instant evaluations.
          </p>
        </div>

        <div className="flex rounded-lg bg-muted/60 p-1 border border-border/60 text-xs font-semibold w-fit">
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              phase !== 'history' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Simulator
          </button>
          <button
            type="button"
            onClick={() => setPhase('history')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              phase === 'history' ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Interview History
          </button>
        </div>
      </div>

      {/* PHASE 1: SETUP FORM */}
      {phase === 'setup' && (
        <div className="surface-card rounded-2xl p-6 sm:p-8 border border-border space-y-8">
          {/* Transparency Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-xs leading-relaxed">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary block mb-0.5">Evaluation Mode: Semantic Simulation Engine</span>
              <p className="text-muted-foreground">
                Evaluations are performed by our domain NLP evaluator testing keyword density, STAR structure, technical depth, and clarity. When a server AI key is configured in <code className="text-primary font-mono">.env</code>, deep reasoning models provide supplemental conversational feedback.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Target Job Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Experience & Seniority Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      difficulty === lvl
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-card border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Focus */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Interview Category Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['All-Around', 'Technical', 'Architecture', 'Behavioral'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      category === cat
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-card border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Length */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      questionCount === count
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-card border-border hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="button"
              onClick={startInterview}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Interview Simulation
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: ACTIVE INTERVIEWING */}
      {phase === 'interviewing' && session && (
        <div className="space-y-6">
          {/* Status & Timer Card */}
          <div className="surface-card rounded-xl p-4 sm:p-5 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs font-mono">
                Q{session.currentQuestionIndex + 1}
              </span>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Question {session.currentQuestionIndex + 1} of {session.questions.length}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {session.questions[session.currentQuestionIndex].category} • {session.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold ${
                  timeLeft < 30 ? 'bg-destructive/15 text-destructive animate-pulse' : 'bg-muted text-foreground'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>

              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Question Prompt */}
          <div className="surface-card rounded-2xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider font-mono">
                {session.questions[session.currentQuestionIndex].difficulty}
              </span>
              <span className="text-xs text-muted-foreground">Target Response Time: {session.questions[session.currentQuestionIndex].timeLimit}s</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
              "{session.questions[session.currentQuestionIndex].text}"
            </h2>

            {/* Answer Input */}
            <div className="pt-2">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={showFeedback}
                rows={7}
                placeholder="Type your response here. For best results, use the STAR format: specify the Situation, Task, your direct Action, and quantifiable Results..."
                className="w-full rounded-xl border border-border bg-background p-4 text-xs font-mono outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 resize-y"
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
                <span>Words: {currentAnswer.trim().split(/\s+/).filter(Boolean).length}</span>
                <span>Expected Keywords: {session.questions[session.currentQuestionIndex].expectedKeywords.slice(0, 3).join(', ')}</span>
              </div>
            </div>

            {!showFeedback ? (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!currentAnswer.trim() || evaluating}
                  onClick={submitAnswer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Submit Answer for AI Evaluation
                </button>
              </div>
            ) : null}
          </div>

          {/* Answer Evaluation Feedback Card */}
          <AnimatePresence>
            {showFeedback && currentEvaluation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card rounded-2xl p-6 sm:p-7 border border-primary/25 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">Instant Answer Evaluation</h3>
                      <p className="text-xs text-muted-foreground">Detailed performance breakdown</p>
                    </div>
                  </div>
                  <span
                    className={`text-2xl font-extrabold font-display px-3 py-1 rounded-xl ${
                      currentEvaluation.score >= 80
                        ? 'text-emerald-500 bg-emerald-500/10'
                        : currentEvaluation.score >= 55
                        ? 'text-amber-500 bg-amber-500/10'
                        : 'text-destructive bg-destructive/10'
                    }`}
                  >
                    {currentEvaluation.score}%
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/40 text-xs text-foreground leading-relaxed">
                    <span className="font-bold block mb-1">Feedback Summary:</span>
                    {currentEvaluation.feedback}
                  </div>

                  {/* Strengths & Suggestions */}
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    {currentEvaluation.strengths.length > 0 && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                        <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                        </span>
                        <ul className="space-y-1 text-muted-foreground pl-5 list-disc">
                          {currentEvaluation.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentEvaluation.suggestions.length > 0 && (
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                        <span className="font-bold text-blue-500 flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> Next Steps to Elevate Answer
                        </span>
                        <ul className="space-y-1 text-muted-foreground pl-5 list-disc">
                          {currentEvaluation.suggestions.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Benchmark Sample Answer */}
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5">
                    <span className="font-bold text-purple-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Benchmark Ideal Answer (Staff Level)
                    </span>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "{currentSampleAnswer}"
                    </p>
                  </div>
                </div>

                {/* Progress Forward Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                  >
                    {session.currentQuestionIndex + 1 >= session.questions.length
                      ? 'Complete Interview & View Report'
                      : 'Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* PHASE 3: COMPLETED REPORT */}
      {phase === 'completed' && session && (
        <div className="surface-card rounded-2xl p-6 sm:p-8 border border-border space-y-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Interview Session Complete</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You scored an average of <span className="text-foreground font-semibold font-mono">{session.totalScore}%</span> across {session.questions.length} questions for <span className="text-primary font-semibold">{session.role}</span>.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl surface-card border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-medium">Readiness Index</span>
              <div className="text-2xl font-bold font-mono text-emerald-500">{session.totalScore}%</div>
              <p className="text-[11px] text-muted-foreground">{session.totalScore >= 75 ? 'Ready for Screen' : 'Needs Reinforcement'}</p>
            </div>
            <div className="p-4 rounded-xl surface-card border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-medium">Difficulty Level</span>
              <div className="text-2xl font-bold capitalize text-foreground">{session.difficulty}</div>
              <p className="text-[11px] text-muted-foreground">{session.questions.length} Questions Answered</p>
            </div>
            <div className="p-4 rounded-xl surface-card border border-border text-center space-y-1">
              <span className="text-[11px] text-muted-foreground uppercase font-medium">XP Earned</span>
              <div className="text-2xl font-bold font-mono text-amber-500">+80 XP</div>
              <p className="text-[11px] text-muted-foreground">Added to Profile</p>
            </div>
          </div>

          {/* Breakdown per question */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Question-by-Question Evaluation Breakdown</h3>
            <div className="space-y-3">
              {session.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl surface-card border border-border/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">Q{idx + 1}: {q.category}</span>
                    <span className="font-mono font-bold text-foreground">{session.scores[idx]}% Score</span>
                  </div>
                  <p className="text-xs text-foreground font-medium">{q.text}</p>
                  <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border/50">
                    {session.feedbacks[idx] || 'Answer recorded.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={restartInterview}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/95 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Start Another Interview
            </button>
            <button
              type="button"
              onClick={() => setPhase('history')}
              className="px-5 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs transition-colors"
            >
              View All History
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: PAST HISTORY VIEW */}
      {phase === 'history' && (
        <div className="surface-card rounded-2xl p-6 sm:p-8 border border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground">Completed Interview Sessions ({pastInterviews.length})</h2>
            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + Start New Simulation
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pastInterviews.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <History className="w-8 h-8 text-primary/40 mx-auto" />
              <p className="text-sm">No completed interview sessions recorded yet.</p>
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Take your first interview round →
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {pastInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{item.role}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="capitalize">{item.difficulty} Level</span>
                        <span>•</span>
                        <span>{new Date(item.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-emerald-500 px-3 py-1 rounded-xl bg-emerald-500/10">
                      {item.score}%
                    </span>
                  </div>

                  {item.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{item.summary.slice(0, 160)}..."
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
