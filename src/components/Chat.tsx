import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChatList } from "../hooks/useChatList";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatInfo } from "../api/interfaces";
import { ChatMain } from "./ChatMain";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { ChatSidebar } from "./ChatSideBar";
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

  const {
    chats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useChatList({
    idInstance,
    apiTokenInstance,
  });

  const chatId = selectedChat?.id ?? null;
  const {
    messages,
    isLoading: isMessagesLoading,
    error: messagesError,
    sendMessage,
  } = useChatMessages({
    idInstance,
    apiTokenInstance,
    chatId,
  });

  // Скролл к последнему сообщению
  useEffect(() => {
    if (!isMessagesLoading && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, isMessagesLoading, chatId]);

  const handleSendMessage = useCallback(async () => {
    if (selectedChat && newMessage.trim()) {
      const success = await sendMessage(newMessage);
      if (success) {
        setNewMessage("");
      }
    }
  }, [selectedChat, newMessage, sendMessage]);

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (isChatsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="whatsapp-container h-screen bg-whatsapp-background">
      {/* Основной контейнер */}
      <div className="whatsapp-layout w-full h-full flex relative">
        {/* Сайдбар (всегда виден на десктопе, на мобильном скрыт при выборе чата) */}
        <div
          className={`whatsapp-sidebar w-full md:w-[400px] bg-white md:rounded-l-lg
            ${selectedChat ? "hidden md:block" : "block"}`}
        >
          {chatsError ? (
            <ErrorState error={chatsError} />
          ) : (
            <ChatSidebar
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={setSelectedChat}
              onLogout={onLogout}
            />
          )}
        </div>

        {/* Основная часть с чатом (на мобильном появляется при выборе чата) */}
        <div
          className={`whatsapp-main-content relative flex-1 flex flex-col bg-white md:rounded-r-lg
            ${selectedChat ? "block" : "hidden md:block"}`}
        >
          {selectedChat ? (
            <>
              <ChatMain
                selectedChat={selectedChat}
                messages={messages}
                messagesEndRef={messagesEndRef}
                isLoading={isMessagesLoading}
                error={messagesError}
                onBack={handleBackToList}
              />
              <ChatInput
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            <div className="whatsapp-empty-state flex items-center justify-center h-full">
              <p className="text-gray-500">Выберите чат для начала общения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
