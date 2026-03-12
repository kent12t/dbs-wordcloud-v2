---
name: react-tailwind-component
description: Patterns for building React functional components with Tailwind
  CSS v3 — including dark-theme layouts, responsive mobile-first grids, and
  reusable DBS-branded UI primitives.
compatibility: opencode
metadata:
  stack: react-typescript-tailwind
  theme: dark
---

## What I do
- Provide consistent patterns for dark-background React components
- Guide mobile-first Tailwind grid layouts (2-col button grids, full-viewport
  pages)
- Define reusable class composition patterns for DBS brand colours
- Ensure touch-friendly sizing and accessible contrast ratios

## DBS Colour Tokens (Tailwind extend config)
```js
// tailwind.config.ts
colors: {
  dbs: {
    bg:      '#111111',
    surface: '#1F1F1F',
    border:  '#2D2D2D',
    red:     '#E2231A',
    text:    '#FFFFFF',
    muted:   '#9CA3AF',
  }
}
```

## Button Grid Pattern (5 options)
```tsx
<div className="grid grid-cols-2 gap-3">
  {options.slice(0, 4).map((opt) => (
    <button key={opt} className="rounded bg-dbs-surface border border-dbs-border
      text-dbs-text px-4 py-4 text-sm font-medium hover:bg-dbs-red
      transition-colors duration-200 active:scale-95">
      {opt}
    </button>
  ))}
  <button className="col-span-2 mx-auto w-1/2 rounded bg-dbs-surface ...">
    {options[4]}
  </button>
</div>
```

## Full-Viewport Dark Page
```tsx
<div className="min-h-screen bg-dbs-bg text-dbs-text flex flex-col px-4 py-6">
  {/* content */}
</div>
```

## Progress Bar
```tsx
<div className="fixed bottom-0 left-0 w-full h-1 bg-dbs-surface">
  <div
    className="h-full bg-dbs-red transition-all duration-300"
    style={{ width: `${(step / total) * 100}%` }}
  />
</div>
```

## When to use me
Use this skill when creating any new React component or page for this project
to ensure brand and layout consistency.