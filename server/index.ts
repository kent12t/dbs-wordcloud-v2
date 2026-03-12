import path from "node:path";
import fs from "node:fs";

import cors from "cors";
import express from "express";

import { QUESTIONS } from "./questions.js";
import { getWordCloudWords, insertAnswers } from "./db.js";
import { AnswerSubmission, WordCloudResponse } from "../shared/types.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const sseClients = new Set<express.Response>();

const allowedOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true
  })
);
app.use(express.json());

function isAnswerSubmission(payload: unknown): payload is AnswerSubmission {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const submission = payload as { answers?: unknown };
  return Array.isArray(submission.answers);
}

function buildWordCloudResponse(): WordCloudResponse {
  return { words: getWordCloudWords() };
}

function broadcastWordCloud(): void {
  const payload = buildWordCloudResponse();
  const body = `event: wordcloud\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(body);
    } catch {
      sseClients.delete(client);
    }
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/wordcloud", (_req, res) => {
  res.json(buildWordCloudResponse());
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  sseClients.add(res);
  res.write("retry: 5000\n\n");
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
  if (!isAnswerSubmission(req.body)) {
    res.status(400).json({ error: "Invalid request payload." });
    return;
  }

  const body = req.body;
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
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(port);
