import { useEffect, useRef, useState } from "react";

import { WordCloudWord, WordCloudResponse } from "../../../shared/types";

interface UseWordCloudResult {
  words: WordCloudWord[];
  isConnected: boolean;
}

export function useWordCloud(): UseWordCloudResult {
  const [words, setWords] = useState<WordCloudWord[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const retryCountRef = useRef(0);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: number | undefined;
    let isCancelled = false;

    const fetchSnapshot = async () => {
      try {
        const response = await fetch("/api/wordcloud");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as WordCloudResponse;
        if (!isCancelled) {
          setWords(payload.words);
        }
      } catch {
        // Snapshot fetch failures are handled by retry logic.
      }
    };

    const scheduleReconnect = () => {
      retryCountRef.current += 1;
      const delay = Math.min(1000 * 2 ** retryCountRef.current, 15000);
      reconnectTimer = window.setTimeout(connect, delay);
    };

    const connect = () => {
      if (isCancelled) {
        return;
      }

      eventSource = new EventSource("/api/stream");

      eventSource.addEventListener("open", () => {
        retryCountRef.current = 0;
        setIsConnected(true);
        void fetchSnapshot();
      });

      eventSource.addEventListener("wordcloud", (event) => {
        try {
          const payload = JSON.parse(event.data) as WordCloudResponse;
          if (!isCancelled) {
            setWords(payload.words);
          }
        } catch {
          // Ignore malformed stream events.
        }
      });

      eventSource.onerror = () => {
        if (isCancelled) {
          return;
        }

        setIsConnected(false);
        eventSource?.close();
        scheduleReconnect();
      };
    };

    void fetchSnapshot();
    connect();

    return () => {
      isCancelled = true;

      if (reconnectTimer !== undefined) {
        window.clearTimeout(reconnectTimer);
      }

      eventSource?.close();
    };
  }, []);

  return { words, isConnected };
}
