import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChatList } from "../hooks/useChatList";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatInfo } from "../api/interfaces";
import { ErrorState, LoadingState } from ".";
import { ChatSidebar } from "./ChatSideBar";
import { ChatHeader, ChatInput, ChatMain } from "./ChatMain";

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

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (selectedChat) {
        await sendMessage(message);
      }
    },
    [selectedChat, sendMessage]
  );

  const handleBackToList = useCallback(() => {
    setSelectedChat(null);
  }, []);

  if (isChatsLoading) {
    return <LoadingState />;
  }

  console.log(selectedChat)

  return (
    <div className="whatsapp-container">
      <div className="whatsapp-layout">
        <div
          className={`whatsapp-sidebar
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

        <div
          className={`whatsapp-main-content relative flex-1 flex flex-col bg-white md:rounded-r-lg
            ${selectedChat ? "block" : "hidden md:block"}`}
        >
          {selectedChat ? (
            <>
              <ChatHeader
                chatId={selectedChat.name ?? selectedChat.id.split("@")[0]}
                onBack={handleBackToList}
              />
              <ChatMain
                selectedChat={selectedChat}
                messages={messages}
                messagesEndRef={messagesEndRef}
                isLoading={isMessagesLoading}
                error={messagesError}
              />
              <ChatInput key={selectedChat.id} onSend={handleSendMessage} />
            </>
          ) : (
            <div className="whatsapp-empty-state">
              <p>Выберите чат для начала общения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
