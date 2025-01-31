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
    } catch {
      setState((prev) => ({
        ...prev,
        error: "Не удалось загрузить историю чата",
        isLoading: false,
      }));
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

    const processNotification = async () => {
      if (!idInstance || !apiTokenInstance) return;

      try {
        const notification = await receiveMessage({
          idInstance,
          apiTokenInstance,
        });

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

          await deleteNotification({ idInstance, apiTokenInstance }, receiptId);
        }

        pollingTimeout = setTimeout(processNotification, 1000);
      } catch {
        pollingTimeout = setTimeout(processNotification, 5000);
      }
    };

    if (chatId) {
      loadHistory();
      processNotification();
    }

    return () => {
      isSubscribed = false;
      if (pollingTimeout) clearTimeout(pollingTimeout);
    };
  }, [idInstance, apiTokenInstance, chatId, loadHistory]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage: handleSendMessage,
  };
};
