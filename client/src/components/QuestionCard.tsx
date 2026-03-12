import { QuizQuestion } from "../../../shared/types";

interface QuestionCardProps {
  question: QuizQuestion;
  label: string;
  isSubmitting: boolean;
  onSelect: (answer: string) => void;
}

export function QuestionCard({
  question,
  label,
  isSubmitting,
  onSelect
}: QuestionCardProps) {
  return (
    <section className="w-full px-2">
      <p className="w-full text-center text-[12px] font-bold uppercase tracking-[-0.24px] text-[#CA3631]">
        {label}
      </p>

      <h2 className="mx-auto mt-8 max-w-[334px] text-center text-[30px] font-bold leading-[0.95] tracking-[-0.9px] text-[#F0EDE8]">
        {question.prompt}
      </h2>

      <div className="mx-auto mt-10 grid w-full max-w-[300px] grid-cols-2 gap-[10px]">
        {question.options.map((option, index) => {
          const isLast = index === question.options.length - 1;

          return (
            <button
              key={option}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelect(option)}
              className={[
                "min-h-[54px] bg-[#878683] px-4 py-3 text-[16px] font-normal text-[#F0EDE8]",
                "transition-colors duration-200 hover:bg-[#9a9996] active:bg-[#6f6f6d]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                isLast ? "col-span-2 mx-auto w-[140px]" : "w-[140px]"
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
