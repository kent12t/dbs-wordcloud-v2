import { QUESTIONS } from "../../../shared/questions";
import { DBSLogo } from "./DBSLogo";

interface ShareCardProps {
  answers: string[];
}

const SHARE_LABELS = [
  "Global Outlook",
  "Global Realignment",
  "Interest Rates",
  "Regional Growth",
  "Final Future"
];

export function ShareCard({ answers }: ShareCardProps) {
  return (
    <section className="border border-[#878683]/60 bg-[#0A0A0A] p-4">
      <DBSLogo showTagline />

      <p className="mt-8 text-center text-[12px] font-bold tracking-[-0.24px] text-dbs-red">
        DBS Global Financial Markets Event 2026
      </p>

      <h2 className="mt-2 text-center text-[28px] font-extrabold leading-none tracking-[-0.56px] text-[#F0EDE8]">
        What's On My Mind
      </h2>

      <ul className="mt-6 grid grid-cols-2 gap-2">
        {QUESTIONS.map((question, index) => (
          <li
            key={question.id}
            className="rounded-[4px] border-l-2 border-[#878683] bg-white/5 px-2 py-1"
          >
            <p className="text-[10px] font-bold tracking-[-0.2px] text-dbs-red">
              {SHARE_LABELS[index]}
            </p>

            <p className="text-[16px] leading-tight text-[#F0EDE8]">
              {answers[index] ?? "No answer"}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-[13px] font-extrabold uppercase tracking-[-0.26px] text-dbs-red">
        Future-Proof Your Money With DBS
      </p>
    </section>
  );
}
