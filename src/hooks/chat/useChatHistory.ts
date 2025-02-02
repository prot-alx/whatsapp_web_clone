import { useState, useCallback } from "react";
import { getChatHistory } from "../../api/api";
import { Credentials } from "../../api/interfaces";
import { Message } from "../types";


interface UseChatHistoryProps extends Credentials {
  chatId: string;
}

export const useChatHistory = ({ idInstance, apiTokenInstance, chatId }: UseChatHistoryProps) => {
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!chatId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getChatHistory(
        { idInstance, apiTokenInstance },
        chatId,
        100
      );

      const formattedHistory = response
        .map((msg) => {
          const messageText = msg.textMessage ?? msg.extendedTextMessage?.text;
          if (!messageText) return null;

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
        .filter((msg): msg is Message => msg !== null)
        .sort((a, b) => a.timestamp - b.timestamp);

      setHistory(formattedHistory);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.message.includes("429")) {
        setError("Загрузка истории... (2 сек)");
        setTimeout(loadHistory, 2000);
      } else {
        setError("Не удалось загрузить историю чата");
        setLoading(false);
      }
    }
  }, [idInstance, apiTokenInstance, chatId]);

  return { history, loading, error, loadHistory };
};