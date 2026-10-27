import { useState } from 'react';
import { Navigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import supabase, { isSupabaseConfigured } from '../lib/supabase';

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot';

export default function Auth() {
  const { user, signInWithDemo, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [mode, setMode] = useState<AuthMode>(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'verify' || (typeof window !== 'undefined' && sessionStorage.getItem('careerboost-signup-token'))) {
      return 'verify';
    }
    if (urlMode === 'signup') return 'signup';
    if (urlMode === 'forgot') return 'forgot';
    return 'login';
  });

  const [email, setEmail] = useState(() => {
    return (typeof window !== 'undefined' && sessionStorage.getItem('careerboost-signup-email')) || '';
  });
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState(() => {
    return (typeof window !== 'undefined' && sessionStorage.getItem('careerboost-signup-token')) || '';
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  if (user) {
    return <Navigate to={redirectUrl} replace />;
  }

  const apiRequest = async <T,>(url: string, payload: Record<string, unknown>) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as T & {
      error?: string;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Authentication request failed');
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('error');

    try {
      if (mode === 'signup') {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }

        if (isSupabaseConfigured) {
          const data = await apiRequest<{ verificationToken: string }>('/api/signup-request', {
            email: email.trim(),
          });
          setVerificationToken(data.verificationToken);
          sessionStorage.setItem('careerboost-signup-token', data.verificationToken);
          sessionStorage.setItem('careerboost-signup-email', email.trim());
          setVerificationCode('');
          setMode('verify');
          setMessageType('success');
          setMessage('A 6-digit verification code has been dispatched to your email.');
        } else {
          // In local sandbox mode
          signInWithDemo(email.trim(), email.split('@')[0]);
          return;
        }
      }

      if (mode === 'verify') {
        if (!verificationCode.trim()) {
          throw new Error('Please enter the 6-digit verification code.');
        }

        await apiRequest('/api/signup-verify', {
          verificationToken,
          code: verificationCode.trim(),
          password,
        });

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        sessionStorage.removeItem('careerboost-signup-token');
        sessionStorage.removeItem('careerboost-signup-email');
      }

      if (mode === 'login') {
        if (!isSupabaseConfigured) {
          signInWithDemo(email.trim() || 'alex.developer@careerboost.ai', 'Alex Developer');
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // If credentials not found or offline, show clear error
          throw error;
        }
      }

      if (mode === 'forgot') {
        if (!email.trim()) throw new Error('Please enter your account email.');
        await apiRequest('/api/password-reset-request', { email: email.trim() });
        setMessageType('success');
        setMessage('If an account exists for this email, password reset instructions have been sent.');
      }
    } catch (err: unknown) {
      setMessageType('error');
      setMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('error');

    try {
      const data = await apiRequest<{ verificationToken: string }>('/api/signup-request', {
        email: email.trim(),
      });
      setVerificationToken(data.verificationToken);
      sessionStorage.setItem('careerboost-signup-token', data.verificationToken);
      sessionStorage.setItem('careerboost-signup-email', email.trim());
      setVerificationCode('');
      setMessageType('success');
      setMessage('A fresh verification code was sent.');
    } catch (err: unknown) {
      setMessageType('error');
      setMessage(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await signInWithGoogle();
    if (error) {
      setMessageType('error');
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative ambient blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-3xl border border-border shadow-2xl relative z-10"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/25">
            <Briefcase className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold font-display text-foreground">
            CareerBoost<span className="text-primary">.ai</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === 'login' && 'Sign in to access your interview reports & resume scores'}
            {mode === 'signup' && 'Create your account to unlock AI career acceleration'}
            {mode === 'verify' && 'Verify your email address with the 6-digit security code'}
            {mode === 'forgot' && 'Reset your password securely'}
          </p>
        </div>

        {/* Tab switchers for Login vs Signup */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="flex rounded-xl bg-muted/60 p-1 mb-6 border border-border/50 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setMessage('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'signup' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback message */}
        {message && (
          <div
            className={`p-3.5 rounded-xl mb-5 flex items-start gap-2.5 text-xs font-medium ${
              messageType === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}
          >
            {messageType === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={mode === 'verify'}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm pl-10 outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            </div>
          </div>

          {mode === 'verify' && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                6-Digit Security Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm pl-10 font-mono tracking-widest text-center text-lg outline-none focus:ring-2 focus:ring-primary"
                />
                <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Resend verification code
                </button>
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'verify') && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setMessage('');
                    }}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm pl-10 outline-none focus:ring-2 focus:ring-primary"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Continue to Verification'}
                {mode === 'verify' && 'Verify & Enter Platform'}
                {mode === 'forgot' && 'Send Password Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternative options */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-border flex-1" />
          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">or</span>
          <div className="h-px bg-border flex-1" />
        </div>

        {/* Demo Fast Access */}
        <button
          type="button"
          onClick={() => signInWithDemo('alex.developer@careerboost.ai', 'Alex Developer')}
          className="w-full py-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors mb-3"
        >
          <Play className="w-3.5 h-3.5 fill-primary" />
          Instant Demo Mode (No Registration Required)
        </button>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs text-foreground flex items-center justify-center gap-2.5 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {mode === 'forgot' && (
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setMessage('');
              }}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
