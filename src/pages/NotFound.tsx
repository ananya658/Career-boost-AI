import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, LayoutDashboard, FileText, Briefcase } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-12 border border-border shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Error 404</span>
          <h1 className="text-3xl font-extrabold font-display">Path Not Found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're searching for might have been shifted, renamed, or is currently on another roadmap branch.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Return to Dashboard
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center justify-center gap-4">
          <Link to="/resume" className="hover:text-foreground flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Resume Analyzer
          </Link>
          <span>•</span>
          <Link to="/jobs" className="hover:text-foreground flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> Job Matcher
          </Link>
        </div>
      </div>
    </div>
  );
}
