import { useMemo, useState } from "react";

import { QUESTIONS } from "../../../shared/questions";
import { AnswerSubmission } from "../../../shared/types";

interface SelectAnswerResult {
  isComplete: boolean;
  answers: string[];
}

interface UseQuizResult {
  answers: string[];
  currentIndex: number;
  isSubmitting: boolean;
  error: string;
  progressPercent: number;
  selectAnswer: (answer: string) => Promise<SelectAnswerResult>;
}

export function useQuiz(): UseQuizResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const progressPercent = useMemo(() => {
    return ((currentIndex + 1) / QUESTIONS.length) * 100;
  }, [currentIndex]);

  const selectAnswer = async (answer: string): Promise<SelectAnswerResult> => {
    if (isSubmitting) {
      return { isComplete: false, answers };
    }

    setError("");
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    const isLastQuestion = nextAnswers.length === QUESTIONS.length;
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      return { isComplete: false, answers: nextAnswers };
    }

    setIsSubmitting(true);
    try {
      const payload: AnswerSubmission = { answers: nextAnswers };
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Submission failed.");
      }

      localStorage.setItem("dbs-quiz-answers", JSON.stringify(nextAnswers));

      return { isComplete: true, answers: nextAnswers };
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit your answers."
      );
      setAnswers(answers);
      return { isComplete: false, answers };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    currentIndex,
    isSubmitting,
    error,
    progressPercent,
    selectAnswer
  };
}
