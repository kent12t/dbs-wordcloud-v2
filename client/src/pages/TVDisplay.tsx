import { useMemo } from "react";

import { BrandBackground } from "../components/BrandBackground";
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
    <main className="relative h-screen overflow-hidden bg-[#0A0A0A] px-8 py-8 text-[#F0EDE8]">
      <BrandBackground className="opacity-90" />

      <div className="relative mx-auto flex h-full max-w-[1920px] flex-col">
        <header className="flex items-center gap-6 pb-6">
          <div className="grid h-[72px] w-[72px] place-items-center rounded-[14px] bg-dbs-red text-[38px] text-white">
            ✶
          </div>

          <h1 className="text-[42px] font-semibold text-[#F0EDE8]">
            DBS Global Financial Markets Event 2026
          </h1>

          <span
            className={[
              "ml-auto rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]",
              isConnected
                ? "border-emerald-500/30 text-emerald-300"
                : "border-amber-500/30 text-amber-300"
            ].join(" ")}
          >
            {isConnected ? "Connected" : "Reconnecting"}
          </span>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_320px] gap-10">
          <aside className="flex items-center">
            <h2 className="text-[64px] font-bold leading-[0.92] tracking-[-1.28px] text-dbs-red">
              How the
              <br />
              Room is
              <br />
              Feeling
            </h2>
          </aside>

          <div className="min-h-0 rounded-[22px] border border-dbs-red/70 bg-[#0A0A0A] p-6">
            <WordCloud words={words} />
          </div>

          <aside className="flex flex-col justify-center">
            <p className="text-[24px] font-semibold leading-[1.35] text-[#F0EDE8]">
              These are the thoughts arising from challenges faced by every
              leader, investor, and business owner in the room.
            </p>

            <p className="mt-6 text-[24px] font-semibold leading-[1.35] text-[#F0EDE8]">
              That's why, DBS has expertly designed investment solutions to turn
              volatility into opportunity, and insight into action.
            </p>

            <p className="mt-6 text-[36px] font-extrabold leading-none text-dbs-red">
              What's on YOUR mind?
            </p>

            <img
              src={qrSrc}
              alt={`QR code to join quiz at ${quizUrl}`}
              className="mt-4 h-[216px] w-[216px] bg-white p-2"
            />

            <p className="mt-3 text-sm text-[#878683]">{quizUrl}</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
