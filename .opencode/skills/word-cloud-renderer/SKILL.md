---
name: word-cloud-renderer
description: Custom animated SVG/DOM word cloud renderer — sizes words by vote
  count, places them via a spiral algorithm, and animates transitions for the
  DBS live event display. No external library required.
compatibility: opencode
metadata:
  rendering: dom-spiral
  animation: css-transition
---

## What I do
- Calculate proportional font sizes from vote counts
- Place words using an Archimedean spiral to avoid overlap
- Animate word growth and new word appearance with CSS transitions
- Apply DBS brand colours (top word in red, others in white/muted)

## Font Size Calculation
```ts
const MIN_SIZE = 14;
const MAX_SIZE = 72;

function fontSize(count: number, maxCount: number): number {
  if (maxCount === 0) return MIN_SIZE;
  return MIN_SIZE + (count / maxCount) * (MAX_SIZE - MIN_SIZE);
}
```

## Spiral Placement (simplified)
```ts
function spiral(step: number): [number, number] {
  const angle = step * 0.5;
  const radius = 3 * step;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}
```

Place each word starting at centre `[cx, cy]` and stepping outward until no
overlap with already-placed words (check bounding boxes with 8px padding).

## Component Shape
```tsx
interface Word { text: string; count: number }

export function WordCloud({ words }: { words: Word[] }) {
  const maxCount = Math.max(...words.map((w) => w.count), 1);
  const sorted = [...words].sort((a, b) => b.count - a.count);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {sorted.map((word, i) => (
        <span
          key={word.text}
          className="absolute transition-all duration-700 font-bold
            select-none whitespace-nowrap"
          style={{
            fontSize: fontSize(word.count, maxCount),
            color: i === 0 ? '#E2231A' : i < 3 ? '#FFFFFF' : '#9CA3AF',
            // left/top set by spiral placement logic
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}
```

## Animation Notes
- Use a `useLayoutEffect` to measure and place words after render
- Store placed positions in a `ref` to avoid re-triggering layout
- When `words` prop changes, diff against previous — animate existing words,
  fade in new ones with `opacity-0 → opacity-100`

## When to use me
Use this skill when building or modifying `client/src/components/WordCloud.tsx`.