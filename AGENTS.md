# DBS Quiz Word Cloud — Project Rules

## Project Overview
An interactive event experience for the DBS Global Financial Markets Event 2026.
- **Quiz app**: Mobile-first, phone-facing experience with 5 questions.
- **Word cloud display**: TV-facing, live-updating visualization that aggregates 
  all attendee answers into a proportional, animated word cloud.

## Tech Stack
- **Framework**: React (Vite) with TypeScript.
- **Styling**: Tailwind CSS v3 (no raw CSS unless for custom animations).
- **Realtime**: Server-Sent Events (SSE) for the TV display; REST for submissions.
- **Backend**: Node.js + Express (lightweight).
- **Database**: SQLite via `better-sqlite3` (simple, zero-config persistence).
- **Word Cloud**: Custom SVG/DOM renderer using a spiral layout algorithm.

## Project Structure
```text
dbs-quiz-wordcloud/
├── server/
│   ├── index.ts          # Express server + SSE logic
│   ├── db.ts             # SQLite schema and queries
│   └── questions.ts      # Canonical question list
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── QuizPage.tsx       # Mobile quiz flow
│   │   │   ├── ResultPage.tsx     # Summary + shared word cloud
│   │   │   └── TVDisplay.tsx      # Fullscreen TV view
│   │   ├── components/
│   │   │   ├── WordCloud.tsx      # Animated word cloud component
│   │   │   ├── QuestionCard.tsx   # Quiz UI primitive
│   │   │   └── ShareCard.tsx      # Personal results summary
│   │   ├── hooks/
│   │   │   ├── useQuiz.ts         # Quiz state machine
│   │   │   └── useWordCloud.ts    # SSE stream management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── shared/
│   └── types.ts           # Shared TypeScript interfaces
├── AGENTS.md
└── opencode.json
```

## Routes
- `/` — QuizPage (Mobile-first quiz).
- `/tv` — TVDisplay (Fullscreen word cloud for TV screens).
- `/result` — ResultPage (Displayed after quiz completion).

## API Endpoints
- `POST /api/answers`: Submit user responses (validates 5 answers).
- `GET /api/wordcloud`: Fetch current snapshot of word frequencies.
- `GET /api/stream`: SSE stream that pushes updates whenever a quiz is finished.

## DBS Brand Guidelines
- **Background**: `#111111` (Near-black).
- **Primary Red**: `#E2231A`.
- **Text**: `#FFFFFF` (Main) / `#9CA3AF` (Muted).
- **Cards/Surface**: `#1F1F1F`.
- **Border**: `#2D2D2D`.

## Questions (Source of Truth)
1. **Geopolitical Shifts**  
   "Which word best describes today’s geopolitical landscape?"  
   *Multi-polar | Competitive | Uncertain | Shifting | Fragmented*

2. **Global Realignment**  
   "Which word best captures how the global economy is repositioning?"  
   *Rebalancing | Diversification | Regionalisation | Integration | Transformation*

3. **Interest Rates**  
   "Which word best reflects today’s interest rate environment?"  
   *Elevated | Stabilising | Volatile | Normalising | Restrictive*

4. **Regional Growth**  
   "Which region do you believe will lead the next phase of growth?"  
   *America | China | India | ASEAN | Global*

5. **Final Future**  
   "If the financial markets had a weather forecast today, what would it be?"  
   *Stormy | Cloudy | Partly sunny | Clearing up | Bright ahead*

## Word Cloud Logic
- Word size is proportional to vote count.
- Highest-voted word is colored in **DBS Red** (`#E2231A`).
- Implement an Archimedean spiral to position words without overlap.
- Use CSS transitions for smooth scaling and movement when new votes arrive.

## Formatting Rules
- Follow Prettier defaults (print width 80).
- No `any` types; everything must be defined in `shared/types.ts`.
- All shell commands must be copy-pasteable without `$` prompts.