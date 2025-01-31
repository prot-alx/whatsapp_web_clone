import { useState, useEffect } from "react";
import { getChats } from "../api/api";
import type { ChatInfo, Credentials } from "../api/interfaces";

export const useChatList = ({ idInstance, apiTokenInstance }: Credentials) => {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    let retryTimeout: number;

    const fetchChats = async (retryCount = 0) => {
      try {
        setError(null);
        const chatsList = await getChats({ idInstance, apiTokenInstance });
        if (isSubscribed) {
          setChats(chatsList);
          setIsLoading(false);
        }
      } catch (error) {
        if (!isSubscribed) return;

        if (error instanceof Error && error.message.includes("429")) {
          const delay = Math.min(2000 * Math.pow(2, retryCount), 32000);
          setError(`Загрузка списка чатов... (${delay / 1000} сек)`);

          retryTimeout = setTimeout(() => {
            if (isSubscribed) {
              fetchChats(retryCount + 1);
            }
          }, delay);
        } else {
          setError("Не удалось загрузить список чатов");
          setIsLoading(false);
        }
      }
    };

    if (idInstance && apiTokenInstance) {
      setError("Загрузка списка чатов...");
      const initialDelay = setTimeout(() => {
        fetchChats();
      }, 10);

      const interval = setInterval(() => fetchChats(), 60000);

      return () => {
        isSubscribed = false;
        clearInterval(interval);
        clearTimeout(initialDelay);
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
      };
    }
  }, [idInstance, apiTokenInstance]);

  return { chats, isLoading, error };
};
