import { ArrowRight, AlertCircle, CheckCircle2, XCircle, HelpCircle, FastForward } from 'lucide-react';
import { Question, AnswerRecord } from '../types';

interface QuestionCardProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  selectedAnswerIndex: number | null;
  correctAnswerIndex: number;
  isAnswered: boolean;
  timeLeft: number;
  timerDuration: number;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
  runningScore: number;
  answers: AnswerRecord[];
}

export default function QuestionCard({
  question,
  currentNumber,
  totalQuestions,
  selectedAnswerIndex,
  correctAnswerIndex,
  isAnswered,
  timeLeft,
  timerDuration,
  onSelectOption,
  onNext,
  runningScore,
  answers,
}: QuestionCardProps) {
  
  const progressPercent = (currentNumber / totalQuestions) * 100;
  const timeProgressPercent = timerDuration > 0 ? (timeLeft / timerDuration) * 100 : 100;

  // Option background/border styles based on answers state
  const getOptionClasses = (index: number) => {
    const baseClass = "w-full min-h-[58px] px-5 py-4 border text-sm font-semibold transition-all flex items-center justify-between text-left select-none relative group rounded-2xl cursor-pointer ";
    
    if (!isAnswered) {
      // Normal interactive state before submission with beautiful subtle lift hover effects
      return baseClass + "border-slate-200 dark:border-[#1d2442] bg-white dark:bg-[#0a0d1b] text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-[#11162d] hover:shadow-[0_4px_15px_rgba(59,130,246,0.08)] active:scale-[0.995] hover:-translate-y-0.5";
    }

    // After answer is logged:
    const isThisCorrect = index === correctAnswerIndex;
    const isThisSelected = index === selectedAnswerIndex;

    if (isThisCorrect) {
      // Correct choice
      return baseClass + "border-emerald-500 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]";
    }

    if (isThisSelected && !isThisCorrect) {
      // Selected wrong option
      return baseClass + "border-rose-505 bg-rose-500/10 text-rose-650 dark:text-rose-400 font-bold";
    }

    // Faded non-selected wrong choices
    return baseClass + "border-slate-200/50 dark:border-[#1d2442]/40 bg-slate-50/50 dark:bg-[#0a0d1b]/40 text-slate-400 dark:text-slate-500 opacity-40 cursor-not-allowed";
  };

  const getOptionPrefix = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  // Timer indicator text and track color coding
  const getTimerColorClass = () => {
    if (timeLeft <= 3) return 'text-rose-500 bg-rose-500/10 border-rose-500/30 animate-pulse';
    if (timeLeft <= 5) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8" id="quiz-question-card-outer">
      
      {/* Structural layout: Left menu stats panel, Right active questions card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Quiz Progress card containing dynamic circle & progress index (300px minwidth) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 rounded-2xl shadow-sm dark:shadow-lg space-y-6">
          
          <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-[#1d2442] pb-2.5">
            Quiz Progress
          </h4>

          {/* Circle ring visualizer */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* background track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-slate-100 dark:stroke-[#1d2442]"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-emerald-500 transition-all duration-500 ease-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={326}
                  strokeDashoffset={326 - (326 * currentNumber) / totalQuestions}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Readout label in center */}
              <div className="text-center select-none z-10">
                <span className="block text-2xl font-sans font-black text-slate-900 dark:text-white">
                  {currentNumber}/{totalQuestions}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Questions
                </span>
              </div>
            </div>
          </div>

          {/* Questions Grid mapping */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              State Mapper
            </span>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const stepIdx = idx;
                const answer = answers.find(a => a.questionIndex === stepIdx);
                const isCurrent = stepIdx === currentNumber - 1;

                // Color-coded logic
                let gridClass = "h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-[#1d2442] bg-slate-50/50 dark:bg-[#0a0d1b]/40";
                
                if (answer) {
                  if (answer.isCorrect) {
                    gridClass = "h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/50";
                  } else {
                    gridClass = "h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 dark:border-rose-500/40";
                  }
                } else if (isCurrent) {
                  gridClass = "h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold bg-blue-600 text-white border border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.25)] dark:shadow-[0_0_12px_rgba(59,130,246,0.4)] animate-pulse";
                }

                return (
                  <div key={idx} className={gridClass}>
                    {stepIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color dictionary index */}
          <div className="border-t border-slate-100 dark:border-[#1d2442]/60 pt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[9px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Question box (70% space) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-xl relative overflow-hidden" id="main-question-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          {/* Header metadata row */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-[#1d2442] pb-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-[#60a5fa] bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 px-2.5 py-0.5 rounded-lg select-none">
                LEVEL: {question.difficulty}
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {question.category === 'tech' ? 'Computer Science' :
                 question.category === 'science' ? 'Science & Nature' :
                 question.category === 'history' ? 'History & Geography' :
                 question.category === 'sports' ? 'Sports & Athletics' :
                 question.category}
              </span>
            </div>
          </div>

          {/* Question title markup */}
          <div className="space-y-3">
            <span className="text-[10.5px] font-mono text-blue-600 dark:text-[#60a5fa] block font-semibold">
              QUESTION {currentNumber} OF {totalQuestions}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans">
              {question.question}
            </h3>
          </div>

          {/* Interactive choices cards list (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-6" id="quiz-options-container">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = correctAnswerIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && onSelectOption(index)}
                  disabled={isAnswered}
                  className={getOptionClasses(index)}
                  id={`option-btn-${index}`}
                >
                  <div className="flex items-center gap-3.5 pr-2 w-full">
                    {/* Prefix letter bubble A, B, C, D */}
                    <div className={`w-7 h-7 border text-[10px] font-mono flex items-center justify-center transition-all rounded-lg flex-shrink-0 ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-500 border-emerald-400 text-white font-extrabold'
                          : isSelected
                            ? 'bg-rose-500 border-rose-400 text-white font-extrabold'
                            : 'bg-slate-100 dark:bg-[#0a0d1b] border-slate-200 dark:border-[#1d2442]/30 text-slate-400 dark:text-slate-500'
                        : 'bg-slate-50 dark:bg-[#0a0d1b] border-slate-200 dark:border-[#1d2442] text-slate-600 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
                    }`}>
                      {getOptionPrefix(index)}
                    </div>
                    <span className="leading-snug pr-1 break-words py-1 text-[13.5px] font-medium text-left text-slate-800 dark:text-slate-200 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {option}
                    </span>
                  </div>

                  {/* Immediate icon results indicator */}
                  {isAnswered && (isCorrect || (isSelected && !isCorrect)) && (
                    <div className="flex-shrink-0 ml-1.5 z-10">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Remaining Horizontal Progress Tracker Slider matching dynamic rate */}
          {timerDuration > 0 && (
            <div className="space-y-2 mt-8 mb-6">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] rounded-full overflow-hidden relative">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-linear rounded-full`}
                  style={{ width: `${timeProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span className="font-semibold uppercase tracking-wider">Assigned Constant timer</span>
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${getTimerColorClass()}`}>
                  {timeLeft === 0 ? "TIME EXPIRED" : `${timeLeft}s Left`}
                </div>
              </div>
            </div>
          )}

          {/* Advanced feedback drawer containing commentary comments */}
          {isAnswered && (
            <div 
              className={`p-4.5 rounded-xl border text-xs text-left leading-relaxed mt-6 mb-4 animate-slide-up ${
                selectedAnswerIndex === correctAnswerIndex
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-300'
                  : selectedAnswerIndex === null
                    ? 'bg-amber-500/5 border-amber-500/20 text-slate-800 dark:text-slate-300'
                    : 'bg-rose-500/5 border-rose-500/20 text-slate-800 dark:text-slate-300'
              }`}
            >
              <div className="flex gap-3 items-start">
                <AlertCircle className={`w-4 h-4 mt-0.5 ${(selectedAnswerIndex === correctAnswerIndex) ? 'text-emerald-500' : 'text-rose-500'}`} />
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-blue-600 dark:text-[#60a5fa] block font-bold">
                    {selectedAnswerIndex === correctAnswerIndex 
                      ? 'CORRECT SUBMISSION COMPLETED' 
                      : selectedAnswerIndex === null
                        ? 'TIME LAPS NOTICE'
                        : `INCORRECT CHOICE DETECTED (CORRECT KEY: ${getOptionPrefix(correctAnswerIndex)})`}
                  </span>
                  <p className="font-sans text-[12.5px] text-slate-700 dark:text-slate-300 leading-normal">
                    {question.explanation || `This question tests fundamental ${question.category} domain mechanics. Review the details for improved accuracy rate.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lower controls menu button bar */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-200 dark:border-[#1d2442]/60">
            
            {/* Left side actions: Skip or reset */}
            <div>
              {!isAnswered ? (
                <button
                  onClick={() => onSelectOption(-1)}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-white dark:bg-transparent border border-slate-200 dark:border-[#1d2442] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#11162d] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer select-none font-mono tracking-wider uppercase shadow-xs"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>
              ) : (
                <div className="text-[10px] font-mono text-slate-500 uppercase">
                  Validator score verified
                </div>
              )}
            </div>

            {/* Right side primary launcher */}
            <div>
              {isAnswered ? (
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-[10.5px] uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 group"
                  id="next-question-btn"
                >
                  <span>{currentNumber === totalQuestions ? "Compile final grade" : "Continue Assessment"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-[#60a5fa] tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-2 rounded-xl">
                  Select an Option
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
