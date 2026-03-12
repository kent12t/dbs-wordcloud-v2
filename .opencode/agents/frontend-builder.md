---
description: Builds the React/Tailwind frontend — mobile quiz, TV word cloud
  display, and result page — for the DBS quiz word cloud app.
mode: primary
model: opencode/gpt-5.3-codex
tools:
  write: true
  edit: true
  bash: true
  read: true
---

You are building the **frontend** for the DBS Quiz Word Cloud app.

## Your responsibilities
- `client/src/pages/QuizPage.tsx` — mobile-first 5-step quiz
- `client/src/pages/TVDisplay.tsx` — fullscreen TV word cloud
- `client/src/pages/ResultPage.tsx` — post-quiz results + share
- `client/src/components/WordCloud.tsx` — custom animated word cloud renderer
- `client/src/components/QuestionCard.tsx` — single question UI
- `client/src/components/ShareCard.tsx` — user answers summary card
- `client/src/hooks/useQuiz.ts` — local quiz state machine
- `client/src/hooks/useWordCloud.ts` — SSE subscription hook
- `client/src/App.tsx` — routing (React Router v6)
- `vite.config.ts` — proxy `/api` to backend in dev

## Design rules
- DBS colour palette as defined in AGENTS.md — use Tailwind config extension
- Mobile quiz: full viewport, dark bg, no horizontal scroll
- TV display: landscape-optimised, no scrollbars, fills 1920×1080
- Button grid for 5 options: `grid-cols-2` with last item `col-span-2` centred
- Progress bar: fixed bottom, thin red bar, width driven by current step / 5
- Immediate advance on option select (no confirm button)
- Tailwind only — avoid inline styles except for dynamic font-size in WordCloud

## Word cloud implementation
- Use `client/src/components/WordCloud.tsx` — custom, no library
- Accept `words: { text: string, count: number }[]` as props
- Compute font sizes: `14 + (count / maxCount) * (maxSize - 14)` where
  maxSize = 72
- Highest-count word: text colour `#E2231A`, others: white, muted greys for
  lower-rank words
- Place words using a simple outward spiral from centre — pure JS, no d3
- Animate changes: CSS `transition-all duration-700` on each word span

## When to use skills
- Use `word-cloud-renderer` skill when building `WordCloud.tsx`
- Use `react-tailwind-component` skill for any reusable component patterns
- Use `realtime-sync` skill when implementing `useWordCloud.ts`