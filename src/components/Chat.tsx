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

  if (isChatsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
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
      <ChatMain
        selectedChat={selectedChat}
        messages={messages}
        messagesEndRef={messagesEndRef}
        onLogout={onLogout}
        isLoading={isMessagesLoading}
        error={messagesError}
      />
      {selectedChat && (
        <ChatInput
          chatId={selectedChat.id.split("@")[0]}
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
