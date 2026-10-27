import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mic,
  Crosshair,
  Globe,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Compass,
  Settings,
  ExternalLink
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getUserStats } from '../lib/database';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (user?.id) {
      void getUserStats(user.id).then((stats) => {
        if (stats) {
          setLevel(stats.level || 1);
          setXp(stats.xp || 0);
        }
      });
    }
  }, [user?.id, location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Interview Simulator', path: '/interview', icon: Mic },
    { name: 'Job Matcher', path: '/jobs', icon: Crosshair },
    { name: 'Career Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Portfolio Builder', path: '/portfolio', icon: Globe },
    { name: 'Profile & Settings', path: '/settings', icon: Settings },
  ];

  const displayName = (user?.user_metadata?.full_name as string) || (user?.email ? user.email.split('@')[0] : 'Engineer');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card z-20 shrink-0">
        {/* Brand */}
        <div className="p-5 pb-4 border-b border-border/50">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base leading-tight tracking-tight text-foreground">
                CareerBoost
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Engineering Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Minimal Level & Progression Pill */}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="font-semibold text-foreground">Level {level} Track</span>
              <span className="text-muted-foreground">{xp % 100}/100 XP</span>
            </div>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(xp % 100, 6), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Controls Footer */}
        <div className="p-3 border-t border-border bg-card space-y-2">
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-muted/30 transition-colors">
            <Link to="/settings" className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center font-mono font-bold text-xs shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate text-foreground leading-tight">{displayName}</span>
                <span className="text-[10px] font-mono text-muted-foreground truncate">{user?.email}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              title="Toggle theme"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 w-full rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card z-30">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-base text-foreground">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span>CareerBoost</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-foreground hover:bg-muted"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-[53px] left-0 right-0 bottom-0 bg-background z-50 p-4 md:hidden overflow-y-auto flex flex-col border-b border-border"
            >
              <div className="mb-3 p-3 rounded-lg bg-muted/40 border border-border text-xs font-mono flex items-center justify-between">
                <span className="font-semibold text-foreground">Level {level} Track</span>
                <span className="text-muted-foreground">{xp} XP</span>
              </div>

              <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === '/dashboard' && location.pathname === '/');
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-border mt-3 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Landing Page
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
