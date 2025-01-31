import { useState, useEffect } from "react";
import { getChatHistory } from "../api/api";
import { Message } from "../components/ChatMain/Messages";

interface UseChatHistoryProps {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string | null;
}

export const useChatHistory = ({
  idInstance,
  apiTokenInstance,
  chatId,
}: UseChatHistoryProps) => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchHistory = async () => {
      if (!chatId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getChatHistory(
          { idInstance, apiTokenInstance },
          chatId,
          100
        );

        if (isSubscribed) {
          const formattedHistory: Message[] = response
            .map((msg) => {
              const messageText =
                msg.textMessage ?? msg.extendedTextMessage?.text;

              if (!messageText) {
                return null;
              }

              return {
                id: msg.idMessage,
                sender:
                  msg.type === "outgoing"
                    ? "me"
                    : msg.senderData?.sender ?? msg.chatId,
                text: messageText,
                timestamp: msg.timestamp * 1000,
                status: "sent",
              };
            })
            .filter((msg): msg is Message => msg !== null);

          setChatHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Ошибка при загрузке истории:", error);
        if (isSubscribed) {
          setError("Не удалось загрузить историю чата");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    if (chatId) {
      fetchHistory();
    } else {
      setChatHistory([]);
    }

    return () => {
      isSubscribed = false;
    };
  }, [idInstance, apiTokenInstance, chatId]);

  return { chatHistory, isLoading, error };
};
