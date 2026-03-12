import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { BrandBackground } from "../components/BrandBackground";
import { ShareCard } from "../components/ShareCard";
import { WordCloud } from "../components/WordCloud";
import { useWordCloud } from "../hooks/useWordCloud";

interface ResultState {
  answers?: string[];
}

export function ResultPage() {
  const location = useLocation();
  const state = (location.state as ResultState | null) ?? null;
  const { words, isConnected } = useWordCloud();

  const savedAnswers = useMemo(() => {
    if (state?.answers?.length) {
      return state.answers;
    }

    const fromStorage = localStorage.getItem("dbs-quiz-answers");
    if (!fromStorage) {
      return [];
    }

    try {
      const parsed = JSON.parse(fromStorage) as unknown;
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    } catch {
      return [];
    }
  }, [state?.answers]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 py-4 text-[#F0EDE8]">
      <BrandBackground />

      <div className="relative mx-auto w-full max-w-[390px] pb-12">
        <header className="flex items-start justify-between px-2 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-dbs-red text-xl text-white">
            ✶
          </div>

          <p className="max-w-[106px] text-right text-[10px] font-bold tracking-[-0.2px] text-[#878683]">
            DBS Global Financial
            <br />
            Markets Event 2026
          </p>
        </header>

        <section className="mt-4 px-2">
          <h1 className="text-[32px] font-extrabold leading-[0.92] tracking-[-0.64px] text-dbs-red">
            The Room Speaks
          </h1>

          <p className="mt-2 max-w-[250px] text-[16px] leading-snug text-[#F0EDE8]">
            Every word below is shared by someone in this room.
          </p>
        </section>

        <section className="mt-8 px-2">
          <div className="h-[358px] rounded-[8px] border border-dbs-red/70 bg-[#0A0A0A] p-4">
            <WordCloud words={words} />
          </div>
        </section>

        <section className="mt-8 space-y-5 px-2 text-[16px] leading-snug text-[#F0EDE8]">
          <p>
            These are the thoughts arising from challenges faced by every
            leader, investor, and business owner in the room.
          </p>

          <p>
            That's why, DBS has expertly designed investment solutions to turn
            volatility into opportunity, and insight into action.
          </p>

          <p className="text-[13px] font-extrabold uppercase tracking-[-0.26px] text-dbs-red">
            Future-Proof Your Money With DBS →
          </p>

          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="text-[13px] font-extrabold uppercase tracking-[-0.26px] text-dbs-red transition-colors hover:text-[#ff655f]"
            >
              Retry Experience →
            </Link>

            <span
              className={[
                "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
                isConnected
                  ? "border-emerald-500/30 text-emerald-300"
                  : "border-amber-500/30 text-amber-300"
              ].join(" ")}
            >
              {isConnected ? "Live" : "Reconnect"}
            </span>
          </div>
        </section>

        <section className="mt-8 space-y-4 px-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center bg-dbs-red px-8 py-4 text-[13px] font-semibold text-[#F0EDE8] transition-colors hover:bg-[#f2362e]"
          >
            Share My Thoughts
          </button>

          <div className="border border-dbs-border/70 p-2">
            <ShareCard answers={savedAnswers} />
          </div>
        </section>
      </div>
    </main>
  );
}
