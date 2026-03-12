import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { BrandBackground } from "../components/BrandBackground";
import { DBSLogo } from "../components/DBSLogo";
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
    <main className="relative min-h-screen overflow-hidden bg-dbs-bg px-4 py-6 text-dbs-text sm:px-6">
      <BrandBackground />
      <div className="relative mx-auto w-full max-w-md pb-12 sm:max-w-xl lg:max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <DBSLogo compact />
          <p className="max-w-[170px] text-right text-sm font-semibold text-dbs-muted">
            DBS Global Financial
            <br />
            Markets Event 2026
          </p>
        </header>

        <h1 className="font-display text-6xl font-bold leading-[0.92] text-dbs-red sm:text-7xl">
          The Room Speaks
        </h1>
        <p className="mt-2 max-w-[520px] text-4xl leading-snug text-[#F0F0F0] sm:text-5xl">
          Every word below is shared by someone in this room.
        </p>

        <section className="mt-6 h-[360px] border border-dbs-red/70 bg-black/40 p-4 sm:h-[420px]">
          <WordCloud words={words} />
        </section>

        <section className="mt-8 space-y-5 text-[38px] leading-snug text-[#ECECEC]">
          <p>
            These are the thoughts arising from challenges faced by every
            leader, investor, and business owner in the room.
          </p>
          <p>
            That's why, DBS has expertly designed investment solutions to turn
            volatility into opportunity, and insight into action.
          </p>
          <p className="font-semibold uppercase tracking-[0.02em] text-dbs-red">
            Future-Proof Your Money With DBS →
          </p>
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="font-semibold uppercase text-dbs-red transition-colors hover:text-[#ff655f]"
            >
              Retry Experience →
            </Link>
            <span
              className={[
                "rounded-full border px-3 py-1 text-sm uppercase tracking-[0.12em]",
                isConnected
                  ? "border-emerald-500/30 text-emerald-300"
                  : "border-amber-500/30 text-amber-300"
              ].join(" ")}
            >
              {isConnected ? "Live" : "Reconnect"}
            </span>
          </div>
        </section>

        <button
          type="button"
          className="mt-8 inline-flex min-h-11 w-[250px] items-center justify-center bg-dbs-red px-6 text-2xl font-semibold text-white transition-colors hover:bg-[#f2362e]"
        >
          Share My Thoughts
        </button>

        <div className="mt-6 border border-dbs-border/70 p-2">
          <ShareCard answers={savedAnswers} />
        </div>
      </div>
    </main>
  );
}
