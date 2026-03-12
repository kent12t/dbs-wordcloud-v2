import { QUESTIONS } from "../../../shared/questions";
import { DBSLogo } from "./DBSLogo";

interface ShareCardProps {
  answers: string[];
}

export function ShareCard({ answers }: ShareCardProps) {
  return (
    <section className="border border-dbs-border/70 bg-transparent p-5 sm:p-6">
      <DBSLogo showTagline />
      <p className="mt-10 text-center text-2xl font-semibold text-dbs-red sm:text-3xl">
        DBS Global Financial Markets Event 2026
      </p>
      <h2 className="mt-2 text-center font-display text-5xl font-bold text-[#E8E8E8] sm:text-6xl">
        What's On My Mind
      </h2>

      <ul className="mt-8 grid grid-cols-2 gap-3">
        {QUESTIONS.map((question, index) => (
          <li key={question.id} className="rounded-md bg-[#1B1B1B] p-3">
            <p className="text-sm font-semibold text-dbs-red">Q{question.id}</p>
            <p className="text-2xl leading-tight text-[#F2F2F2]">
              {answers[index] ?? "No answer"}
            </p>
            <p className="mt-2 text-xs text-dbs-muted">{question.prompt}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-3xl font-semibold uppercase text-dbs-red sm:text-4xl">
        Future-Proof Your Money With DBS
      </p>
    </section>
  );
}
