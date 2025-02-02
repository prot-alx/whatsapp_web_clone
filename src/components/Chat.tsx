import { useState, useRef, useEffect } from "react";
import { useChatList } from "../hooks/side/useChatList";
import { ChatInfo } from "../api/interfaces";
import { ErrorState, LoadingState } from ".";
import { ChatSidebar } from "./ChatSideBar";
import { ChatHeader, ChatInput, ChatMain } from "./ChatMain";
import { useChatMessages } from "../hooks/chat";

interface ChatProps {
  idInstance: string;
  apiTokenInstance: string;
  onLogout: () => void;
}

const Chat = ({ idInstance, apiTokenInstance, onLogout }: ChatProps) => {
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
    loadHistory,
  } = useChatMessages({
    idInstance,
    apiTokenInstance,
    chatId: chatId as string,
  });

  useEffect(() => {
    if (chatId) {
      loadHistory();
    }
  }, [chatId, loadHistory]);

  // Скролл к последнему сообщению
  useEffect(() => {
    if (!isMessagesLoading && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages, isMessagesLoading, chatId]);

  const handleSendMessage = async (message: string) => {
    if (selectedChat) {
      await sendMessage(message);
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (isChatsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="whatsapp-container">
      <div className="whatsapp-layout">
        <div
          className={`whatsapp-sidebar ${
            selectedChat ? "hidden md:block" : "block"
          }`}
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
          className={`whatsapp-main-content relative flex-1 flex flex-col h-full bg-white md:rounded-r-lg ${
            selectedChat ? "block" : "hidden md:block"
          }`}
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
