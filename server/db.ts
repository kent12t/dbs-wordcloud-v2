import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { WordCloudWord } from "../shared/types.js";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "quiz.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_index INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertStmt = db.prepare(
  "INSERT INTO answers (question_index, answer) VALUES (?, ?)"
);

const insertAnswersTx = db.transaction((answers: string[]) => {
  answers.forEach((answer, index) => {
    insertStmt.run(index, answer);
  });
});

const aggregateStmt = db.prepare(
  `
  SELECT answer as text, COUNT(*) as count
  FROM answers
  GROUP BY answer
  ORDER BY count DESC, answer ASC
`
);

export function insertAnswers(answers: string[]): void {
  insertAnswersTx(answers);
}

export function getWordCloudWords(): WordCloudWord[] {
  const rows = aggregateStmt.all() as WordCloudWord[];
  return rows;
}
