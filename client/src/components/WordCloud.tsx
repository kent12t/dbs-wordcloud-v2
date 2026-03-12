import { useMemo } from "react";

import { WordCloudWord } from "../../../shared/types";

interface WordCloudProps {
  words: WordCloudWord[];
  maxSize?: number;
}

interface PlacedWord extends WordCloudWord {
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

const MIN_SIZE = 14;
const DEFAULT_MAX_SIZE = 72;
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 560;

function estimateWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.56;
}

function overlaps(
  placed: PlacedWord,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  const padding = 10;
  const placedWidth = estimateWidth(placed.text, placed.fontSize);
  const placedHeight = placed.fontSize * 1.12;

  const aLeft = x - width / 2 - padding;
  const aRight = x + width / 2 + padding;
  const aTop = y - height / 2 - padding;
  const aBottom = y + height / 2 + padding;

  const bLeft = placed.x - placedWidth / 2 - padding;
  const bRight = placed.x + placedWidth / 2 + padding;
  const bTop = placed.y - placedHeight / 2 - padding;
  const bBottom = placed.y + placedHeight / 2 + padding;

  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

function computeFontSize(count: number, maxCount: number, maxSize: number): number {
  if (maxCount === 0) {
    return MIN_SIZE;
  }
  return MIN_SIZE + (count / maxCount) * (maxSize - MIN_SIZE);
}

function placeWords(words: WordCloudWord[], maxSize: number): PlacedWord[] {
  const maxCount = Math.max(...words.map((word) => word.count), 0);
  const centerX = VIEW_WIDTH / 2;
  const centerY = VIEW_HEIGHT / 2;

  const sorted = [...words].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
  const result: PlacedWord[] = [];

  sorted.forEach((word, index) => {
    const fontSize = computeFontSize(word.count, maxCount, maxSize);
    const width = estimateWidth(word.text, fontSize);
    const height = fontSize * 1.12;
    const color =
      index === 0 ? "#E2231A" : index < 4 ? "#FFFFFF" : index < 10 ? "#D1D5DB" : "#9CA3AF";

    let placed: PlacedWord | null = null;

    for (let step = 0; step < 2200; step += 1) {
      const angle = step * 0.47;
      const radius = 3 * Math.sqrt(step);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const withinBounds =
        x - width / 2 > 18 &&
        x + width / 2 < VIEW_WIDTH - 18 &&
        y - height / 2 > 18 &&
        y + height / 2 < VIEW_HEIGHT - 18;

      if (!withinBounds) {
        continue;
      }

      const collides = result.some((candidate) => overlaps(candidate, x, y, width, height));
      if (!collides) {
        placed = { ...word, x, y, fontSize, color };
        break;
      }
    }

    result.push(
      placed ?? {
        ...word,
        x: centerX,
        y: centerY,
        fontSize,
        color
      }
    );
  });

  return result;
}

export function WordCloud({ words, maxSize = DEFAULT_MAX_SIZE }: WordCloudProps) {
  const placedWords = useMemo(() => placeWords(words, maxSize), [words, maxSize]);

  if (words.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center border border-dbs-border/60 bg-black/40">
        <p className="font-display text-xl text-dbs-muted">
          Waiting for responses to shape the live cloud...
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden border border-dbs-border/60 bg-black/50">
      <div className="relative h-full w-full">
        {placedWords.map((word) => (
          <span
            key={word.text}
            className="absolute whitespace-nowrap font-display font-bold transition-all duration-700 ease-out"
            style={{
              left: `${(word.x / VIEW_WIDTH) * 100}%`,
              top: `${(word.y / VIEW_HEIGHT) * 100}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${word.fontSize}px`,
              color: word.color,
              opacity: 0.96
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}
