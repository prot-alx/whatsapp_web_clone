import { useState, useEffect, useCallback } from "react";
import {
  getChatHistory,
  sendMessage,
  receiveMessage,
  deleteNotification,
} from "../api/api";
import { ChatState, Message } from "./types";
import { Credentials } from "../api/interfaces";

interface UseChatMessagesProps extends Credentials {
  chatId: string | null;
}

export const useChatMessages = ({
  idInstance,
  apiTokenInstance,
  chatId,
}: UseChatMessagesProps) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Загрузка истории сообщений
  const loadHistory = useCallback(async () => {
    if (!chatId) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

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
        .filter((msg): msg is Message => msg !== null);

      setState((prev) => ({
        ...prev,
        messages: formattedHistory,
        isLoading: false,
      }));
    } catch (error) {
      if (error instanceof Error && error.message.includes("429")) {
        setState((prev) => ({
          ...prev,
          error: "Загрузка истории... (2 сек)",
        }));

        // Повторный запрос через 2 секунды
        setTimeout(() => {
          loadHistory();
        }, 2000);
      } else {
        setState((prev) => ({
          ...prev,
          error: "Не удалось загрузить историю чата",
          isLoading: false,
        }));
      }
    }
  }, [idInstance, apiTokenInstance, chatId]);

  // Отправка сообщения
  const handleSendMessage = async (text: string) => {
    if (!chatId || !text.trim()) return false;

    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      sender: "me",
      text: text.trim(),
      timestamp: Date.now(),
      status: "sending",
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    try {
      await sendMessage({ idInstance, apiTokenInstance }, chatId, text);

      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sent" } : msg
        ),
      }));

      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "error" } : msg
        ),
      }));

      return false;
    }
  };

  // Получение новых сообщений через polling
  useEffect(() => {
    let isSubscribed = true;
    let pollingTimeout: number | null = null;
    // Создаем контроллер для отмены запросов
    const abortController = new AbortController();

    const processNotification = async () => {
      if (!idInstance || !apiTokenInstance || !isSubscribed) return;

      try {
        const notification = await receiveMessage(
          {
            idInstance,
            apiTokenInstance,
          },
          // Передаем signal в запрос
          { signal: abortController.signal }
        );

        if (notification && isSubscribed) {
          const { body, receiptId } = notification;

          if (body.typeWebhook === "incomingMessageReceived") {
            const textMessage = body.messageData?.textMessageData?.textMessage;

            if (textMessage && body.senderData) {
              setState((prev) => ({
                ...prev,
                messages: [
                  ...prev.messages,
                  {
                    id: `${body.timestamp}-${Math.random()}`,
                    sender:
                      body.senderData.senderName ?? body.senderData.sender,
                    text: textMessage,
                    timestamp: body.timestamp * 1000,
                    status: "sent",
                  },
                ],
              }));
            }
          }

          await deleteNotification(
            { idInstance, apiTokenInstance },
            receiptId,
            // Также передаем signal в запрос удаления уведомления
            { signal: abortController.signal }
          );
        }

        if (isSubscribed) {
          processNotification();
        }
      } catch (error) {
        // Проверяем не была ли ошибка вызвана отменой запроса
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        pollingTimeout = setTimeout(processNotification, 10000);
      }
    };

    if (chatId) {
      loadHistory();
      processNotification();
    }

    return () => {
      isSubscribed = false;
      if (pollingTimeout) clearTimeout(pollingTimeout);
      // Отменяем все запросы при размонтировании или изменении chatId
      abortController.abort();
    };
  }, [idInstance, apiTokenInstance, chatId, loadHistory]);
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage: handleSendMessage,
  };
};
