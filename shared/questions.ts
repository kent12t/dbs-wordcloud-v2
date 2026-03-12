import { QuizQuestion } from "./types.js";

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Which word best describes today's geopolitical landscape?",
    options: [
      "Multi-polar",
      "Competitive",
      "Uncertain",
      "Shifting",
      "Fragmented"
    ]
  },
  {
    id: 2,
    prompt: "Which word best captures how the global economy is repositioning?",
    options: [
      "Rebalancing",
      "Diversification",
      "Regionalisation",
      "Integration",
      "Transformation"
    ]
  },
  {
    id: 3,
    prompt: "Which word best reflects today's interest rate environment?",
    options: [
      "Elevated",
      "Stabilising",
      "Volatile",
      "Normalising",
      "Restrictive"
    ]
  },
  {
    id: 4,
    prompt: "Which region do you believe will lead the next phase of growth?",
    options: ["America", "China", "India", "ASEAN", "Global"]
  },
  {
    id: 5,
    prompt:
      "If the financial markets had a weather forecast today, what would it be?",
    options: [
      "Stormy",
      "Cloudy",
      "Partly sunny",
      "Clearing up",
      "Bright ahead"
    ]
  }
];
