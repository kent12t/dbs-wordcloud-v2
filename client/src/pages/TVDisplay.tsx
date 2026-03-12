import { useMemo } from "react";

import { BrandBackground } from "../components/BrandBackground";
import { DBSLogo } from "../components/DBSLogo";
import { WordCloud } from "../components/WordCloud";
import { useWordCloud } from "../hooks/useWordCloud";

export function TVDisplay() {
  const { words } = useWordCloud();

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
      <BrandBackground variant="tv" className="opacity-90" />

      <div className="relative mx-auto flex h-full max-w-[1920px] flex-col">
        <header className="flex items-center gap-6 pb-6">
          <DBSLogo compact className="w-[92px]" />

          <h1 className="text-[42px] font-semibold text-[#F0EDE8]">
            DBS Global Financial Markets Event 2026
          </h1>
        </header>

        <section className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_320px] gap-10 pb-6">
          <aside className="flex items-center">
            <h2 className="text-[64px] font-bold leading-[0.92] tracking-[-1.28px] text-[#CA3631]">
              How the
              <br />
              Room is
              <br />
              Feeling
            </h2>
          </aside>

          <div className="min-h-0 rounded-[22px] border border-[#CA3631]/70 bg-[#0A0A0A] p-6">
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

            <p className="mt-6 text-[36px] font-extrabold leading-none text-[#CA3631]">
              What's on YOUR mind?
            </p>

            <img
              src={qrSrc}
              alt={`QR code to join quiz at ${quizUrl}`}
              className="mt-4 h-[216px] w-[216px] bg-white p-2"
            />
          </aside>
        </section>
      </div>
    </main>
  );
}
