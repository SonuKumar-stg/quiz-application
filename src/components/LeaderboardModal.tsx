import { X, Trophy, Trash2, Calendar, Target, Shield, Shuffle, Cpu, FlaskConical, Globe, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HighScore } from '../types';
import { CATEGORIES } from '../data';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearRecords: () => void;
}

export default function LeaderboardModal({ isOpen, onClose, onClearRecords }: LeaderboardModalProps) {
  const [highScores, setHighScores] = useState<Record<string, HighScore>>({});
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);

  // Load scores on open
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('quizcraft_highscores');
        if (stored) {
          setHighScores(JSON.parse(stored));
        } else {
          setHighScores({});
        }
      } catch (e) {
        console.error('Failed to parse high scores:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Render correct category icon helper
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'all':
        return <Shuffle className="w-5 h-5 text-amber-500" />;
      case 'tech':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'science':
        return <FlaskConical className="w-5 h-5 text-emerald-500" />;
      case 'history':
        return <Globe className="w-5 h-5 text-red-500" />;
      case 'sports':
        return <Trophy className="w-5 h-5 text-purple-500" />;
      default:
        return <Trophy className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem('quizcraft_highscores');
      setHighScores({});
      onClearRecords();
      setShowConfirmClear(false);
    } catch (e) {
      console.error('Error clearing:', e);
    }
  };

  const hasAnyScore = Object.keys(highScores).length > 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" id="leaderboard-modal-container">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      {/* Modal Dialog container */}
      <div className="bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-scale-up flex flex-col max-h-[85vh]">
        {/* Top brand header bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-6 border-b border-slate-100 dark:border-[#1d2442]/60 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-[#0a0d1b]/40">
          <div className="flex items-center gap-3 select-none">
            <div className="h-9 w-9 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-sans font-black text-slate-900 dark:text-white text-base">QuizMaster Leaderboard</h3>
              <p className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                Saved system benchmarks & category records
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1c234a] rounded-lg text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            id="close-leaderboard-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {showConfirmClear ? (
            <div className="p-5 bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">Wipe System Leaderboards?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    This will permanently delete your local category high scores and reset the trophy indicator records on the control panel dashboard. This action is final and cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                  Confirm Delete All Records
                </button>
              </div>
            </div>
          ) : null}

          {hasAnyScore ? (
            <div className="space-y-3.5">
              {CATEGORIES.map((cat) => {
                const scoreRecord = highScores[cat.id];
                if (!scoreRecord) return null;

                return (
                  <div 
                    key={cat.id}
                    className="p-4.5 bg-slate-50/50 dark:bg-[#0c0f1e]/80 border border-slate-150 dark:border-[#1d2442]/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-[#11162d] border border-slate-200 dark:border-[#1d2442] flex items-center justify-center shrink-0 shadow-xs">
                        {getCategoryIcon(cat.id)}
                      </div>
                      <div className="text-left">
                        <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm">{cat.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-405 dark:text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {scoreRecord.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#1d2442]" />
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-slate-400" />
                            {scoreRecord.totalQuestions} items
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#1d2442]/30">
                      {/* Interactive score slider percentage bar */}
                      <div className="text-left w-28 hidden md:block">
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <span>Accuracy</span>
                          <span className="text-slate-600 dark:text-slate-350">{scoreRecord.percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 dark:bg-[#1d2442] rounded-full mt-1.5 relative overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: `${scoreRecord.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Display Score Points Badge */}
                      <div className="text-right font-mono flex items-center gap-4">
                        <div className="text-left">
                          <span className="text-[8px] uppercase tracking-wide text-slate-405 dark:text-slate-500 block leading-tight">BENCHMARK</span>
                          <span className="text-sm font-black text-blue-600 dark:text-blue-400 block leading-none mt-0.5">{scoreRecord.score} <span className="text-[10px] text-slate-400">PTS</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 border-2 border-dashed border-slate-200 dark:border-[#19213d] rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-slate-100 dark:bg-[#0c0f1e] text-slate-405 dark:text-slate-500 rounded-full">
                <Shield className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h4 className="font-sans font-bold text-slate-700 dark:text-slate-300 text-sm">No Custom Benchmarks Indexed</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
                  Complete questions across mixed or specific categories to index historic scoreboard results.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4.5 bg-slate-50/50 dark:bg-[#0a0d1b]/40 border-t border-slate-100 dark:border-[#1d2442]/60 shrink-0 flex justify-between items-center">
          <div>
            {hasAnyScore && !showConfirmClear && (
              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10.5px] font-mono tracking-wider text-rose-500 hover:text-rose-600 uppercase font-black cursor-pointer transition-all rounded-lg hover:bg-rose-500/5 hover:-translate-y-0.5"
                id="clear-all-highscores-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Records</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 hover:bg-slate-200 dark:bg-[#11162d] dark:hover:bg-[#1d2442] text-slate-600 dark:text-slate-400 dark:hover:text-white border border-slate-205 dark:border-[#1d2442] hover:border-slate-405 transition-all text-xs font-bold leading-none rounded-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
}
