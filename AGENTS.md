# DBS Quiz Word Cloud — Project Rules & Guidelines

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

## Development Workflow
Use the following commands for common development tasks:
- `npm install`: Install dependencies for both client and server.
- `npm run dev`: Start both Vite (frontend) and Express (backend) dev servers concurrently.
- `npm run build`: Build the frontend and backend for production.
- `npm run lint`: Run ESLint and Prettier to check for code style issues.
- `npm run test`: Run the test suite using Vitest.
- `npm run test:single -- path/to/file.test.ts`: Execute a single test file.
- `npm run type-check`: Run TypeScript compiler to check for type errors.
- `npm run db:setup`: Initialize the SQLite database schema.

## Code Style & Standards

### 1. Imports & Exports
- Use **named exports** for components and utilities for better tree-shaking and consistency.
- Group imports:
  1. React and third-party libraries.
  2. Components and hooks.
  3. Utilities and shared types.
  4. Styles/Tailwind (if applicable).
- Avoid barrel files (index.ts) for components unless they export multiple related sub-components.

### 2. TypeScript & Types
- **No `any` types**: Explicitly define all types or use `unknown` if necessary.
- **Shared types**: All cross-boundary types (API payloads, DB records) must reside in `shared/types.ts`.
- Use interfaces for object shapes and types for unions/intersections.
- Prefix interfaces with `I` (e.g., `IAnswer`) or omit prefixes consistently; preference is for no prefix.

### 3. Naming Conventions
- **PascalCase**: Components, Types, Interfaces, Enums.
- **camelCase**: Functions, variables, hooks, filenames (except components).
- **kebab-case**: Folders, non-TS files (images, JSON).
- Boolean variables should start with `is`, `has`, or `should` (e.g., `isSubmitting`).

### 4. React & Tailwind
- Use functional components with the `React.FC` type or standard function declarations.
- Keep components small and focused on a single responsibility.
- **Tailwind Only**: No external CSS files. Use `clsx` or `tailwind-merge` for dynamic classes.
- Mobile-first approach: Use `sm:`, `md:`, `lg:` prefixes for responsive design.

### 5. Error Handling
- **API**: Return `{ error: string }` on failure with appropriate status codes (400, 401, 500).
- **Frontend**: Use `try/catch` in async hooks. Display user-friendly error messages via a toast or inline warning.
- **Database**: Ensure `better-sqlite3` operations are wrapped in transactions if multiple writes occur.

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
└── AGENTS.md
```

## Routes & API Endpoints
- `/` — QuizPage (Mobile-first quiz).
- `/tv` — TVDisplay (Fullscreen word cloud for TV screens).
- `/result` — ResultPage (Displayed after quiz completion).
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
1. **Geopolitical Shifts**: "Which word best describes today’s geopolitical landscape?"
   *Multi-polar | Competitive | Uncertain | Shifting | Fragmented*
2. **Global Realignment**: "Which word best captures how the global economy is repositioning?"
   *Rebalancing | Diversification | Regionalisation | Integration | Transformation*
3. **Interest Rates**: "Which word best reflects today’s interest rate environment?"
   *Elevated | Stabilising | Volatile | Normalising | Restrictive*
4. **Regional Growth**: "Which region do you believe will lead the next phase of growth?"
   *America | China | India | ASEAN | Global*
5. **Final Future**: "If the financial markets had a weather forecast today, what would it be?"
   *Stormy | Cloudy | Partly sunny | Clearing up | Bright ahead*

## Word Cloud Logic
- Word size is proportional to vote count: `14 + (count / maxCount) * (maxSize - 14)`.
- Highest-voted word is colored in **DBS Red** (`#E2231A`).
- Implement an Archimedean spiral to position words without overlap.
- Use CSS transitions for smooth scaling and movement when new votes arrive.

## Agent-Specific Instructions
- **Skills Usage**: Always utilize the provided skills in `.opencode/skills/` for complex logic (e.g., word cloud rendering, SSE setup).
- **Mobile/TV Optimization**:
  - The `QuizPage` MUST be mobile-first and optimized for vertical touch interaction.
  - The `TVDisplay` MUST be fullscreen-optimized (1080p) with no scrolling or interactive elements besides the live word cloud.
- **Canonical Source**: Always refer to the question list in this file as the single source of truth for labels and options.
- **State Consistency**: Ensure the client-side state is updated via SSE events rather than polling for the TV display.

## Formatting Rules
- Follow Prettier defaults (print width 80).
- No `any` types; everything must be defined in `shared/types.ts`.
- All shell commands must be copy-pasteable without `$` prompts.
- Use standard Prettier/ESLint rules for code style.
