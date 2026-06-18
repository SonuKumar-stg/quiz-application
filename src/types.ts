export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface QuizSettings {
  category: string; // 'all', specific category ID, or 'api'
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  questionCount: number;
  timerDuration: number; // in seconds, 0 means no timer
  source: 'local' | 'api';
  playerName?: string;
}

export interface AnswerRecord {
  questionIndex: number;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface HighScore {
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}
