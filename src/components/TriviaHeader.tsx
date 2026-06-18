import { useState } from 'react';
import { Lightbulb, Moon, Sun, Trophy, Menu, X, Home, Compass, Info, Mail } from 'lucide-react';

interface TriviaHeaderProps {
  onReset: () => void;
  highScore: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLeaderboard: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export default function TriviaHeader({ 
  onReset, 
  highScore, 
  theme, 
  onToggleTheme,
  onOpenLeaderboard,
  onOpenAbout,
  onOpenContact
}: TriviaHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full bg-white/70 dark:bg-[#080b18]/70 backdrop-blur-md border-b border-slate-200 dark:border-[#1d2442]/60 h-20 px-4 sm:px-6 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          onClick={() => {
            onReset();
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer focus:outline-hidden group"
          id="header-logo-btn"
        >
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
            <Lightbulb className="w-5.5 h-5.5 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-left select-none">
            <h1 className="font-sans font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center">
              Quiz<span className="text-blue-500 font-bold">Master</span>
            </h1>
          </div>
        </button>

        {/* Navigation Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <button 
            onClick={onReset} 
            className="text-slate-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer relative py-2"
          >
            Home
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
          </button>
          <button 
            onClick={onOpenLeaderboard}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Leaderboard
          </button>
          <button 
            onClick={onOpenAbout}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={onOpenContact}
            className="hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Global High Score Pill & Theme Toggle */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100 dark:bg-[#11162d] border border-slate-200 dark:border-[#1d2442] rounded-full hover:bg-slate-200 dark:hover:bg-[#151b36] transition-all cursor-default select-none hidden sm:flex"
            id="global-highscore-indicator"
          >
            <Trophy className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <div className="text-[10px] font-mono tracking-wider font-extrabold text-slate-500 dark:text-slate-400 uppercase leading-none">
              RECORD: <span className="text-blue-600 dark:text-blue-400 ml-0.5">{highScore} PTS</span>
            </div>
          </div>

          {/* Sun/Moon Toggle Button */}
          <button 
            onClick={onToggleTheme}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 dark:bg-[#11162d] dark:hover:bg-[#1d2442] text-slate-500 dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-[#1d2442] transition-all cursor-pointer hover:scale-105 hover:rotate-6 active:scale-95 shadow-xs animate-fade-in"
            id="theme-toggler-btn"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Mobile Menu Icon */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-[#11162d] dark:hover:bg-[#1d2442] dark:text-slate-400 dark:hover:text-white rounded-xl border border-slate-200 dark:border-[#1d2442] transition-all cursor-pointer active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-red-500" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-[#0a0d1b] border-b border-slate-200 dark:border-[#1d2442] shadow-2xl z-40 md:hidden animate-slide-down py-4 px-4 flex flex-col gap-2">
          {/* Highscore line for mobile drawer */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0c0f1e] border border-slate-100 dark:border-[#1d2442]/60 rounded-xl mb-1.5 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-350">YOUR PERSONAL HIGH RECORD:</span>
            </div>
            <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">{highScore} PTS</span>
          </div>

          <button
            onClick={() => {
              onReset();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 w-full p-3.5 hover:bg-slate-100 dark:hover:bg-[#11162d] text-slate-705 dark:text-slate-300 hover:text-blue-550 dark:hover:text-white rounded-xl text-left text-sm font-bold transition-all cursor-pointer"
          >
            <Home className="w-4.5 h-4.5 text-blue-550" />
            <span>Home Setup</span>
          </button>

          <button
            onClick={() => {
              onOpenLeaderboard();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 w-full p-3.5 hover:bg-slate-100 dark:hover:bg-[#11162d] text-slate-705 dark:text-slate-300 hover:text-blue-550 dark:hover:text-white rounded-xl text-left text-sm font-bold transition-all cursor-pointer"
          >
            <Compass className="w-4.5 h-4.5 text-yellow-500" />
            <span>General Leaderboards</span>
          </button>

          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 w-full p-3.5 hover:bg-slate-100 dark:hover:bg-[#11162d] text-slate-705 dark:text-slate-300 hover:text-blue-550 dark:hover:text-white rounded-xl text-left text-sm font-bold transition-all cursor-pointer"
          >
            <Info className="w-4.5 h-4.5 text-blue-500" />
            <span>About QuizMaster Info</span>
          </button>

          <button
            onClick={() => {
              onOpenContact();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 w-full p-3.5 hover:bg-slate-100 dark:hover:bg-[#11162d] text-slate-705 dark:text-slate-300 hover:text-blue-550 dark:hover:text-white rounded-xl text-left text-sm font-bold transition-all cursor-pointer"
          >
            <Mail className="w-4.5 h-4.5 text-indigo-500" />
            <span>Developer Contact Core</span>
          </button>
        </div>
      )}
    </header>
  );
}
