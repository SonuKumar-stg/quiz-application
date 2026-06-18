import { Question } from './types';

// Map our category IDs to Open Trivia Database category numeric IDs
const API_CATEGORY_MAPPING: Record<string, number> = {
  all: 0,       // 0 means any category
  tech: 18,     // Computers
  science: 17,  // Science & Nature
  history: 23,  // History (Alternative: 22 for Geography)
  sports: 21,   // Sports
};

// Helper for HTML decoding because Open Trivia DB sends responses with HTML entities
function decodeHtmlEntities(str: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// Shuffles an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchApiQuestions(
  category: string,
  difficulty: 'all' | 'easy' | 'medium' | 'hard',
  amount: number
): Promise<Question[]> {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

    const apiCatId = API_CATEGORY_MAPPING[category];
    if (apiCatId && apiCatId > 0) {
      url += `&category=${apiCatId}`;
    }

    if (difficulty !== 'all') {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions (Status: ${response.status})`);
    }

    const data = await response.json();
    
    if (data.response_code === 1) {
      throw new Error('Not enough questions available with current settings. Try decreasing amount or changing category.');
    } else if (data.response_code !== 0) {
      throw new Error(`API returned error code ${data.response_code}`);
    }

    const rawResults = data.results || [];
    
    return rawResults.map((item: any, index: number) => {
      // Decode questions and answers
      const decodedQuestion = decodeHtmlEntities(item.question);
      const decodedCorrect = decodeHtmlEntities(item.correct_answer);
      const decodedIncorrect = item.incorrect_answers.map((ans: string) => decodeHtmlEntities(ans));

      // Combine and shuffle options
      const options = shuffleArray([decodedCorrect, ...decodedIncorrect]);
      const correctAnswerIndex = options.indexOf(decodedCorrect);

      return {
        id: `api_${index}_${Date.now()}`,
        question: decodedQuestion,
        options,
        correctAnswerIndex,
        category: category !== 'all' ? category : item.category,
        difficulty: item.difficulty as 'easy' | 'medium' | 'hard',
        explanation: `This is a live API question from the "${item.category}" category.`,
      };
    });
  } catch (error: any) {
    console.error('Quiz API fetch error:', error);
    throw error;
  }
}
