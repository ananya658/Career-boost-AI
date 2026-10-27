import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Briefcase, Loader2, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [completed, setCompleted] = useState(false);

  const tokenPresent = useMemo(() => Boolean(token), [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('error');

    try {
      if (!tokenPresent) {
        throw new Error('This password reset link is invalid or expired.');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const response = await fetch('/api/password-reset-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Unable to update password.');
      }

      setCompleted(true);
      setMessageType('success');
      setMessage('Password successfully updated! You can now sign in with your new credentials.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setMessageType('error');
      setMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-3xl border border-border shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-primary/25">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Set New Password</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a strong password containing at least 8 characters.
          </p>
        </div>

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

        {!tokenPresent && !completed ? (
          <div className="text-center space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              This reset link does not include a valid token or has expired.
            </p>
            <Link
              to="/auth?mode=forgot"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              Request a new password reset link <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : completed ? (
          <div className="text-center space-y-4 py-2">
            <Link
              to="/auth"
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Proceed to Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm pl-10 outline-none focus:ring-2 focus:ring-primary"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm pl-10 outline-none focus:ring-2 focus:ring-primary"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center border-t border-border/50 pt-4">
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">
            Return to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
