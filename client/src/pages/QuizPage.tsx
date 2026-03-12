import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { QUESTIONS } from "../../../shared/questions";
import { BrandBackground } from "../components/BrandBackground";
import { DBSLogo } from "../components/DBSLogo";
import { QuestionCard } from "../components/QuestionCard";
import { useQuiz } from "../hooks/useQuiz";

const QUESTION_LABELS = [
  "Global Outlook",
  "Global Realignment",
  "Interest Rates",
  "Regional Growth",
  "Final Future"
];

export function QuizPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const navigate = useNavigate();
  const { currentIndex, isSubmitting, error, selectAnswer } = useQuiz();

  const question = QUESTIONS[currentIndex];

  const handleSelect = async (answer: string) => {
    const result = await selectAnswer(answer);
    if (result.isComplete) {
      navigate("/result", { state: { answers: result.answers } });
    }
  };

  if (!hasStarted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F0EDE8]">
        <BrandBackground />
        <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-center px-8 pb-10 pt-[68px]">
          <div className="w-full">
            <DBSLogo showTagline className="w-[182px]" />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[372px] h-[304px] w-[304px] -translate-x-1/2 rounded-full border border-[#CA3631]/20" />
          <div className="pointer-events-none absolute left-1/2 top-[398px] h-[252px] w-[252px] -translate-x-1/2 rounded-full border border-[#CA3631]/20" />

          <section className="relative mt-[85px] text-center">
            <p className="text-[12px] font-bold uppercase tracking-[-0.24px] text-[#CA3631]">
              DBS Global Financial Markets Event 2026
            </p>

            <h1 className="mt-8 text-[48px] font-extrabold uppercase leading-none tracking-[-0.96px] text-[#F0EDE8]">
              Got a
              <br />
              Burning
              <br />
              Thought?
            </h1>

            <p className="mx-auto mt-8 max-w-[328px] text-[13px] font-semibold leading-[1.35] text-[#878683]">
              In a world of uncertainty, your views matter. Share them and see
              how they compare with your peers. Most of all, discover how DBS
              is ready to navigate today's economic climate.
            </p>
          </section>

          <button
            type="button"
            onClick={() => setHasStarted(true)}
            className="mb-10 mt-auto inline-flex min-h-11 items-center justify-center bg-[#CA3631] px-8 py-4 text-[13px] font-semibold tracking-[0.02em] text-[#F0EDE8] transition-colors hover:bg-[#d3423d]"
          >
            BEGIN EXPERIENCE →
          </button>
        </div>
      </main>
    );
  }

  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-[#F0EDE8]">
      <BrandBackground className="opacity-90" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-6 pb-20 pt-4">
        <header className="flex items-start justify-between py-3">
          <DBSLogo compact className="w-10" />

          <p className="max-w-[106px] text-right text-[10px] font-bold tracking-[-0.2px] text-[#878683]">
            DBS Global Financial
            <br />
            Markets Event 2026
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full pb-16">
            {question ? (
              <QuestionCard
                question={question}
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

      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-[390px] items-center gap-4">
          <span className="text-[10px] font-bold text-[#F0EDE8]">
            Question {currentIndex + 1} of {QUESTIONS.length}
          </span>

          <div className="relative h-[3px] w-full bg-[#878683]">
            <div
              className="h-[3px] bg-[#CA3631] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isSubmitting ? <span className="sr-only">Submitting</span> : null}
        </div>
      </div>
    </main>
  );
}
