import path from "node:path";

import cors from "cors";
import express from "express";

import { QUESTIONS } from "./questions.js";
import { getWordCloudWords, insertAnswers } from "./db.js";
import { AnswerSubmission, WordCloudResponse } from "../shared/types.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const sseClients = new Set<express.Response>();

app.use(
  cors({
    origin: true
  })
);
app.use(express.json());

function buildWordCloudResponse(): WordCloudResponse {
  return { words: getWordCloudWords() };
}

function broadcastWordCloud(): void {
  const payload = buildWordCloudResponse();
  const body = `event: wordcloud\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    client.write(body);
  }
}

app.get("/api/wordcloud", (_req, res) => {
  res.json(buildWordCloudResponse());
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.add(res);
  res.write(
    `event: wordcloud\ndata: ${JSON.stringify(buildWordCloudResponse())}\n\n`
  );

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.post("/api/answers", (req, res) => {
  const body = req.body as AnswerSubmission;
  const answers = body?.answers;

  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    res.status(400).json({ error: "Submission must contain exactly 5 answers." });
    return;
  }

  const hasInvalidAnswer = answers.some((answer, index) => {
    if (typeof answer !== "string") {
      return true;
    }

    return !QUESTIONS[index].options.includes(answer);
  });

  if (hasInvalidAnswer) {
    res.status(400).json({ error: "One or more answers are invalid." });
    return;
  }

  try {
    insertAnswers(answers);
    broadcastWordCloud();
    res.status(201).json({ ok: true });
  } catch {
    res.status(500).json({ error: "Unable to save answers." });
  }
});

const clientDistPath = path.resolve(process.cwd(), "client", "dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
    return;
  }
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(port);
