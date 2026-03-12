import { createClient } from "@supabase/supabase-js";

import { WordCloudWord } from "../shared/types.js";

interface AnswerRow {
  answer: string | null;
}

function getRequiredEnv(name: "SUPABASE_URL" | "SUPABASE_KEY"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = getRequiredEnv("SUPABASE_URL");
const supabaseKey = getRequiredEnv("SUPABASE_KEY");

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function insertAnswers(answers: string[]): Promise<void> {
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
