/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, WifiOff, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import TriviaHeader from './components/TriviaHeader';
import SetupScreen from './components/SetupScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import LeaderboardModal from './components/LeaderboardModal';
import AboutModal from './components/AboutModal';
import ContactModal from './components/ContactModal';
import { Question, QuizSettings, AnswerRecord, HighScore } from './types';
import { LOCAL_QUESTIONS, CATEGORIES } from './data';
import { fetchApiQuestions } from './api';

export default function App() {
  // Screen States: 'setup' | 'playing' | 'results'
  const [viewState, setViewState] = useState<'setup' | 'playing' | 'results'>('setup');

  // Modal open states
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Theme State: 'light' | 'dark' (Defaulting to 'dark' for QuizMaster's visual consistency)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('quizmaster_theme');
      return (stored as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sync theme with document class list
  useEffect(() => {
    try {
      localStorage.setItem('quizmaster_theme', theme);
    } catch {
      // Ignored
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Quiz Configurations
  const [settings, setSettings] = useState<QuizSettings | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [runningScore, setRunningScore] = useState<number>(0);

  // Question Interaction States
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);

  // System Loading / Interceptors
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [globalHighScore, setGlobalHighScore] = useState<number>(0);

  // Timer reference to manage interval clearout across tick states
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Read Global High Score on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('quizcraft_highscores');
      if (stored) {
        const scores: Record<string, HighScore> = JSON.parse(stored);
        const maxScore = Math.max(...Object.values(scores).map(s => s.score), 0);
        setGlobalHighScore(maxScore);
      } else {
        setGlobalHighScore(0);
      }
    } catch (e) {
      console.warn('LocalStorage error reading score:', e);
    }
  }, [viewState, isLeaderboardOpen]);

  // Fisher-Yates shuffle helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // 2. Start the Quiz game
  const handleStartQuiz = async (quizSettings: QuizSettings) => {
    setSettings(quizSettings);
    setIsLoading(true);
    setErrorMsg(null);

    try {
      let filtered: Question[] = [];

      if (quizSettings.source === 'api') {
        // Fetch from Open Trivia DB API
        filtered = await fetchApiQuestions(
          quizSettings.category,
          quizSettings.difficulty,
          quizSettings.questionCount
        );
      } else {
        // Load from Hardcoded local questions database
        filtered = LOCAL_QUESTIONS.filter((q) => {
          const categoryMatch = quizSettings.category === 'all' || q.category === quizSettings.category;
          const difficultyMatch = quizSettings.difficulty === 'all' || q.difficulty === quizSettings.difficulty;
          return categoryMatch && difficultyMatch;
        });

        if (filtered.length === 0) {
          throw new Error('No local questions match selected category & difficulty settings. Try setting difficulty to "all".');
        }

        // Shuffle filtered local database questions
        filtered = shuffleArray(filtered);
        
        // Slice up to selected amount
        const targetCount = Math.min(quizSettings.questionCount, filtered.length);
        filtered = filtered.slice(0, targetCount);
      }

      setQuestions(filtered);
      setCurrentQuestionIdx(0);
      setAnswers([]);
      setRunningScore(0);
      setSelectedAnswerIdx(null);
      setIsAnswered(false);
      setTimeLeft(quizSettings.timerDuration);
      setViewState('playing');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred building the quiz study material.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fallback recovery flow (In case of API limits, let them play Offline instantly)
  const handleOfflineFallback = () => {
    if (!settings) return;
    const offlineSettings: QuizSettings = {
      ...settings,
      source: 'local',
      category: settings.category === 'api' ? 'all' : settings.category,
    };
    handleStartQuiz(offlineSettings);
  };

  // 4. Timer ticking interval loop
  useEffect(() => {
    if (viewState !== 'playing' || !settings || settings.timerDuration === 0 || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Set initial countdown
    setTimeLeft(settings.timerDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout reached
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIdx, viewState, isAnswered, settings]);

  // 5. Timeout flow
  const handleTimeout = () => {
    if (isAnswered) return;
    
    const question = questions[currentQuestionIdx];
    const newAnswer: AnswerRecord = {
      questionIndex: currentQuestionIdx,
      selectedIndex: -1, // -1 indicating timeout
      correctIndex: question.correctAnswerIndex,
      isCorrect: false,
      timeTaken: settings?.timerDuration || 0,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setIsAnswered(true);
    setSelectedAnswerIdx(null);
  };

  // 6. User option click selection
  const handleSelectOption = (optionIdx: number) => {
    if (isAnswered || !settings) return;

    // Clear timer interval instantly
    if (timerRef.current) clearInterval(timerRef.current);

    const question = questions[currentQuestionIdx];
    const isCorrect = optionIdx === question.correctAnswerIndex;
    const timeTaken = settings.timerDuration > 0 ? (settings.timerDuration - timeLeft) : 0;

    // Points Scoring Engine
    let points = 0;
    if (isCorrect) {
      // 10 pts easy, 15 pts medium, 20 pts hard
      let basePoints = 10;
      if (question.difficulty === 'medium') basePoints = 15;
      if (question.difficulty === 'hard') basePoints = 20;

      // SPEED BONUS: +5 points if answered in under 5 seconds (only if a timer is active)
      const speedBonus = (settings.timerDuration > 0 && timeTaken <= 5) ? 5 : 0;
      points = basePoints + speedBonus;
    }

    const newAnswer: AnswerRecord = {
      questionIndex: currentQuestionIdx,
      selectedIndex: optionIdx,
      correctIndex: question.correctAnswerIndex,
      isCorrect,
      timeTaken,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setRunningScore((prev) => prev + points);
    setSelectedAnswerIdx(optionIdx);
    setIsAnswered(true);
  };

  // 7. Transition next question or conclude to results
  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswered(false);
      // Timer restarts automatically due to useEffect dependency
    } else {
      // Quiz Complete - Calculate and save High scores
      handleQuizCompletion();
    }
  };

  // 8. Quiz Completed saving logic
  const handleQuizCompletion = () => {
    if (!settings) return;

    try {
      const correctCount = answers.filter(a => a.isCorrect).length;
      const percentage = Math.round((correctCount / questions.length) * 100);

      const currentScoresStr = localStorage.getItem('quizcraft_highscores');
      const scores: Record<string, HighScore> = currentScoresStr ? JSON.parse(currentScoresStr) : {};

      const currentCatScore = scores[settings.category];
      
      // Update score only if it is higher than the previous high score
      if (!currentCatScore || runningScore > currentCatScore.score) {
        scores[settings.category] = {
          category: settings.category,
          score: runningScore,
          totalQuestions: questions.length,
          percentage: percentage,
          date: new Date().toLocaleDateString(),
        };
        localStorage.setItem('quizcraft_highscores', JSON.stringify(scores));
      }
    } catch (e) {
      console.error('Failed to update highscore metadata', e);
    }

    setViewState('results');
  };

  // Helper info calculations
  const getCategoryName = () => {
    if (!settings) return '';
    const match = CATEGORIES.find(c => c.id === settings.category);
    return match ? match.name : 'Web API Discovery';
  };

  // Return to Setup
  const handleReset = () => {
    setViewState('setup');
    setSettings(null);
    setQuestions([]);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b18] flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-350" id="quizmaster-root">
      
      {/* Header element */}
      <TriviaHeader 
        onReset={handleReset} 
        highScore={globalHighScore} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Interactive System Modals / Dialog panels */}
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        onClearRecords={() => setGlobalHighScore(0)}
      />
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      {/* Main app space layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col justify-center px-4 sm:px-6">
        
        {/* State router viewport */}
        {isLoading && (
          <div className="my-16 text-center space-y-6" id="global-loading-viewport">
            <div className="relative inline-block mb-3">
              <div className="w-14 h-14 border border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
            </div>
            <div>
              <p className="font-sans text-white text-xl font-bold leading-snug">Assembling Assessment Booklet...</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-blue-400 mt-2">Initializing payload stream & local snapshot indexing</p>
            </div>
          </div>
        )}

        {!isLoading && errorMsg && (
          <div className="m-4 sm:m-6 p-6 sm:p-8 max-w-xl mx-auto bg-[#0f1326] border border-[#1d2442] text-center space-y-6 rounded-3xl shadow-lg animate-fade-in" id="error-screen-card">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-full w-12 h-12 mx-auto flex items-center justify-center text-rose-400">
              <WifiOff className="w-5 h-5 pointer-events-none" />
            </div>
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-1">
                EXAMINATION SERVER NOTICE
              </span>
              <h3 className="font-sans font-extrabold text-white text-base">
                Pipeline Interruption Alert
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs sm:max-w-md mx-auto font-sans">
                {errorMsg}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleOfflineFallback}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-[10.5px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-xs"
                id="error-fallback-local-btn"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Play Offline Booklet
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 border border-[#1d2442] hover:border-slate-500 hover:bg-[#11162d] text-slate-300 hover:text-white font-mono font-bold text-[10.5px] uppercase tracking-widest rounded-2xl cursor-pointer transition-all"
                id="error-cancel-btn"
              >
                Back to Setup
              </button>
            </div>
          </div>
        )}

        {!isLoading && !errorMsg && (
          <>
            {viewState === 'setup' && (
              <SetupScreen onStartQuiz={handleStartQuiz} />
            )}

            {viewState === 'playing' && questions.length > 0 && (
              <QuestionCard
                question={questions[currentQuestionIdx]}
                currentNumber={currentQuestionIdx + 1}
                totalQuestions={questions.length}
                selectedAnswerIndex={selectedAnswerIdx}
                correctAnswerIndex={questions[currentQuestionIdx].correctAnswerIndex}
                isAnswered={isAnswered}
                timeLeft={timeLeft}
                timerDuration={settings?.timerDuration || 0}
                onSelectOption={handleSelectOption}
                onNext={handleNextQuestion}
                runningScore={runningScore}
                answers={answers}
              />
            )}

            {viewState === 'results' && (
              <ResultsScreen
                questions={questions}
                answers={answers}
                score={runningScore}
                onRestart={handleReset}
                categoryName={getCategoryName()}
                playerName={settings?.playerName || 'Aditya Verma'}
              />
            )}
          </>
        )}

      </main>

      {/* Aesthetic Footer */}
      <footer className="footer bg-[#05070f] border-t border-[#1d2442]/50 py-6 text-center select-none mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.14em] font-sans font-bold text-slate-500">
            QUIZMASTER INTERACTIVE TESTING CONSOLE // DEVELOPED BY SONU KUMAR
          </p>
          <div className="flex items-center gap-4 text-[9px] font-mono font-semibold text-slate-500 tracking-wider">
            <span>SECURE CRYPTO MODE</span>
            <span>OFFLINE LOCALSTORAGE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
