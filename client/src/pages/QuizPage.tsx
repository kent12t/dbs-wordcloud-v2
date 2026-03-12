import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { QUESTIONS } from "../../../shared/questions";
import { BrandBackground } from "../components/BrandBackground";
import { DBSLogo } from "../components/DBSLogo";
import { QuestionCard } from "../components/QuestionCard";
import { useQuiz } from "../hooks/useQuiz";

const QUESTION_LABELS = [
  "Geopolitical Shifts",
  "Global Realignment",
  "Interest Rates",
  "Regional Growth",
  "Final Future"
];

export function QuizPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const navigate = useNavigate();
  const { currentIndex, isSubmitting, error, progressPercent, selectAnswer } =
    useQuiz();

  const question = QUESTIONS[currentIndex];

  const handleSelect = async (answer: string) => {
    const result = await selectAnswer(answer);
    if (result.isComplete) {
      navigate("/result", { state: { answers: result.answers } });
    }
  };

  if (!hasStarted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-dbs-bg px-4 pb-10 pt-10 text-dbs-text sm:px-6">
        <BrandBackground />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-between">
          <div className="w-full">
            <DBSLogo showTagline />
          </div>

          <section className="-mt-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-dbs-red">
              DBS Global Financial Markets Event 2026
            </p>
            <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.9] text-[#E8E8E8]">
              Got a
              <br />
              Burning
              <br />
              Thought?
            </h1>
            <p className="mx-auto mt-6 max-w-[340px] text-2xl leading-relaxed text-dbs-muted">
              In a world of uncertainty, your views matter. Share them and see
              how they compare with your peers.
            </p>
          </section>

          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="mb-8 inline-flex min-h-11 w-[240px] items-center justify-center bg-dbs-red px-6 text-lg font-semibold tracking-[0.04em] text-white transition-colors hover:bg-[#f2362e]"
          >
            BEGIN EXPERIENCE →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-dbs-bg px-4 pb-12 pt-6 text-dbs-text sm:px-6">
      <BrandBackground className="opacity-90" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col gap-10 pt-2">
        <header className="flex items-start justify-between">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-dbs-red text-4xl text-white">
            ✦
          </div>
          <p className="max-w-[170px] text-right text-sm font-semibold text-dbs-muted">
            DBS Global Financial
            <br />
            Markets Event 2026
          </p>
        </header>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            {question ? (
              <QuestionCard
                question={question}
                step={currentIndex + 1}
                total={QUESTIONS.length}
                label={QUESTION_LABELS[currentIndex]}
                isSubmitting={isSubmitting}
                onSelect={handleSelect}
              />
            ) : null}
          </div>
        </div>

        {error ? (
          <p className="rounded border border-dbs-red/50 bg-dbs-red/10 px-4 py-3 text-sm text-white">
            {error}
          </p>
        ) : null}
      </div>

      <div className="fixed bottom-5 left-0 w-full px-6 sm:px-10">
        <div className="mx-auto flex max-w-2xl items-center gap-4 text-xs font-semibold text-[#F0F0F0]">
          <span>
            Question {currentIndex + 1} of {QUESTIONS.length}
          </span>
          <div className="h-1 w-full bg-[#6A6A6A]">
            <div
              className="h-full bg-dbs-red transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

    </main>
  );
}
