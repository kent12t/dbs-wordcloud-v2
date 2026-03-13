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

async function buildWordCloudResponse(): Promise<WordCloudResponse> {
  return {
    words: await getWordCloudWords(),
    offline: process.env.OFFLINE === "true"
  };
}

function formatWordCloudEvent(payload: WordCloudResponse): string {
  return `event: wordcloud\ndata: ${JSON.stringify(payload)}\n\n`;
}

async function broadcastWordCloud(): Promise<void> {
  const payload = await buildWordCloudResponse();
  const body = formatWordCloudEvent(payload);
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

app.get("/api/wordcloud", async (_req, res) => {
  try {
    res.json(await buildWordCloudResponse());
  } catch {
    res.status(500).json({ error: "Unable to load word cloud." });
  }
});

app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  sseClients.add(res);
  res.write("retry: 5000\n\n");

  void buildWordCloudResponse()
    .then((payload) => {
      res.write(formatWordCloudEvent(payload));
    })
    .catch(() => {
      res.write(formatWordCloudEvent({ words: [] }));
    });

  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.post("/api/answers", async (req, res) => {
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
    await insertAnswers(answers);
    res.status(201).json({ ok: true });

    void broadcastWordCloud().catch(() => {
      // Broadcast failures should not impact successful submissions.
    });
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
