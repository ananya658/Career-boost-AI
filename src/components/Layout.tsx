import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mic,
  Globe,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Map,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [xp, setXp] = useState(120);

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
    { name: 'Job Matcher', path: '/jobs', icon: Briefcase },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Portfolio Builder', path: '/portfolio', icon: Globe },
    { name: 'Profile & Settings', path: '/settings', icon: Settings },
  ];

  const displayName = (user?.user_metadata?.full_name as string) || (user?.email ? user.email.split('@')[0] : 'Engineer');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-card/60 backdrop-blur-2xl z-20 shrink-0">
        {/* Brand */}
        <div className="p-6 pb-5">
          <Link to="/dashboard" className="flex items-center gap-3 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-foreground">
              CareerBoost<span className="text-primary">.ai</span>
            </span>
          </Link>
        </div>

        {/* Gamification Level Card */}
        <div className="px-5 mb-5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent border border-primary/20 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Level {level} Pro
              </span>
              <span className="text-muted-foreground">{xp % 100} / 100 XP</span>
            </div>
            <div className="h-2 bg-background/80 rounded-full overflow-hidden border border-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.max(xp % 100, 8), 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {100 - (xp % 100)} XP to reach Level {level + 1}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname === '/');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Controls Footer */}
        <div className="p-4 border-t border-border bg-card/80 space-y-3">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-muted/40 transition-colors">
            <Link to="/settings" className="flex items-center gap-2.5 overflow-hidden flex-1">
              <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-foreground">{displayName}</span>
                <span className="text-[11px] text-muted-foreground truncate">{user?.email}</span>
              </div>
            </Link>
            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle theme"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={signOut}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle background ambient radial blooms */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[350px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-xl z-30">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span>CareerBoost</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-foreground hover:bg-muted"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[57px] left-0 right-0 bottom-0 bg-background/95 backdrop-blur-2xl z-50 p-5 md:hidden overflow-y-auto flex flex-col"
            >
              <div className="mb-4 p-3 rounded-xl bg-primary/10 text-xs font-bold text-primary flex items-center justify-between">
                <span>Level {level} Pro</span>
                <span>{xp} Total XP</span>
              </div>

              <nav className="space-y-1.5 flex-1">
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-border mt-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground p-2"
                >
                  <ExternalLink className="w-4 h-4" /> View Public Landing Page
                </Link>
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
