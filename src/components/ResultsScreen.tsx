import { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  BookOpen, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Trophy,
  Award,
  AlertCircle,
  HelpCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';
import { Question, AnswerRecord } from '../types';

interface ResultsScreenProps {
  questions: Question[];
  answers: AnswerRecord[];
  score: number;
  onRestart: () => void;
  categoryName: string;
  playerName?: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  total: number;
  pct: number;
  pts: number;
  isCurrentUser?: boolean;
}

export default function ResultsScreen({
  questions,
  answers,
  score,
  onRestart,
  categoryName,
  playerName = 'Aditya Verma',
}: ResultsScreenProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
  // Calculate total response time
  const totalSeconds = answers.reduce((sum, current) => sum + current.timeTaken, 0);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute appraisal with dark minimal theme colors
  const getAcademicEvaluation = () => {
    if (percentage >= 90) {
      return { 
        grade: 'A+', 
        color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5', 
        remark: 'Excellent Work! Flawless execution and deep logic command.' 
      };
    }
    if (percentage >= 75) {
      return { 
        grade: 'A', 
        color: 'border-blue-500/30 text-blue-400 bg-blue-500/5', 
        remark: 'Very Strong! High aptitude demonstrated across tested conditions.' 
      };
    }
    if (percentage >= 55) {
      return { 
        grade: 'B', 
        color: 'border-amber-500/30 text-amber-400 bg-amber-500/5', 
        remark: 'Proficient! Competent analytical process with minor logic lapses.' 
      };
    }
    return { 
      grade: 'C', 
      color: 'border-rose-500/30 text-rose-400 bg-rose-500/5', 
      remark: 'Review Suggested. Strengthen core understanding and re-test parameters.' 
    };
  };

  const evalResults = getAcademicEvaluation();

  const toggleReviewItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Build local sorted leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Baseline mock competitors matching the screenshot
    const baseline: LeaderboardEntry[] = [
      { name: 'Sarah Johnson', score: 10, total: 10, pct: 100, pts: 180 },
      { name: 'Emma Watson', score: 7, total: 10, pct: 70, pts: 110 },
      { name: 'James Wilson', score: 6, total: 10, pct: 60, pts: 90 },
      { name: 'Michael Brown', score: 5, total: 10, pct: 50, pts: 70 },
    ];

    // Current player entry
    const userEntry: LeaderboardEntry = {
      name: playerName || 'Aditya Verma',
      score: correctCount,
      total: totalQuestions,
      pct: percentage,
      pts: score,
      isCurrentUser: true,
    };

    // Integrate current player entry, sort by points (descending)
    const combined = [...baseline, userEntry].sort((a, b) => b.pts - a.pts);
    setLeaderboard(combined.slice(0, 5));
  }, [playerName, correctCount, totalQuestions, percentage, score]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8 animate-fade-in text-slate-900 dark:text-slate-100" id="results-screen-outer">
      
      {/* Top Banner text matching page header */}
      <div className="text-left mb-6 sm:mb-8 select-none">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10 border border-slate-200 dark:border-slate-500/20 px-3 py-1 rounded-full">
          Assessment Concluded
        </span>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
          Quiz Completed! 🎉
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal mt-1.5">
          Great job, <span className="font-extrabold text-blue-600 dark:text-blue-400">{playerName}</span>! Here are your results.
        </p>
      </div>

      {/* Main Results Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* Left Card: Gold Trophy & Metrics */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 sm:p-8 rounded-3xl relative shadow-sm dark:shadow-xl overflow-hidden text-center flex flex-col justify-between min-h-[460px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          {/* Trophy Illustration matching screenshot pedestal style */}
          <div className="flex flex-col items-center py-4 relative">
            <div className="absolute w-24 h-24 bg-blue-500/25 dark:bg-blue-500/10 rounded-full blur-2xl top-4" />
            
            {/* Visual Glass Trophy Container */}
            <div className="w-24 h-24 bg-slate-50 dark:bg-gradient-to-tr dark:from-blue-500/10 dark:to-indigo-500/25 border border-slate-200 dark:border-blue-500/30 rounded-2xl flex items-center justify-center shadow-md dark:shadow-lg relative group transition-transform duration-500 hover:scale-105">
              <Trophy className="w-12 h-12 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
            </div>

            {/* Pedestal Base */}
            <div className="w-32 h-1.5 bg-slate-200 dark:bg-[#1b234d] border border-slate-300 dark:border-blue-500/20 rounded-full shadow-xs mt-4 relative">
              <div className="absolute inset-x-4 bottom-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full opacity-60" />
            </div>
          </div>

          {/* Performance Data readout values row */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] p-5 rounded-2xl text-left shadow-xs">
            <div className="text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Your Score</span>
              <span className="font-sans text-xl font-black text-slate-900 dark:text-white block mt-1">
                {correctCount} <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/ {totalQuestions}</span>
              </span>
            </div>
            <div className="text-center border-l border-r border-slate-200 dark:border-[#1d2442]">
              <span className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Percentage</span>
              <span className="font-sans text-xl font-black text-blue-600 dark:text-blue-400 block mt-1">
                {percentage}%
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Time Taken</span>
              <span className="font-sans text-xl font-black text-slate-800 dark:text-slate-200 block mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 font-normal" />
                <span>{formatTime(totalSeconds)}</span>
              </span>
            </div>
          </div>

          {/* Bottom aligned visual remarks */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#1d2442]/60 mt-4 text-left flex items-start gap-3">
            <div className="p-2 border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0 font-bold font-mono text-base h-10 w-10 flex items-center justify-center select-none">
              {evalResults.grade}
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-widest text-[#60a5fa] uppercase font-bold">
                GRADE COMMENTARY
              </span>
              <p className="text-slate-700 dark:text-slate-400 text-[11.5px] leading-snug">
                {evalResults.remark}
              </p>
            </div>
          </div>

          {/* Core action buttons inside the trophy wrapper */}
          <div className="grid grid-cols-2 gap-3.5 pt-5 border-t border-slate-100 dark:border-[#1d2442]/50 mt-4 shrink-0">
            <button
              onClick={onRestart}
              className="py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-350 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Quiz</span>
            </button>
            <button
              onClick={onRestart}
              className="py-3 border border-slate-200 dark:border-[#1d2442] hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-[#11162d] text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Right Card: Performance Overview & Question Summary */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 sm:p-8 rounded-3xl relative shadow-md dark:shadow-xl overflow-hidden flex flex-col justify-between min-h-[460px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="space-y-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block border-b border-slate-100 dark:border-[#1d2442] pb-2.5">
              Performance Overview
            </span>

            {/* Glowing Donut chart representing Correct vs Wrong */}
            <div className="flex items-center gap-10 py-2">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    className="stroke-slate-100 dark:stroke-[#1d2442]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="44"
                    className="stroke-emerald-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10 select-none">
                  <span className="block text-xl font-black text-slate-900 dark:text-white">{percentage}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate</span>
                </div>
              </div>

              {/* Legend with matching metrics values */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 block shrink-0" />
                  <div className="text-left select-none">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block leading-none">Correct</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block mt-0.5">{correctCount} Questions</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-md bg-rose-500 block shrink-0" />
                  <div className="text-left select-none">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block leading-none">Wrong</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block mt-0.5">{wrongCount} Questions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Summary: checklist Grid as depicted in results card mockup */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-[#1d2442]/65">
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Question Summary Checklist
              </span>
              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const checkAnswer = answers.find(a => a.questionIndex === idx);
                  const isUserOk = checkAnswer?.isCorrect || false;

                  return (
                    <div 
                      key={idx} 
                      className={`h-11 rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all hover:scale-105 cursor-default ${
                        isUserOk 
                          ? 'border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' 
                          : 'border-rose-500/25 dark:border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span className="text-[9px] font-mono leading-none text-slate-500 dark:text-slate-400 block">{idx + 1}</span>
                      {isUserOk ? (
                        <Check className="w-3 h-3 stroke-[3] text-emerald-500 dark:text-emerald-450" />
                      ) : (
                        <X className="w-3 h-3 stroke-[3] text-rose-500 dark:text-rose-450" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Leaderboard Row spanning full width */}
      <div className="bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 sm:p-7 rounded-3xl shadow-sm dark:shadow-xl space-y-4 mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-[#1d2442] pb-3 select-none">
          <div className="flex items-center gap-2">
            <Trophy className="w-4.5 h-4.5 text-yellow-500 dark:text-yellow-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 dark:text-white">
              Leaderboard (Top 5)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">
            Global Snapshot Live
          </span>
        </div>

        {/* Leaderboards layout matching the mockup list */}
        <div className="grid grid-cols-1 gap-2">
          {leaderboard.map((player, idx) => {
            const rank = idx + 1;
            const isSelf = player.isCurrentUser;
            
            // Render specific crown / rank badges
            let rankBadge = (
              <span className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-[#161c38] border border-slate-200 dark:border-[#2b3569] flex items-center justify-center text-[10.5px] font-mono font-black text-slate-500 dark:text-slate-400">
                {rank}
              </span>
            );
            if (rank === 1) {
              rankBadge = (
                <div className="w-7 h-7 bg-yellow-400/20 border border-yellow-400/50 rounded-lg flex items-center justify-center text-yellow-500 dark:text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.15)] dark:shadow-[0_0_10px_rgba(234,179,8,0.25)]">
                  👑
                </div>
              );
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-7 h-7 bg-slate-200/40 dark:bg-slate-300/20 border border-slate-300/40 dark:border-slate-300/50 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300">
                  🥈
                </div>
              );
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-7 h-7 bg-amber-700/10 dark:bg-amber-700/20 border border-amber-700/30 dark:border-amber-700/50 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-500">
                  🥉
                </div>
              );
            }

            return (
              <div 
                key={idx}
                className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-xs ${
                  isSelf 
                    ? 'border-blue-500 bg-blue-500/5 dark:bg-[#161c38]/80 shadow-[0_4px_12px_rgba(59,130,246,0.08)] dark:shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : 'border-slate-100 dark:border-[#1d2442]/50 bg-slate-50/40 dark:bg-[#0c0f1e]/60 hover:border-slate-200 dark:hover:border-[#1d2442]'
                }`}
              >
                <div className="flex items-center gap-3.5 shrink-0 w-full sm:w-auto">
                  {rankBadge}
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    {player.name} {isSelf && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono normal-case ml-1 font-semibold">(You)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end w-full sm:w-auto mt-3 sm:mt-0 pt-3.5 sm:pt-0 border-t border-slate-100 dark:border-[#1d2442]/30 sm:border-transparent">
                  <div className="text-left font-mono">
                    <span className="text-[8px] uppercase text-slate-400 dark:text-slate-500 block leading-none">ACCURATE</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-white block mt-0.5">{player.score} / {player.total} ({player.pct}%)</span>
                  </div>
                  <div className="text-left font-mono shrink-0">
                    <span className="text-[8px] uppercase text-slate-400 dark:text-slate-500 block leading-none">Score Gain</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 block mt-0.5">{player.pts} PTS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Examination Review details */}
      <div className="space-y-4">
        <h3 className="text-[10.5px] uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-[#1d2442] pb-3" id="examination-review-title">
          <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>Historical Examination Review details</span>
        </h3>

        <div className="space-y-4" id="review-cards-list">
          {questions.map((question, index) => {
            const answer = answers.find(a => a.questionIndex === index);
            const isUserCorrect = answer?.isCorrect || false;
            const userSelectedIndex = answer?.selectedIndex ?? -1;
            const isExpanded = expandedIndex === index;

            return (
              <div 
                key={question.id}
                className={`bg-white dark:bg-[#0f1326] border overflow-hidden transition-all duration-200 rounded-2xl ${
                  isExpanded ? 'border-blue-500 ring-1 ring-blue-500/15' : 'border-slate-200 dark:border-[#1d2442] hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                {/* Expand Click row header */}
                <button
                  onClick={() => toggleReviewItem(index)}
                  className="w-full p-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-hidden"
                  id={`review-item-toggle-${index}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-lg ${
                      isUserCorrect 
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/40' 
                        : 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/40'
                    }`}>
                      {isUserCorrect ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </div>

                    <div>
                      <span className="text-[8.5px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold block">
                        ITEM 0{index + 1} / {isUserCorrect ? "ACCURATE" : "INCORRECT"}
                      </span>
                      <p className="text-[13.5px] font-sans font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                        {question.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[9px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 rounded-lg select-none">
                      {question.difficulty}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Body review details expansion block */}
                {isExpanded && (
                  <div className="px-5 sm:px-12 pb-6 pt-3 border-t border-slate-100 dark:border-[#1d2442] text-left bg-slate-50/30 dark:bg-[#0c0f1e]/40 font-sans">
                    <p className="text-slate-800 dark:text-white font-bold mb-4 text-[14px] leading-normal mt-2">
                      {question.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {question.options.map((opt, optIdx) => {
                        const isCorrectOption = optIdx === question.correctAnswerIndex;
                        const isUserSelected = optIdx === userSelectedIndex;

                        let borderClass = 'border-slate-200 dark:border-[#1d2442] bg-white dark:bg-[#0a0d1b] text-slate-500 dark:text-slate-400 rounded-xl';
                        if (isCorrectOption) {
                          borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl';
                        } else if (isUserSelected) {
                          borderClass = 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold rounded-xl';
                        }

                        return (
                          <div 
                            key={optIdx} 
                            className={`p-3.5 border text-xs flex justify-between items-center ${borderClass}`}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isCorrectOption && (
                              <span className="text-[8px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-500/35 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                                Correct Choice
                              </span>
                            )}
                            {isUserSelected && !isCorrectOption && (
                              <span className="text-[8px] uppercase tracking-wider font-bold text-rose-600 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-500/35 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                                Selected Wrong
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanatory Academic Comments */}
                    <div className="p-4 bg-slate-50 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                      <span className="font-mono text-[9px] uppercase tracking-wide text-blue-600 dark:text-[#657dff] block mb-1.5 font-bold">
                        Academic Commentary & Fact Verification:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {question.explanation || "This question tests fundamental principles and logic core. No specific explanation is written, but checking original documentation reinforces learning."}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#1d2442]/60 flex justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500">
                        <span>Speed metric: {answer?.timeTaken ?? 0}s response time</span>
                        <span>Complexity Grade: {question.difficulty}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
