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

    const fetchSnapshot = async () => {
      const response = await fetch("/api/wordcloud");
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as WordCloudResponse;
      setWords(payload.words);
    };

    const scheduleReconnect = () => {
      retryCountRef.current += 1;
      const delay = Math.min(1000 * 2 ** retryCountRef.current, 15000);
      reconnectTimer = window.setTimeout(connect, delay);
    };

    const connect = () => {
      eventSource = new EventSource("/api/stream");

      eventSource.addEventListener("open", () => {
        retryCountRef.current = 0;
        setIsConnected(true);
      });

      eventSource.addEventListener("wordcloud", (event) => {
        const payload = JSON.parse(event.data) as WordCloudResponse;
        setWords(payload.words);
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource?.close();
        scheduleReconnect();
      };
    };

    void fetchSnapshot();
    connect();

    return () => {
      if (reconnectTimer !== undefined) {
        window.clearTimeout(reconnectTimer);
      }
      eventSource?.close();
    };
  }, []);

  return { words, isConnected };
}
