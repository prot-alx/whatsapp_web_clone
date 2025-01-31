import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useMessages } from "../hooks/useMessages";
import { ChatInfo } from "../api/interfaces";
import { ChatMain } from "./ChatMain";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useChatList } from "../hooks/useChatList";
import { ChatSidebar } from "./ChatSideBar";
import { useChatHistory } from "../hooks/useChatHistory";
import ChatInput from "./ChatMain/ChatInput";
interface ChatProps {
  idInstance: string;
  apiTokenInstance: string;
  onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({
  idInstance,
  apiTokenInstance,
  onLogout,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Получаем список чатов
  const {
    chats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useChatList({
    idInstance,
    apiTokenInstance,
  });

  // Получаем историю выбранного чата
  const { chatHistory, isLoading: isHistoryLoading } = useChatHistory({
    idInstance,
    apiTokenInstance,
    chatId: selectedChat?.id ?? null,
  });

  // Получаем новые сообщения
  const { messages: newMessages, sendMessage } = useMessages({
    idInstance,
    apiTokenInstance,
  });

  const chatId = useMemo(
    () => selectedChat?.id.split("@")[0] ?? "",
    [selectedChat]
  );

  // Фильтруем и объединяем сообщения
  const allMessages = useMemo(() => {
    if (!selectedChat) return [];

    const cleanChatId = selectedChat.id.split("@")[0];

    return [
      ...chatHistory,
      ...newMessages.filter(
        (msg) =>
          msg.sender === "me" ||
          msg.sender === selectedChat.id ||
          msg.sender === cleanChatId
      ),
    ].sort((a, b) => a.timestamp - b.timestamp);
  }, [chatHistory, newMessages, selectedChat]);

  useEffect(() => {
    if (!isHistoryLoading && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [allMessages, isHistoryLoading, selectedChat]);

  const handleChatSelect = useCallback((chat: ChatInfo) => {
    setSelectedChat(chat);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (selectedChat && newMessage.trim()) {
      sendMessage(chatId, newMessage);
      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat, newMessage, chatId, sendMessage]);

  const onLogoutCallback = useCallback(() => {
    onLogout();
  }, [onLogout]);

  if (isChatsLoading) {
    return <LoadingState />;
  }

  if (chatsError) {
    return <ErrorState error={chatsError} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        onLogout={onLogoutCallback}
      />
      <ChatMain
        selectedChat={selectedChat}
        messages={allMessages}
        messagesEndRef={messagesEndRef}
        onLogout={onLogout}
        isLoading={isHistoryLoading}
      />
      {selectedChat && (
        <ChatInput
          chatId={chatId}
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSend={handleSendMessage}
          hidePhoneInput={true}
        />
      )}
    </div>
  );
};

export default Chat;
