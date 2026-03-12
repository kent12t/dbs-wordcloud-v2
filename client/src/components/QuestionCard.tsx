import { QuizQuestion } from "../../../shared/types";

interface QuestionCardProps {
  question: QuizQuestion;
  step: number;
  total: number;
  label: string;
  isSubmitting: boolean;
  onSelect: (answer: string) => void;
}

export function QuestionCard({
  question,
  step,
  total,
  label,
  isSubmitting,
  onSelect
}: QuestionCardProps) {
  return (
    <section className="w-full px-1">
      <p className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-dbs-red">
        {label}
      </p>
      <h2 className="mt-8 text-center font-display text-5xl font-bold leading-[0.98] text-[#E8E8E8] sm:text-6xl">
        {question.prompt}
      </h2>

      <div className="mx-auto mt-10 grid max-w-[350px] grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isLast = index === question.options.length - 1;
          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelect(option)}
              className={[
                "min-h-11 border border-[#8C8C8C] bg-[#8E8E8E] px-4 py-4 text-2xl font-medium text-[#F2F2F2]",
                "transition-all duration-200 hover:border-[#B1B1B1] hover:bg-[#9B9B9B] active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                isLast ? "col-span-2 mx-auto w-1/2" : ""
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-dbs-muted">
        Select one option to continue ({step} of {total})
      </p>
    </section>
  );
}
