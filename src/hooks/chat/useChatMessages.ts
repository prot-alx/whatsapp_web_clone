import { useState, useEffect, useCallback } from "react";
import { Credentials } from "../../api/interfaces";
import { Message } from "../types";
import { useChatHistory, useNotifications, useSendMessage } from ".";

interface UseChatMessagesProps extends Credentials {
  chatId: string;
}

export const useChatMessages = ({
  idInstance,
  apiTokenInstance,
  chatId,
}: UseChatMessagesProps) => {
  const { history, loading, error, loadHistory } = useChatHistory({
    idInstance,
    apiTokenInstance,
    chatId,
  });
  const [messages, setMessages] = useState<Message[]>([]);

  // Обновляем общий список сообщений при загрузке истории
  useEffect(() => {
    setMessages(history);
  }, [history]);

  // Функция для добавления нового сообщения
  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Функция для обновления статуса сообщения (например, после отправки)
  const updateMessageStatus = useCallback(
    (id: string, status: Message["status"]) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
      );
    },
    []
  );

  // Получаем функцию отправки сообщения из соответствующего хука
  const { send } = useSendMessage({ idInstance, apiTokenInstance, chatId });

  // Обёртка для отправки сообщения, которая обновляет локальный стейт
  const sendMessage = async (text: string): Promise<boolean> => {
    return await send(text, addMessage, updateMessageStatus);
  };

  // Подключаем polling уведомлений
  useNotifications({
    idInstance,
    apiTokenInstance,
    onNewMessage: addMessage,
  });

  return {
    messages,
    isLoading: loading,
    error,
    sendMessage,
    loadHistory,
  };
};
