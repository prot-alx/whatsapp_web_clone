import { useState, useEffect, useRef } from "react";
import { getChats } from "../../api/api";
import type { ChatInfo, Credentials } from "../../api/interfaces";

export const useChatList = ({ idInstance, apiTokenInstance }: Credentials) => {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const retryTimeoutRef = useRef<number>();
  const isRetryingRef = useRef(false);

  useEffect(() => {
    let isSubscribed = true;

    const fetchChats = async () => {
      if (isRetryingRef.current) return;

      try {
        setError(null);
        const chatsList = await getChats({ idInstance, apiTokenInstance });

        if (isSubscribed) {
          setChats(chatsList);
          setIsLoading(false);
          isRetryingRef.current = false;
        }
      } catch (error) {
        if (!isSubscribed) return;

        if (error instanceof Error && error.message.includes("429")) {
          isRetryingRef.current = true;
          setError("Загрузка списка чатов... (2 сек)");

          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = setTimeout(() => {
            if (isSubscribed) {
              isRetryingRef.current = false;
              fetchChats();
            }
          }, 2000);
        } else {
          setError("Не удалось загрузить список чатов");
          setIsLoading(false);
          isRetryingRef.current = false;
        }
      }
    };

    if (idInstance && apiTokenInstance) {
      setIsLoading(true);
      setError("Загрузка списка чатов...");

      const initialDelay = setTimeout(fetchChats, 10);
      const interval = setInterval(fetchChats, 60000);

      return () => {
        isSubscribed = false;
        clearInterval(interval);
        clearTimeout(initialDelay);
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      };
    }
  }, [idInstance, apiTokenInstance]);

  return { chats, isLoading, error };
};
