import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { WordCloudWord } from "../../../shared/types";

interface WordCloudProps {
  words: WordCloudWord[];
  /** Override the font-size cap for the highest-count word (default: 0.22 * containerHeight). */
  maxSizeRatio?: number;
}

interface PlacedWord extends WordCloudWord {
  x: number; // centre-x in pixels
  y: number; // centre-y in pixels
  fontSize: number; // px, already scaled to container
  color: string;
  measuredWidth: number;
  measuredHeight: number;
}

const COLORS = [
  "#E2231A", // DBS red — top word
  "#FFFFFF",
  "#F0EDE8",
  "#D1D5DB",
  "#9CA3AF",
  "#6B7280",
];

function wordColor(index: number): string {
  return COLORS[Math.min(index, COLORS.length - 1)];
}

/** Measure text width precisely using an offscreen canvas. */
function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  fontFamily: string
): { width: number; height: number } {
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  const m = ctx.measureText(text);
  const width =
    m.actualBoundingBoxLeft !== undefined
      ? m.actualBoundingBoxLeft + m.actualBoundingBoxRight
      : m.width;
  const height =
    m.actualBoundingBoxAscent !== undefined
      ? m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
      : fontSize;
  return { width, height };
}

/** AABB overlap check with a small padding. */
function overlaps(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  pad = 6
): boolean {
  return (
    ax - aw / 2 - pad < bx + bw / 2 + pad &&
    ax + aw / 2 + pad > bx - bw / 2 - pad &&
    ay - ah / 2 - pad < by + bh / 2 + pad &&
    ay + ah / 2 + pad > by - bh / 2 - pad
  );
}

function runLayout(
  words: WordCloudWord[],
  containerW: number,
  containerH: number,
  ctx: CanvasRenderingContext2D,
  fontFamily: string,
  maxSizeRatio: number
): PlacedWord[] {
  if (!words.length || containerW < 10 || containerH < 10) return [];

  const sorted = [...words].sort(
    (a, b) => b.count - a.count || a.text.localeCompare(b.text)
  );
  const maxCount = sorted[0].count || 1;

  // The largest font is capped so it can never exceed the shorter container edge.
  const maxFontCap = Math.min(containerW * 0.85, containerH * maxSizeRatio);
  const minFont = Math.max(10, Math.min(14, containerH * 0.04));

  // Compute raw font sizes proportional to count.
  const rawSizes = sorted.map((w) =>
    minFont + (w.count / maxCount) * (maxFontCap - minFont)
  );

  // Measure every word at its raw size and shrink the largest if it overflows.
  const measured = rawSizes.map((fs, i) => {
    const m = measureText(ctx, sorted[i].text, fs, fontFamily);
    return { ...m, fontSize: fs };
  });

  // If the biggest word wider than the container, scale everything down uniformly.
  const maxMeasuredW = Math.max(...measured.map((m) => m.width));
  const maxMeasuredH = Math.max(...measured.map((m) => m.height));
  let scale = 1;
  if (maxMeasuredW > containerW - 12) scale = Math.min(scale, (containerW - 12) / maxMeasuredW);
  if (maxMeasuredH > containerH - 12) scale = Math.min(scale, (containerH - 12) / maxMeasuredH);

  // Apply scale and re-measure (font change affects metrics).
  const scaledWords = sorted.map((word, i) => {
    const fs = measured[i].fontSize * scale;
    const m = measureText(ctx, word.text, fs, fontFamily);
    return { word, fontSize: fs, width: m.width, height: m.height };
  });

  const placed: PlacedWord[] = [];
  const centerX = containerW / 2;
  const centerY = containerH / 2;

  for (let i = 0; i < scaledWords.length; i++) {
    const { word, fontSize, width, height } = scaledWords[i];
    const color = wordColor(i);

    let bestX = centerX;
    let bestY = centerY;
    let foundSpot = false;

    // Archimedean spiral.
    // We use a slightly more granular search to find tight spots.
    for (let step = 0; step < 15000; step++) {
      const angle = step * 0.05; // radians
      const r = 0.1 * step; // Slow expansion to search thoroughly
      const cx = centerX + r * Math.cos(angle);
      const cy = centerY + r * Math.sin(angle);

      // Bounds check — keep word fully inside the container with a small margin.
      if (
        cx - width / 2 < 4 ||
        cx + width / 2 > containerW - 4 ||
        cy - height / 2 < 4 ||
        cy + height / 2 > containerH - 4
      ) {
        // Stop if we've definitely spiraled out of the container bounds.
        if (r > Math.max(containerW, containerH)) break;
        continue;
      }

      // Collision check against already-placed words.
      const collision = placed.some((p) =>
        overlaps(cx, cy, width, height, p.x, p.y, p.measuredWidth, p.measuredHeight, 4)
      );

      if (!collision) {
        bestX = cx;
        bestY = cy;
        foundSpot = true;
        break;
      }
    }

    placed.push({
      ...word,
      x: bestX,
      y: bestY,
      fontSize,
      color,
      measuredWidth: width,
      measuredHeight: height,
      _hidden: !foundSpot,
    } as PlacedWord & { _hidden?: boolean });
  }

  return placed;
}

export function WordCloud({ words, maxSizeRatio = 0.38 }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [placed, setPlaced] = useState<(PlacedWord & { _hidden?: boolean })[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Detect actual container dimensions via ResizeObserver.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Re-run the layout whenever words or container size change.
  useEffect(() => {
    if (size.w < 10 || size.h < 10 || !words.length) {
      setPlaced([]);
      return;
    }

    // Create or reuse the offscreen canvas for text measurement.
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Use the same font stack that's applied in the DOM.
    const fontFamily =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-sans")
        .trim() || "Inter, ui-sans-serif, system-ui, sans-serif";

    const result = runLayout(words, size.w, size.h, ctx, fontFamily, maxSizeRatio);
    console.log("WordCloud Layout Result:", JSON.stringify({
      wordCount: words.length,
      containerSize: size,
      placedCount: result.length,
      visibleCount: result.filter((w: any) => !w._hidden).length,
      firstFiveWords: result.slice(0, 5).map((w: any) => ({
        text: w.text,
        x: Math.round(w.x),
        y: Math.round(w.y),
        fs: Math.round(w.fontSize),
        hidden: !!w._hidden
      }))
    }, null, 2));
    setPlaced(result);
  }, [words, size, maxSizeRatio]);

  if (words.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-center text-[16px] text-dbs-muted">
          Waiting for responses to shape the live cloud…
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {placed.map((word) => {
        const hidden = (word as PlacedWord & { _hidden?: boolean })._hidden;
        if (hidden) return null;
        return (
          <span
            key={word.text}
            className="absolute select-none whitespace-nowrap font-black transition-all duration-700 ease-out"
            style={{
              left: word.x,
              top: word.y,
              transform: "translate(-50%, -50%)",
              fontSize: word.fontSize,
              lineHeight: 1,
              color: word.color,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
