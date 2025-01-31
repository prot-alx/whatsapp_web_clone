import { useState, useRef, useEffect, useCallback } from "react";
import { sendMessage, receiveMessage, deleteNotification } from "../api/api";
import { Message } from "../components/ChatMain/Messages";

interface UseMessagesProps {
  idInstance: string;
  apiTokenInstance: string;
}

export const useMessages = ({
  idInstance,
  apiTokenInstance,
}: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const pollingTimeoutRef = useRef<number | null>(null);

  const isReady = idInstance && apiTokenInstance;

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const updateMessageStatus = (messageId: string, status: "sent" | "error") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
    );
  };

  const handleSendMessage = async (chatId: string, newMessage: string) => {
    if (!isReady || !newMessage.trim() || !chatId.trim()) return false;

    const messageId = Date.now().toString();

    addMessage({
      id: messageId,
      sender: "me",
      text: newMessage,
      timestamp: Date.now(),
      status: "sending",
    });

    try {
      await sendMessage({ idInstance, apiTokenInstance }, chatId, newMessage);
      updateMessageStatus(messageId, "sent");
      return true;
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      updateMessageStatus(messageId, "error");
      return false;
    }
  };

  const processNotification = useCallback(async () => {
    if (!isReady) return;

    try {
      const notification = await receiveMessage({
        idInstance,
        apiTokenInstance,
      });

      if (notification) {
        const { body, receiptId } = notification;

        if (body.typeWebhook === "incomingMessageReceived") {
          const textMessage = body.messageData?.textMessageData?.textMessage;
          if (textMessage) {
            addMessage({
              id: `${body.timestamp}-${Math.random()}`,
              sender: body.senderData.senderName ?? body.senderData.sender,
              text: textMessage,
              timestamp: body.timestamp * 1000,
              status: "sent",
            });
          }
        }

        await deleteNotification({ idInstance, apiTokenInstance }, receiptId);
      }

      pollingTimeoutRef.current = setTimeout(processNotification, 1000);
    } catch (error) {
      if (error instanceof Error && !error.message.includes("undefined")) {
        console.error("Ошибка при получении сообщения:", error);
      }
      pollingTimeoutRef.current = setTimeout(processNotification, 5000);
    }
  }, [idInstance, apiTokenInstance, isReady]);

  useEffect(() => {
    if (isReady) {
      processNotification();
    }

    return () => {
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
    };
  }, [processNotification, isReady]);

  return {
    messages,
    sendMessage: handleSendMessage,
  };
};
