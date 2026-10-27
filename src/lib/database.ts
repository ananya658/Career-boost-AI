import supabase, { isSupabaseConfigured } from './supabase';

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  target_role?: string;
  experience_level?: string;
  skills: string[];
  resume_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserStats {
  id?: string;
  user_id: string;
  xp: number;
  level: number;
  resumes_analyzed?: number;
  interviews_completed?: number;
  updated_at?: string;
}

export interface Progress {
  id?: string;
  user_id: string;
  completed_skills: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SavedJobRecord {
  id?: string;
  user_id: string;
  job_id: string;
  match_score?: number;
  notes?: string;
  created_at?: string;
}

export interface InterviewRecord {
  id: string;
  user_id: string;
  role: string;
  difficulty: string;
  category: string;
  score: number;
  questions: unknown[];
  answers: unknown[];
  feedbacks?: unknown[];
  suggestions?: unknown[];
  summary?: string;
  created_at?: string;
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  target_role?: string;
  ats_score: number;
  missing_skills?: string[];
  strengths?: string[];
  suggestions?: string[];
  created_at?: string;
}

export interface RoadmapRecord {
  id: string;
  user_id: string;
  goal: string;
  skill_level?: string;
  current_skills?: string[];
  match_percentage?: number;
  missing_skills?: string[];
  steps: unknown[];
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioRecord {
  id?: string;
  user_id: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  skills?: string[];
  experience?: unknown[];
  education?: unknown[];
  projects?: unknown[];
  social_links?: Record<string, string | undefined>;
  theme?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

// -----------------------------------------------------------------------------
// Safe local storage fallbacks for offline or unconfigured environments
// -----------------------------------------------------------------------------
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

// -----------------------------------------------------------------------------
// User Profile Helpers
// -----------------------------------------------------------------------------
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured) {
    return getLocalItem<UserProfile | null>(`profile_${userId}`, {
      user_id: userId,
      full_name: '',
      headline: '',
      bio: '',
      target_role: 'Full Stack Developer',
      experience_level: 'Mid-Level',
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
      resume_text: '',
    });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    // Fallback to local cache if not found
    return getLocalItem<UserProfile | null>(`profile_${userId}`, null);
  } catch {
    return getLocalItem<UserProfile | null>(`profile_${userId}`, null);
  }
};

export const upsertUserProfile = async (profile: {
  user_id: string;
  full_name?: string;
  headline?: string;
  bio?: string;
  target_role?: string;
  experience_level?: string;
  skills?: string[];
  resume_text?: string;
}): Promise<UserProfile> => {
  // Always update local cache
  const existing = getLocalItem<UserProfile>(`profile_${profile.user_id}`, {
    user_id: profile.user_id,
    skills: [],
    resume_text: '',
  });
  const updated: UserProfile = { ...existing, ...profile, updated_at: new Date().toISOString() };
  setLocalItem(`profile_${profile.user_id}`, updated);

  if (!isSupabaseConfigured) return updated;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: profile.user_id,
          full_name: profile.full_name ?? existing.full_name,
          headline: profile.headline ?? existing.headline,
          bio: profile.bio ?? existing.bio,
          target_role: profile.target_role ?? existing.target_role,
          experience_level: profile.experience_level ?? existing.experience_level,
          skills: profile.skills ?? existing.skills,
          resume_text: profile.resume_text ?? existing.resume_text,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select('*')
      .single();

    if (error) {
      console.warn('Supabase upsert profile warning:', error.message);
      return updated;
    }
    return data;
  } catch {
    return updated;
  }
};

// -----------------------------------------------------------------------------
// User Progress & Stats Helpers
// -----------------------------------------------------------------------------
export const getUserProgress = async (userId: string): Promise<Progress | null> => {
  const localVal = getLocalItem<Progress | null>(`progress_${userId}`, null);
  if (!isSupabaseConfigured) return localVal;

  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data || localVal;
  } catch {
    return localVal;
  }
};

export const upsertUserProgress = async (progress: {
  user_id: string;
  completed_skills: string[];
}): Promise<Progress> => {
  const updated: Progress = {
    user_id: progress.user_id,
    completed_skills: progress.completed_skills,
    updated_at: new Date().toISOString(),
  };
  setLocalItem(`progress_${progress.user_id}`, updated);

  if (!isSupabaseConfigured) return updated;

  try {
    const { data, error } = await supabase
      .from('progress')
      .upsert(progress, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (error) return updated;
    return data;
  } catch {
    return updated;
  }
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const defaultStats: UserStats = { user_id: userId, xp: 120, level: 2, resumes_analyzed: 1, interviews_completed: 1 };
  const localVal = getLocalItem<UserStats>(`stats_${userId}`, defaultStats);

  if (!isSupabaseConfigured) return localVal;

  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return localVal;
    return data;
  } catch {
    return localVal;
  }
};

export const awardXp = async (userId: string, amount: number): Promise<UserStats> => {
  const current = await getUserStats(userId);
  const newXp = (current.xp || 0) + amount;
  const newLevel = Math.floor(newXp / 100) + 1;
  const updated: UserStats = { ...current, xp: newXp, level: newLevel, updated_at: new Date().toISOString() };
  setLocalItem(`stats_${userId}`, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('user_stats').upsert(updated, { onConflict: 'user_id' });
    } catch {
      // Ignore network failure
    }
  }

  return updated;
};

// -----------------------------------------------------------------------------
// Saved Jobs
// -----------------------------------------------------------------------------
export const getSavedJobs = async (userId: string): Promise<string[]> => {
  const localSaved = getLocalItem<string[]>(`saved_jobs_${userId}`, []);
  if (!isSupabaseConfigured) return localSaved;

  try {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId);

    if (error || !data) return localSaved;
    return data.map((item) => item.job_id);
  } catch {
    return localSaved;
  }
};

export const toggleSaveJob = async (
  userId: string,
  jobId: string,
  matchScore?: number
): Promise<{ saved: boolean }> => {
  const localSaved = getLocalItem<string[]>(`saved_jobs_${userId}`, []);
  const exists = localSaved.includes(jobId);
  const next = exists ? localSaved.filter((id) => id !== jobId) : [...localSaved, jobId];
  setLocalItem(`saved_jobs_${userId}`, next);

  if (isSupabaseConfigured) {
    try {
      if (exists) {
        await supabase.from('saved_jobs').delete().eq('user_id', userId).eq('job_id', jobId);
      } else {
        await supabase
          .from('saved_jobs')
          .insert({ user_id: userId, job_id: jobId, match_score: matchScore ?? 0 });
      }
    } catch {
      // Handled via local storage
    }
  }

  return { saved: !exists };
};

// -----------------------------------------------------------------------------
// Interview History
// -----------------------------------------------------------------------------
export const getSavedInterviews = async (userId: string): Promise<InterviewRecord[]> => {
  const localInterviews = getLocalItem<InterviewRecord[]>(`interviews_${userId}`, []);
  if (!isSupabaseConfigured) return localInterviews;

  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return localInterviews;
    return data as InterviewRecord[];
  } catch {
    return localInterviews;
  }
};

export const saveInterviewRecord = async (
  userId: string,
  record: Omit<InterviewRecord, 'user_id'>
): Promise<InterviewRecord> => {
  const fullRecord: InterviewRecord = {
    ...record,
    user_id: userId,
    created_at: record.created_at || new Date().toISOString(),
  };

  const localList = getLocalItem<InterviewRecord[]>(`interviews_${userId}`, []);
  const updatedList = [fullRecord, ...localList.filter((r) => r.id !== fullRecord.id)].slice(0, 30);
  setLocalItem(`interviews_${userId}`, updatedList);

  await awardXp(userId, 80);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('interviews').insert(fullRecord);
    } catch {
      // Safe fallback
    }
  }

  return fullRecord;
};

// -----------------------------------------------------------------------------
// Resume Analyses History
// -----------------------------------------------------------------------------
export const getSavedResumes = async (userId: string): Promise<ResumeRecord[]> => {
  const localResumes = getLocalItem<ResumeRecord[]>(`resumes_${userId}`, []);
  if (!isSupabaseConfigured) return localResumes;

  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return localResumes;
    return data as ResumeRecord[];
  } catch {
    return localResumes;
  }
};

export const saveResumeRecord = async (
  userId: string,
  record: Omit<ResumeRecord, 'user_id'>
): Promise<ResumeRecord> => {
  const fullRecord: ResumeRecord = {
    ...record,
    user_id: userId,
    created_at: record.created_at || new Date().toISOString(),
  };

  const localList = getLocalItem<ResumeRecord[]>(`resumes_${userId}`, []);
  const updatedList = [fullRecord, ...localList.filter((r) => r.id !== fullRecord.id)].slice(0, 20);
  setLocalItem(`resumes_${userId}`, updatedList);

  await awardXp(userId, 50);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('resumes').insert(fullRecord);
    } catch {
      // Safe fallback
    }
  }

  return fullRecord;
};

export const deleteResumeRecord = async (userId: string, id: string): Promise<void> => {
  const localList = getLocalItem<ResumeRecord[]>(`resumes_${userId}`, []);
  setLocalItem(
    `resumes_${userId}`,
    localList.filter((r) => r.id !== id)
  );

  if (isSupabaseConfigured) {
    try {
      await supabase.from('resumes').delete().eq('id', id).eq('user_id', userId);
    } catch {
      // Safe fallback
    }
  }
};

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------
export function mergeUniqueSkills(...skillGroups: string[][]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const group of skillGroups) {
    if (!group) continue;
    for (const skill of group) {
      if (!skill) continue;
      const normalized = skill.trim().toLowerCase();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      merged.push(skill.trim());
    }
  }

  return merged;
}
