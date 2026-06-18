import { useState, useEffect } from 'react';
import { 
  Shuffle, 
  Cpu, 
  FlaskConical, 
  Globe, 
  Trophy, 
  Play, 
  Clock, 
  Database, 
  Globe2,
  User,
  Zap,
  Sliders,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data';
import { QuizSettings, HighScore } from '../types';

interface SetupScreenProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

export default function SetupScreen({ onStartQuiz }: SetupScreenProps) {
  // Config state
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('quizmaster_user_name') || 'Sonu kumar';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerDuration, setTimerDuration] = useState<number>(15); // Default 15s per question
  const [source, setSource] = useState<'local' | 'api'>('local');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);

  // Category highscores state
  const [highScores, setHighScores] = useState<Record<string, HighScore>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('quizcraft_highscores');
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading high scores:', e);
    }
  }, []);

  // Sync player name to local storage
  useEffect(() => {
    localStorage.setItem('quizmaster_user_name', playerName);
  }, [playerName]);

  // Helper to render category icons dynamically
  const renderCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Cpu': return <Cpu className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      default: return <Shuffle className={className} />;
    }
  };

  const handleStart = () => {
    onStartQuiz({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount,
      timerDuration,
      source,
      playerName: playerName.trim() || 'Aditya Verma',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in" id="setup-screen-container">
      
      {/* Upper Grid: Left Hero text & Input, Right Glow Question Mark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
        
        {/* Left Column: Test Your Knowledge text & Name input */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              QUIZMASTER INTERACTIVE PLATFORM
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Test Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.1)]">Knowledge</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Challenge yourself with our interactive quizzes. Track your score, compete with others, and become a Quiz Master!
            </p>
          </div>

          {"/* Feature capsules row */"}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-[#121833] border border-slate-200 dark:border-[#1e264d] rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-105">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{questionCount} Questions</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-[#121833] border border-slate-200 dark:border-[#1e264d] rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-105">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{timerDuration === 0 ? "Untimed" : `${timerDuration}s per Question`}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-[#121833] border border-slate-200 dark:border-[#1e264d] rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-105 font-medium">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Instant Results</span>
            </div>
          </div>

          {/* Name input card block */}
          <div className="bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-6 sm:p-7 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] space-y-4 max-w-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Enter Your Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </span>
                <input
                  type="text"
                  placeholder="Type your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] focus:border-blue-500 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-hidden transition-all focus:ring-2 focus:ring-blue-500/15"
                  id="player-name-input"
                />
              </div>
            </div>

            {/* Target launcher button */}
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-[0.99] group"
              id="start-quiz-btn"
            >
              <span>Start Quiz</span>
              <Play className="w-3.5 h-3.5 fill-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Custom Animated Glowing CSS 3D Question Mark Canvas */}
        <div className="lg:col-span-5 flex justify-center py-4">
          <div className="relative w-72 h-72 flex items-center justify-center bg-white dark:bg-[#0f1326]/30 border border-slate-200 dark:border-[#1d2442]/50 rounded-3xl overflow-hidden shadow-xs dark:shadow-[inset_0_0_30px_rgba(59,130,246,0.05)] select-none">
            
            {/* Soft pulsing nebula glow behind */}
            <div className="absolute w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            
            {/* Animated stars floating around */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_transparent_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#080b18_100%)]" />
            
            {/* Main Interactive Floating Display */}
            <div className="relative flex flex-col items-center animate-bounce duration-5000 ease-in-out" style={{ animationDuration: '6s', animationIterationCount: 'infinite' }}>
              
              {/* Question design glassmorphism box displaying the beautiful generated asset */}
              <div className="relative flex items-center justify-center w-36 h-36 border border-blue-200 dark:border-blue-500/20 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.15)] bg-slate-950">
                <img 
                  src="/src/assets/images/question_mark_glow_1781723853498.jpg" 
                  alt="Futuristic Trivia Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Pedestal Platform */}
              <div className="w-48 h-3 mt-6 bg-slate-200 dark:bg-[#161c38] border border-slate-300 dark:border-[#2b3569] rounded-full shadow-xs dark:shadow-[0_8px_30px_rgba(59,130,246,0.3)] flex items-center justify-center relative">
                <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xs opacity-30 dark:opacity-50 animate-pulse" />
                <span className="w-12 h-1 bg-blue-500 rounded-full opacity-60" />
              </div>
            </div>

            {/* Glowing stats summary overlay */}
            <div className="absolute bottom-3 text-center w-full">
              <span className="text-[9px] font-mono tracking-widest text-[#475569] dark:text-slate-500 uppercase">
                SYSTEM CORE ONLINE // ACCURATE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Section: Advanced Configurations and Variables Selection */}
      <div className="border-t border-slate-200 dark:border-[#1d2442]/60 pt-8" id="advanced-config-panel">
        
        {/* Row Header with toggle show */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Customize Quiz Compliance & Variables
            </h3>
          </div>
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer font-semibold py-1.5 px-3 bg-slate-100 dark:bg-[#121833] border border-slate-200 dark:border-[#1e264d] rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>{showAdvanced ? "Collapse Settings" : "Configure Parameters"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
            
            {/* Category Selector Cards Grid (Takes 7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-5 sm:p-6 rounded-2xl shadow-sm dark:shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2442] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Step 1 / Select Question Domain
                </span>
                <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {CATEGORIES.length} Streams Active
                </span>
              </div>

              {/* Custom categories selectors - adaptive styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="setup-categories-selectors">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const catScoreObj = highScores[cat.id];

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs cursor-pointer select-none relative group ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-[#161c38]'
                          : 'border-slate-200 dark:border-[#1d2442] bg-slate-50/30 dark:bg-[#0c0f1e] hover:border-slate-400 dark:hover:border-[#2b3569] hover:bg-slate-50 dark:hover:bg-[#11162d]'
                      }`}
                      id={`cat-btn-${cat.id}`}
                    >
                      {/* Left color bar indicator */}
                      <div className={`absolute left-0 top-4 w-0.5 h-7 rounded-r-md transition-all duration-200 ${
                        isSelected ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700/50 group-hover:bg-slate-500'
                      }`} />

                      <div className="pl-2">
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className={`p-1 w-6 h-6 rounded-md flex items-center justify-center text-white bg-gradient-to-br ${cat.color}`}>
                            {renderCategoryIcon(cat.icon, "w-3 h-3")}
                          </div>
                          {isSelected && (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600 dark:text-[#60a5fa] bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.2 rounded-md">
                              Active
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-slate-800 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cat.name}
                        </span>

                        {catScoreObj && (
                          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1.5 block">
                            Best: {catScoreObj.score} PTS ({catScoreObj.percentage}%)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variables Adjustments Column (Takes 5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] p-5 sm:p-6 rounded-2xl shadow-sm dark:shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1d2442] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Step 2 / Adjust Engine Constants
                </span>
                <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  Variable Tuner
                </span>
              </div>

              {/* Pipeline Source Selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Questions Pipeline Source
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50 dark:bg-[#0a0d1b] p-1 border border-slate-200 dark:border-[#1d2442] rounded-xl">
                  <button
                    onClick={() => {
                      setSource('local');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-wider uppercase font-bold rounded-lg transition-all cursor-pointer ${
                      source === 'local'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <Database className="w-3 h-3" />
                    Offline Snapshot
                  </button>
                  <button
                    onClick={() => setSource('api')}
                    className={`flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-wider uppercase font-bold rounded-lg transition-all cursor-pointer ${
                      source === 'api'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <Globe2 className="w-3 h-3" />
                    Live Web API
                  </button>
                </div>
              </div>

              {/* Complexity Metric */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Complexity Metric
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-[#0a0d1b] border border-slate-200 dark:border-[#1d2442] rounded-xl">
                  {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-1.5 rounded-lg text-[9px] tracking-wider uppercase font-bold transition-all cursor-pointer border ${
                        selectedDifficulty === diff
                          ? 'bg-blue-600/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/20'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Capacity Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span>Sample size capacity</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded px-1.5 py-0.2 text-[9px] font-bold">
                    {questionCount} ITEMS
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-[#0a0d1b] border border-slate-300 dark:border-[#1d2442] accent-blue-600 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-500 dark:text-slate-500">
                  <span>Min: 5 questions</span>
                  <span>Max: 20 questions</span>
                </div>
              </div>

              {/* Timer Duration Option */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Countdown Timing Variable
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 10, 15, 30].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTimerDuration(val)}
                      className={`py-1.5 border rounded-xl text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        timerDuration === val
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-[#161c38] text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-[#1d2442] bg-slate-50 dark:bg-[#0c0f1e] hover:border-slate-400 dark:hover:border-[#2b3569] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#11162d]'
                      }`}
                    >
                      {val === 0 ? 'None' : `${val}s`}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>



    </div>
  );
}
