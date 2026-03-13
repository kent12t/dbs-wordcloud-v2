import { createClient } from "@supabase/supabase-js";

import { WordCloudWord } from "../shared/types.js";

interface AnswerRow {
  answer: string | null;
}

const isOffline = process.env.OFFLINE === "true";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value && !isOffline) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

const supabaseUrl = getRequiredEnv("SUPABASE_URL");
const supabaseKey = getRequiredEnv("SUPABASE_KEY");

const supabase = !isOffline
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const MOCK_WORDS: WordCloudWord[] = [
  { text: "Multi-polar", count: 12 },
  { text: "Uncertain", count: 8 },
  { text: "Shifting", count: 5 },
  { text: "Diversification", count: 15 },
  { text: "Integration", count: 10 },
  { text: "Volatile", count: 7 },
  { text: "Normalising", count: 4 },
  { text: "ASEAN", count: 18 },
  { text: "India", count: 14 },
  { text: "Stormy", count: 3 },
  { text: "Bright ahead", count: 22 },
  { text: "Transformation", count: 11 },
  { text: "Regionalisation", count: 9 },
  { text: "Elevated", count: 6 },
  { text: "Stabilising", count: 4 },
  { text: "China", count: 13 },
  { text: "America", count: 5 },
  { text: "Cloudy", count: 2 },
  { text: "Partly sunny", count: 7 },
  { text: "Clearing up", count: 10 }
];

export async function insertAnswers(answers: string[]): Promise<void> {
  if (isOffline || !supabase) {
    console.log("Offline mode: Skipping database insertion", answers);
    return;
  }

  const rows = answers.map((answer, index) => ({
    question_index: index,
    answer
  }));

  const { error } = await supabase.from("answers").insert(rows);
  if (error) {
    throw new Error(`Unable to insert answers: ${error.message}`);
  }
}

export async function getWordCloudWords(): Promise<WordCloudWord[]> {
  if (isOffline || !supabase) {
    return [...MOCK_WORDS].sort((a, b) => b.count - a.count);
  }

  const { data, error } = await supabase
    .from("answers")
    .select("answer")
    .returns<AnswerRow[]>();

  if (error) {
    throw new Error(`Unable to load word cloud words: ${error.message}`);
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.answer) {
      continue;
    }

    const nextCount = (counts.get(row.answer) ?? 0) + 1;
    counts.set(row.answer, nextCount);
  }

  return [...counts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.text.localeCompare(b.text);
    });
}
