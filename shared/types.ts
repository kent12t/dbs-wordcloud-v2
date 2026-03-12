export interface QuizQuestion {
  id: number;
  prompt: string;
  options: string[];
}

export interface AnswerSubmission {
  answers: string[];
}

export interface WordCloudWord {
  text: string;
  count: number;
}

export interface WordCloudResponse {
  words: WordCloudWord[];
}
