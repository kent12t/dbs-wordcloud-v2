import { useMemo } from "react";

import { BrandBackground } from "../components/BrandBackground";
import { DBSLogo } from "../components/DBSLogo";
import { WordCloud } from "../components/WordCloud";
import { useWordCloud } from "../hooks/useWordCloud";

export function TVDisplay() {
  const { words, isConnected } = useWordCloud();

  const quizUrl = useMemo(() => {
    const base = window.location.origin;
    return `${base}/`;
  }, []);

  const qrSrc = useMemo(() => {
    const encoded = encodeURIComponent(quizUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encoded}`;
  }, [quizUrl]);

  return (
    <main className="relative h-screen overflow-hidden bg-dbs-bg px-8 py-6 text-dbs-text">
      <BrandBackground />
      <div className="relative mx-auto flex h-full max-w-[1820px] flex-col gap-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <DBSLogo compact />
            <h1 className="font-display text-6xl text-[#E8E8E8]">
              DBS Global Financial Markets Event 2026
            </h1>
          </div>
          <span
            className={[
              "rounded-full border px-4 py-2 text-sm uppercase tracking-[0.15em]",
              isConnected ? "border-emerald-500/30 text-emerald-300" : "border-amber-500/30 text-amber-300"
            ].join(" ")}
          >
            {isConnected ? "Connected" : "Reconnecting"}
          </span>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-[260px_1fr_330px] gap-8">
          <aside className="flex items-center">
            <h2 className="font-display text-8xl font-bold leading-[0.92] text-dbs-red">
              How the
              <br />
              Room is
              <br />
              Feeling
            </h2>
          </aside>

          <div className="min-h-0 border border-dbs-red/70 bg-black/30 p-6">
            <WordCloud words={words} />
          </div>

          <aside className="flex flex-col justify-center text-left">
            <p className="text-5xl leading-snug text-[#ECECEC]">
              These are the thoughts arising from challenges faced by every
              leader, investor, and business owner in the room.
            </p>
            <p className="mt-7 text-5xl leading-snug text-[#ECECEC]">
              That's why, DBS has expertly designed investment solutions to turn
              volatility into opportunity, and insight into action.
            </p>
            <p className="mt-8 text-5xl font-semibold text-dbs-red">
              What's on YOUR mind?
            </p>
            <img
              src={qrSrc}
              alt={`QR code to join quiz at ${quizUrl}`}
              className="mt-4 h-[230px] w-[230px] bg-white p-2"
            />
            <p className="mt-4 text-xl text-dbs-muted">{quizUrl}</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
