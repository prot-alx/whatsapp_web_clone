import { useState, useRef, useEffect, useCallback } from "react";
import { sendMessage, receiveMessage, deleteNotification } from "../api/api";
import { Message } from "../components/Messages";

interface UseMessagesProps {
  idInstance: string;
  apiTokenInstance: string;
}

export const useMessages = ({
  idInstance,
  apiTokenInstance,
}: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const pollingTimeoutRef = useRef<number>();
  const isComponentMounted = useRef(true);

  const handleSendMessage = async (chatId: string, newMessage: string) => {
    // Проверяем, что сообщение и ID чата не пустые
    if (!newMessage.trim() || !chatId.trim()) return false;

    // Генерируем уникальный ID для сообщения
    const messageId = Date.now().toString();

    // Сетаем сообщения в массив со статусом sending
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: "me",
        text: newMessage,
        timestamp: Date.now(),
        status: "sending",
      },
    ]);

    // Пытаемся обновить состояние, либо sent, либо error
    try {
      await sendMessage(idInstance, apiTokenInstance, chatId, newMessage);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sent" as const } : msg
        )
      );
      return true;
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "error" as const } : msg
        )
      );
      return false;
    }
  };

  const processNotification = useCallback(async () => {
    if (!isComponentMounted.current) return;

    try {
      const notification = await receiveMessage(idInstance, apiTokenInstance);

      if (notification && isComponentMounted.current) {
        const { body, receiptId } = notification;
        
        if (body.typeWebhook === "incomingMessageReceived") {
          const textMessage = body.messageData?.textMessageData?.textMessage;
          if (textMessage) {
            setMessages((prev) => {
              return [
                ...prev,
                {
                  id: `${body.timestamp}-${Math.random()}`,
                  sender: body.senderData.senderName ?? body.senderData.sender,
                  text: textMessage,
                  timestamp: body.timestamp * 1000,
                  status: "sent",
                },
              ];
            });
          }
        }

        await deleteNotification(idInstance, apiTokenInstance, receiptId);
      }

      if (isComponentMounted.current) {
        pollingTimeoutRef.current = setTimeout(processNotification, 1000);
      }
    } catch (error) {
      console.error("Ошибка при получении сообщений:", error);
      if (isComponentMounted.current) {
        pollingTimeoutRef.current = setTimeout(processNotification, 5000);
      }
    }
  }, [idInstance, apiTokenInstance]);

  useEffect(() => {
    isComponentMounted.current = true;
    processNotification();

    return () => {
      isComponentMounted.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [processNotification]);

  return {
    messages,
    sendMessage: handleSendMessage,
  };
};
