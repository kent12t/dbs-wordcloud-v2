---
name: realtime-sync
description: Implements Server-Sent Events (SSE) for the live word cloud —
  server-side broadcast on answer submission and client-side hook with
  auto-reconnect.
compatibility: opencode
metadata:
  transport: sse
  stack: node-express-react
---

## What I do
- Implement `GET /api/stream` SSE endpoint on the Express server
- Manage connected client registry and broadcast helper
- Implement `useWordCloud` React hook that subscribes to the SSE stream
- Handle auto-reconnect with exponential backoff on the client

## Server Pattern
```ts
// server/index.ts
const clients = new Set<Response>();

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

function broadcast(data: WordCloudEntry[]) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res) => res.write(payload));
}
```

## Client Hook Pattern
```ts
// hooks/useWordCloud.ts
export function useWordCloud() {
  const [words, setWords] = useState<WordCloudEntry[]>([]);

  useEffect(() => {
    let es: EventSource;
    let retryTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      es = new EventSource('/api/stream');
      es.addEventListener('wordcloud', (e) => {
        setWords(JSON.parse(e.data));
      });
      es.onerror = () => {
        es.close();
        retryTimeout = setTimeout(connect, 3000);
      };
    }

    connect();
    return () => { es?.close(); clearTimeout(retryTimeout); };
  }, []);

  return words;
}
```

## When to use me
Use this skill when implementing the SSE endpoint or the `useWordCloud` hook.